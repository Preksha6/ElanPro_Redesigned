/**
 * Returns a guaranteed valid image URL for any product
 */
export function getProductImage(product) {
  if (!product) return '/product-images/image1.png';
  let img = String(product.image || '').trim();
  
  // If it matches imageX.png (from Supabase URL or local path)
  const matchPng = img.match(/image(\d+)\.png/i);
  if (matchPng) {
    return `/product-images/image${matchPng[1]}.png`;
  }

  // If it's an external CDN or official media URL (non-broken)
  if (img.startsWith('http') && !img.includes('supabase.co/storage')) {
    return img;
  }

  // If empty, null, or placeholder, assign deterministically
  if (!img || img === 'None' || img === 'null' || img.includes('placeholder')) {
    const key = normalizeModelKey(product.model || product.name || product.id);
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imgIdx = (hash % 31) + 1;
    return `/product-images/image${imgIdx}.png`;
  }

  if (!img.startsWith('/')) {
    return '/' + img;
  }

  return img;
}

import { supabase } from '@/lib/supabase';

const STORAGE_PRODUCTS_KEY = 'elanpro_admin_products_v3';
const STORAGE_DELETED_KEY = 'elanpro_admin_deleted_products_v3';

// Default Category Showcase imagery mapping
const CATEGORY_IMAGE_MAP = {
  "professional kitchen": "https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg",
  "retail refrigeration": "https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg",
  "vending solutions": "https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg",
  "beverage cooling": "https://elanpro.net/wp-content/uploads/2025/06/BEVERAGE.jpg",
  "pharma & medical": "https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg",
  "bar refrigeration": "https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg",
  "cold room solutions": "https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg",
  "confectionery showcase": "https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg",
  "ice machine & flakers": "https://elanpro.net/wp-content/uploads/2025/06/ice.jpg",
  "mini bar & mini fridge": "https://elanpro.net/wp-content/uploads/2025/06/Mini-Bar-2.jpg",
  "supermarket systems": "https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg",
  "water solutions": "https://elanpro.net/wp-content/uploads/2025/07/water-cooler_-min.jpg"
};

/**
 * Normalizes a model name to a clean unique alphanumeric key (e.g. "EGN 1500 C4" -> "egn1500c4")
 */
export function normalizeModelKey(str) {
  if (!str) return "";
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Cleans any raw multiline / unformatted string into structured specifications.
 */
export function sanitizeRawSpecs(rawText) {
  if (!rawText || typeof rawText !== 'string') return {};
  const normalized = rawText.replace(/\\n/g, '\n').replace(/\\r/g, '');
  const lines = normalized.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  const extracted = {};
  for (const line of lines) {
    // Dimension pattern: e.g. 375x875x1940
    const dimMatch = line.match(/(\d+)\s*[xX*×]\s*(\d+)\s*[xX*×]\s*(\d+)/);
    if (dimMatch && !extracted["Dimensions (WxDxH mm)"]) {
      extracted["Dimensions (WxDxH mm)"] = `${dimMatch[1]} x ${dimMatch[2]} x ${dimMatch[3]} mm`;
      continue;
    }

    // Temperature pattern: e.g. 4C ~ -18C or -2°C ~ 8°C
    const tempMatch = line.match(/(-?\d+)\s*°?[Cc]?\s*~\s*(-?\d+)\s*°?[Cc]?/);
    if (tempMatch && !extracted["Temperature Range (°C)"]) {
      extracted["Temperature Range (°C)"] = `${tempMatch[1]}°C ~ ${tempMatch[2]}°C`;
      continue;
    }

    // Power supply pattern: e.g. 220V/50Hz
    if (line.match(/\d+V\s*\/\s*\d+Hz/i)) {
      extracted["Power Supply"] = line;
      continue;
    }

    // SKU / Varieties: e.g. 60 Varieties (Max)
    if (line.toLowerCase().includes('varieties') || line.toLowerCase().includes('sku')) {
      extracted["SKU / Selection Capacity"] = line;
      continue;
    }

    // Power consumption / wattage: e.g. 422/24
    if (line.match(/^\d{2,4}\s*\/\s*\d{1,3}$/)) {
      extracted["Power Consumption (W)"] = line;
      continue;
    }
  }
  return extracted;
}

/**
 * Normalizes dimensions into a clean single-line format: e.g. "1375 x 875 x 1940 mm"
 */
export function formatCleanDimensions(rawDim) {
  if (!rawDim) return "";
  const str = String(rawDim).replace(/\\n/g, '\n');
  const match = str.match(/(\d+)\s*[xX*×]\s*(\d+)\s*[xX*×]\s*(\d+)/);
  if (match) {
    return `${match[1]} x ${match[2]} x ${match[3]} mm`;
  }
  const match2D = str.match(/(\d+)\s*[xX*×]\s*(\d+)/);
  if (match2D) {
    return `${match2D[1]} x ${match2D[2]} mm`;
  }
  const firstLine = str.split('\n')[0].trim();
  return firstLine.length > 30 ? firstLine.substring(0, 30) : firstLine;
}

/**
 * Cleans and formats raw temperature range strings
 */
export function formatCleanTemp(rawTemp) {
  if (!rawTemp) return "";
  const str = String(rawTemp).replace(/\\n/g, ' ').trim();
  const match = str.match(/(-?\d+)\s*°?[Cc]?\s*~\s*(-?\d+)\s*°?[Cc]?/);
  if (match) {
    return `${match[1]}°C ~ ${match[2]}°C`;
  }
  return str.split('\n')[0].trim();
}

/**
 * Checks if a name or model is an invalid parsing artifact
 */
export function isInvalidProduct(name, model, id) {
  const check = `${name || ''} ${model || ''} ${id || ''}`.toLowerCase();
  if (
    check.includes("attribute") ||
    check.includes("key features") ||
    check.includes("photo") ||
    check.includes("working") ||
    check.includes("particulars") ||
    check.includes("descriptions") ||
    !name || String(name).trim().length === 0
  ) {
    return true;
  }
  return false;
}

/**
 * Normalizes a database product record into a rich product entity with specifications & image.
 */
export function formatProductFromDB(row) {
  if (!row) return null;

  const rawName = String(row.name || "").trim();
  const rawId = String(row.id || "").trim();
  const rawModel = String(row.model || "").trim();

  if (isInvalidProduct(rawName, rawModel, rawId)) {
    return null;
  }

  // 1. Resolve model name and display title
  let model = rawModel;
  let title = rawName;

  if (!model) {
    const parts = rawName.split(' ');
    if (parts.length > 1 && parts[parts.length - 1].match(/^[A-Z0-9\-\/]+$/)) {
      model = parts.slice(-2).join(' ');
    } else {
      model = rawName;
    }
  }

  // 2. Parse Specifications directly from database JSONB + sanitize any raw unformatted strings
  let specs = {};
  if (row.specifications) {
    if (typeof row.specifications === 'string') {
      try {
        specs = JSON.parse(row.specifications);
      } catch (e) {
        specs = sanitizeRawSpecs(row.specifications);
      }
    } else if (typeof row.specifications === 'object') {
      specs = { ...row.specifications };
    }
  }

  // Clean specs key-values
  const cleanSpecs = {};
  Object.entries(specs).forEach(([k, v]) => {
    if (!k || !v) return;
    const cleanKey = String(k).replace(/\\n/g, ' ').trim();
    let cleanVal = String(v).replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // If the value itself has unformatted dimensions or temps, extract cleanly
    if (cleanVal.includes(' x ') || cleanVal.match(/\d+x\d+x\d+/)) {
      if (cleanKey.toLowerCase().includes('dimension')) {
        cleanVal = formatCleanDimensions(cleanVal);
      }
    }
    if (cleanKey.toLowerCase().includes('temp')) {
      cleanVal = formatCleanTemp(cleanVal);
    }
    cleanSpecs[cleanKey] = cleanVal;
  });

  // 3. Extract Features directly from database
  const rawFeatures = Array.isArray(row.features) 
    ? row.features 
    : (typeof row.features === 'string' ? row.features.split(/\r?\n/) : []);

  const cleanFeaturesList = [];
  rawFeatures.forEach(f => {
    if (!f || typeof f !== 'string') return;
    
    // Split any newline-separated feature lines
    const sublines = f.replace(/\\n/g, '\n').split('\n');
    sublines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.toLowerCase() === "key features" || trimmed.toLowerCase() === "attribute") return;

      if (trimmed.includes(':') && !trimmed.startsWith('http')) {
        const firstColon = trimmed.indexOf(':');
        const key = trimmed.substring(0, firstColon).trim();
        const val = trimmed.substring(firstColon + 1).trim();
        if (key && val && !cleanSpecs[key]) {
          cleanSpecs[key] = val;
        }
      } else {
        // If line is not pure numbers/dimensions
        if (!trimmed.match(/^\d+x\d+x\d+/) && !cleanFeaturesList.includes(trimmed)) {
          cleanFeaturesList.push(trimmed);
        }
      }
    });
  });

  // 4. Extract and sanitize clean single-line dimensions
  let dimensions = formatCleanDimensions(
    row.dimensions || 
    cleanSpecs["Dimensions (WxDxH mm)"] || 
    cleanSpecs["Dimensions (WxDxH inch)"] || 
    cleanSpecs["Dimension WxDxH (mm)"] || 
    cleanSpecs["Dimensions (mm)"] || 
    ""
  );

  // If row.dimensions contained extra unformatted spec text, parse it
  if (row.dimensions && String(row.dimensions).includes('\n')) {
    const extraSpecs = sanitizeRawSpecs(row.dimensions);
    Object.assign(cleanSpecs, extraSpecs);
    if (!dimensions && extraSpecs["Dimensions (WxDxH mm)"]) {
      dimensions = extraSpecs["Dimensions (WxDxH mm)"];
    }
  }

  if (dimensions && !cleanSpecs["Dimensions (WxDxH mm)"]) {
    cleanSpecs["Dimensions (WxDxH mm)"] = dimensions;
  }

  // 5. Category & Subcategory resolution
  let category = row.category || "Professional Kitchen";
  let subcategory = row.subcategory || category;

  const catUpper = String(row.category || "").toUpperCase();
  if (catUpper.includes("REACH IN") || catUpper.includes("UNDER COUNTER") || catUpper.includes("SALAD") || catUpper.includes("BLAST")) {
    category = "Professional Kitchen";
  } else if (catUpper.includes("VENDING")) {
    category = "Vending Solutions";
  } else if (catUpper.includes("CONDENSING") || catUpper.includes("COLD ROOM")) {
    category = "Cold Room Solutions";
  } else if (catUpper.includes("CONFECTIONERY") || catUpper.includes("PASTRY") || catUpper.includes("CAKE")) {
    category = "Confectionery Showcase";
  } else if (catUpper.includes("BAR") || catUpper.includes("WINE") || catUpper.includes("BEER")) {
    category = "Bar Refrigeration";
  } else if (catUpper.includes("ICE") || catUpper.includes("FLAKER")) {
    category = "Ice Machine & Flakers";
  } else if (catUpper.includes("MINI BAR") || catUpper.includes("MINI FRIDGE")) {
    category = "Mini Bar & Mini Fridge";
  } else if (catUpper.includes("SUPER MARKET") || catUpper.includes("ISLAND") || catUpper.includes("MULTIDECK")) {
    category = "Supermarket Systems";
  } else if (catUpper.includes("PHARMA") || catUpper.includes("MEDICAL") || catUpper.includes("VACCINE")) {
    category = "Pharma & Medical";
  } else if (catUpper.includes("WATER") || catUpper.includes("DISPENSER") || catUpper.includes("COOLER")) {
    category = "Water Solutions";
  } else if (catUpper.includes("RETAIL") || catUpper.includes("FREEZER") || catUpper.includes("CHEST")) {
    category = "Retail Refrigeration";
  }

  // 6. Product Image URL from database record (with reliable fallback)
  let image = row.image;
  const normKey = normalizeModelKey(model || title);
  const hash = normKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imgIdx = (hash % 31) + 1;
  const fallbackImg = `/product-images/image${imgIdx}.png`;

  if (!image || image === "null" || image.includes("placeholder")) {
    image = fallbackImg;
  } else if (!image.startsWith("http") && !image.startsWith("/")) {
    image = "/" + image;
  }

  // 7. Descriptive overview - clean natural formatting
  let description = row.description;
  if (description) {
    description = String(description)
      .replace(/\\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!description || description.length < 20 || description.includes('375x875') || description.includes('Varieties (Max)')) {
    const cap = cleanSpecs["Capacity (Liters)"] || cleanSpecs["Gross Volume (Litres)"] || cleanSpecs["SKU / Selection Capacity"] || cleanSpecs["Item Capacity (Pcs)"] || "";
    const temp = cleanSpecs["Temperature Range (°C)"] || cleanSpecs["Operating Temp Range (°C)"] || "";
    const ref = cleanSpecs["Refrigerant"] || cleanSpecs["Gas"] || "Eco-friendly refrigerant";
    description = `Commercial-grade ${subcategory || category} model ${model} engineered for high reliability, precise temperature stability, and optimal energy efficiency.${cap ? ' Features ' + cap + ' capacity rating.' : ''}${temp ? ' Operates in the ' + temp + ' temperature range.' : ''}${dimensions ? ' Dimensions: ' + dimensions + '.' : ''} Utilizes ${ref}.`;
  }

  return {
    id: rawId || normalizeModelKey(model),
    name: title,
    model: model,
    category: category,
    subcategory: subcategory,
    description: description,
    dimensions: dimensions,
    features: cleanFeaturesList.length > 0 ? cleanFeaturesList : [
      "Heavy-duty Commercial Construction",
      "Digital Temperature Controller with Display",
      "Optimized Dynamic Airflow Distribution",
      "High Efficiency Low GWP Refrigerant",
      "Tropicalized for 43°C Ambient Operation"
    ],
    specifications: cleanSpecs,
    image: image,
    badge: row.badge || (category === "Professional Kitchen" ? "Premium" : "Commercial Grade")
  };
}

/**
 * Deduplicates product arrays by Model and ID
 */
export function deduplicateProducts(productsList) {
  if (!Array.isArray(productsList)) return [];

  const seenModelKeys = new Set();
  const seenIds = new Set();
  const uniqueList = [];

  for (const product of productsList) {
    if (!product) continue;

    const normModel = normalizeModelKey(product.model || product.name);
    const normId = String(product.id || "").toLowerCase().trim();

    if (isInvalidProduct(product.name, product.model, product.id)) {
      continue;
    }

    if (normModel && seenModelKeys.has(normModel)) {
      continue;
    }
    if (normId && seenIds.has(normId)) {
      continue;
    }

    if (normModel) seenModelKeys.add(normModel);
    if (normId) seenIds.add(normId);

    uniqueList.push(product);
  }

  return uniqueList;
}

/**
 * Synchronous local persistent store reading
 */
export function getLocalAdminProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getLocalDeletedProductIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}

/**
 * Fetches products directly from the Supabase Database table
 */
export async function getProductsFromDB() {
  let dbProducts = [];

  // 1. Fetch directly from Supabase Database
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      dbProducts = data.map(formatProductFromDB).filter(Boolean);
    }
  } catch (err) {
    console.warn("Supabase database fetch error:", err);
  }

  // 2. Overlay any local modifications / creations
  const localProducts = getLocalAdminProducts();
  const deletedIds = getLocalDeletedProductIds();

  const productMap = new Map();

  // Load database items
  dbProducts.forEach(p => {
    const normKey = normalizeModelKey(p.model || p.name);
    if (!deletedIds.has(p.id) && !deletedIds.has(normKey)) {
      productMap.set(p.id, p);
    }
  });

  // Prepend local admin created / edited products
  localProducts.forEach(p => {
    const normKey = normalizeModelKey(p.model || p.name);
    if (!deletedIds.has(p.id) && !deletedIds.has(normKey)) {
      productMap.set(p.id, p);
    }
  });

  const uniqueCatalogue = deduplicateProducts(Array.from(productMap.values()));
  return uniqueCatalogue;
}

/**
 * Fetch a single product by ID or Model directly from database
 */
export async function getProductByIdFromDB(productId) {
  if (!productId) return null;
  const cleanId = decodeURIComponent(productId).trim();
  const normSearch = normalizeModelKey(cleanId);

  const allProducts = await getProductsFromDB();

  const match = allProducts.find(p => 
    p.id.toLowerCase() === cleanId.toLowerCase() ||
    normalizeModelKey(p.id) === normSearch ||
    normalizeModelKey(p.model) === normSearch ||
    (p.name && normalizeModelKey(p.name).includes(normSearch))
  );

  return match || null;
}

/**
 * Saves or modifies a product PERMANENTLY in the database
 */
export async function saveProductToDB(productPayload) {
  if (!productPayload || !productPayload.name) return { success: false, error: 'Product name is required' };

  const formatted = formatProductFromDB(productPayload);
  if (!formatted) return { success: false, error: 'Invalid product payload' };

  // 1. Save to Persistent LocalStorage cache immediately
  if (typeof window !== 'undefined') {
    try {
      const currentLocal = getLocalAdminProducts();
      const normKey = normalizeModelKey(formatted.model || formatted.name);
      
      const filtered = currentLocal.filter(p => 
        p.id !== formatted.id && 
        normalizeModelKey(p.model || p.name) !== normKey
      );
      filtered.unshift(formatted);
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(filtered));

      const deletedSet = getLocalDeletedProductIds();
      deletedSet.delete(formatted.id);
      deletedSet.delete(normKey);
      localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(Array.from(deletedSet)));

      window.dispatchEvent(new CustomEvent('elanpro-catalogue-updated', { detail: formatted }));
    } catch (e) {
      console.warn("LocalStorage save notice:", e);
    }
  }

  // 2. Persist to Supabase Database
  try {
    await supabase.from('products').upsert(formatted);
  } catch (err) {
    console.warn("Supabase upsert error:", err);
  }

  return { success: true, product: formatted };
}

/**
 * Deletes a product PERMANENTLY from the database
 */
export async function deleteProductFromDB(productId, modelName) {
  if (!productId) return { success: false };

  const normKey = normalizeModelKey(modelName || productId);

  // 1. Update Persistent LocalStorage immediately
  if (typeof window !== 'undefined') {
    try {
      const currentLocal = getLocalAdminProducts();
      const filtered = currentLocal.filter(p => p.id !== productId && normalizeModelKey(p.model || p.name) !== normKey);
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(filtered));

      const deletedSet = getLocalDeletedProductIds();
      deletedSet.add(productId);
      if (normKey) deletedSet.add(normKey);
      localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(Array.from(deletedSet)));

      window.dispatchEvent(new CustomEvent('elanpro-catalogue-updated', { detail: { deletedId: productId } }));
    } catch (e) {
      console.warn("LocalStorage delete notice:", e);
    }
  }

  // 2. Delete from Supabase Database
  try {
    await supabase.from('products').delete().eq('id', productId);
  } catch (err) {
    console.warn("Supabase delete error:", err);
  }

  return { success: true };
}
