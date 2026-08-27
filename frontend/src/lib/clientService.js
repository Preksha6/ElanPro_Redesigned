import { supabase } from './supabase';

export const INITIAL_CLIENTS = [
  { id: 'amul', name: "Amul", url: "https://elanpro.net/wp-content/uploads/2025/06/amul.png", industry: "Dairy & Ice Cream", featured: true },
  { id: 'baskin-robbins', name: "Baskin Robbins", url: "https://elanpro.net/wp-content/uploads/2025/06/baskin_robbins.png", industry: "Dairy & Ice Cream", featured: true },
  { id: 'coca-cola', name: "Coca-Cola", url: "https://elanpro.net/wp-content/uploads/2025/06/coca_cola.png", industry: "Beverage & Bars", featured: true },
  { id: 'pepsi', name: "Pepsi", url: "https://elanpro.net/wp-content/uploads/2025/06/pepsie.png", industry: "Beverage & Bars", featured: true },
  { id: 'dominos', name: "Domino's", url: "https://elanpro.net/wp-content/uploads/2025/06/dominos.png", industry: "QSR & Restaurants", featured: true },
  { id: 'mcdonalds', name: "McDonald's", url: "https://elanpro.net/wp-content/uploads/2025/06/mcdonalds.png", industry: "QSR & Restaurants", featured: true },
  { id: 'pizza-hut', name: "Pizza Hut", url: "https://elanpro.net/wp-content/uploads/2025/06/pizza_hut.png", industry: "QSR & Restaurants", featured: true },
  { id: 'taco-bell', name: "Taco Bell", url: "https://elanpro.net/wp-content/uploads/2025/06/taco_bell.png", industry: "QSR & Restaurants", featured: true },
  { id: 'costa-coffee', name: "Costa Coffee", url: "https://elanpro.net/wp-content/uploads/2025/06/costa_coffee.png", industry: "Cafes & Bakeries", featured: true },
  { id: 'haldirams', name: "Haldiram's", url: "https://elanpro.net/wp-content/uploads/2025/06/haldiram.png", industry: "QSR & Restaurants", featured: true },
  { id: 'blinkit', name: "Blinkit", url: "https://elanpro.net/wp-content/uploads/2025/06/blinkit.png", industry: "Retail & Quick Commerce", featured: true },
  { id: 'zepto', name: "Zepto", url: "https://elanpro.net/wp-content/uploads/2025/06/zepto.png", industry: "Retail & Quick Commerce", featured: true },
  { id: 'cadbury', name: "Cadbury", url: "https://elanpro.net/wp-content/uploads/2025/06/cadbury.png", industry: "Retail & Supermarkets", featured: true },
  { id: 'lipton', name: "Lipton", url: "https://elanpro.net/wp-content/uploads/2025/06/lipton.png", industry: "Beverage & Bars", featured: true },
  { id: 'taj', name: "Taj Hotels", url: "https://elanpro.net/wp-content/uploads/2025/06/taj.png", industry: "Hospitality & Hotels", featured: true },
  { id: 'hyatt', name: "Hyatt", url: "https://elanpro.net/wp-content/uploads/2025/06/hyatt.png", industry: "Hospitality & Hotels", featured: true },
  { id: 'hilton', name: "Hilton", url: "https://elanpro.net/wp-content/uploads/2025/06/hillon.png", industry: "Hospitality & Hotels", featured: true },
  { id: 'bacardi', name: "Bacardi", url: "https://elanpro.net/wp-content/uploads/2025/06/bacardi.png", industry: "Beverage & Bars", featured: true },
  { id: 'carlsberg', name: "Carlsberg", url: "https://elanpro.net/wp-content/uploads/2025/06/carlsberg.png", industry: "Beverage & Bars", featured: true }
];

const STORAGE_CLIENTS_KEY = 'elanpro_admin_clients_v2';
const STORAGE_DELETED_CLIENTS_KEY = 'elanpro_admin_deleted_clients_v2';

/**
 * Synchronously retrieves stored custom clients from localStorage
 */
export function getLocalClients() {
  if (typeof window === 'undefined') return INITIAL_CLIENTS;
  
  try {
    const rawCustom = localStorage.getItem(STORAGE_CLIENTS_KEY);
    const rawDeleted = localStorage.getItem(STORAGE_DELETED_CLIENTS_KEY);
    const deletedIds = new Set(rawDeleted ? JSON.parse(rawDeleted) : []);
    
    let customClients = rawCustom ? JSON.parse(rawCustom) : [];
    if (!Array.isArray(customClients)) customClients = [];

    // Combine custom clients with initial clients, respecting deletions & updates
    const clientMap = new Map();

    // 1. Load initial clients (unless deleted)
    INITIAL_CLIENTS.forEach(client => {
      if (!deletedIds.has(client.id)) {
        clientMap.set(client.id, client);
      }
    });

    // 2. Overlay / Prepend custom admin clients
    customClients.forEach(client => {
      if (!deletedIds.has(client.id)) {
        clientMap.set(client.id, client);
      }
    });

    return Array.from(clientMap.values());
  } catch (e) {
    console.error("Error reading local client cache:", e);
    return INITIAL_CLIENTS;
  }
}

/**
 * Retrieves all clients from database and local persistent store
 */
export async function getClientsFromDB() {
  const localList = getLocalClients();

  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      if (typeof window !== 'undefined') {
        const rawDeleted = localStorage.getItem(STORAGE_DELETED_CLIENTS_KEY);
        const deletedIds = new Set(rawDeleted ? JSON.parse(rawDeleted) : []);
        
        const mergedMap = new Map();
        localList.forEach(c => mergedMap.set(c.id, c));
        data.forEach(c => {
          if (!deletedIds.has(c.id)) {
            mergedMap.set(c.id, c);
          }
        });

        const finalList = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(finalList));
        return finalList;
      }
      return data;
    }
  } catch (err) {
    console.warn("Supabase clients query notice:", err);
  }

  return localList;
}

/**
 * Saves a new client or updates an existing client permanently across DB and website
 */
export async function saveClientToDB(client) {
  if (!client || !client.name) return { success: false, error: 'Name is required' };

  const cleanId = client.id || ('client-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
  const payload = {
    id: cleanId,
    name: String(client.name).trim(),
    url: String(client.url || '').trim(),
    industry: client.industry || "Commercial Enterprise",
    website: client.website ? String(client.website).trim() : "",
    featured: client.featured !== undefined ? Boolean(client.featured) : true,
    updated_at: new Date().toISOString()
  };

  // 1. Immediately persist to LocalStorage & dispatch instant UI update event
  if (typeof window !== 'undefined') {
    try {
      const rawCustom = localStorage.getItem(STORAGE_CLIENTS_KEY);
      let customList = rawCustom ? JSON.parse(rawCustom) : getLocalClients();
      if (!Array.isArray(customList)) customList = [];

      // Remove existing version of this client
      customList = customList.filter(c => c.id !== cleanId && c.name.toLowerCase() !== payload.name.toLowerCase());
      
      // Add new / updated client at the beginning
      customList.unshift(payload);
      localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(customList));

      // Remove from deleted list if present
      const rawDeleted = localStorage.getItem(STORAGE_DELETED_CLIENTS_KEY);
      if (rawDeleted) {
        const deletedIds = new Set(JSON.parse(rawDeleted));
        deletedIds.delete(cleanId);
        localStorage.setItem(STORAGE_DELETED_CLIENTS_KEY, JSON.stringify(Array.from(deletedIds)));
      }

      // Dispatch global broadcast event for instant UI update
      window.dispatchEvent(new CustomEvent('elanpro-clients-updated', { detail: payload }));
    } catch (e) {
      console.error("LocalStorage save error for clients:", e);
    }
  }

  // 2. Persist to Supabase Database in background
  try {
    const { data, error } = await supabase
      .from('clients')
      .upsert([payload])
      .select();

    if (error) {
      console.warn("Supabase clients table notice (changes safely stored in local persistent cache):", error.message);
    } else if (data) {
      console.log("Client saved to Supabase:", data);
    }
  } catch (err) {
    console.warn("Supabase client upsert error:", err);
  }

  return payload;
}

/**
 * Deletes a client permanently from database and website
 */
export async function deleteClientFromDB(clientId) {
  if (!clientId) return false;

  // 1. Immediately update LocalStorage & dispatch instant UI update event
  if (typeof window !== 'undefined') {
    try {
      const rawCustom = localStorage.getItem(STORAGE_CLIENTS_KEY);
      let customList = rawCustom ? JSON.parse(rawCustom) : getLocalClients();
      if (Array.isArray(customList)) {
        customList = customList.filter(c => c.id !== clientId);
        localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(customList));
      }

      // Add to deleted set
      const rawDeleted = localStorage.getItem(STORAGE_DELETED_CLIENTS_KEY);
      const deletedIds = new Set(rawDeleted ? JSON.parse(rawDeleted) : []);
      deletedIds.add(clientId);
      localStorage.setItem(STORAGE_DELETED_CLIENTS_KEY, JSON.stringify(Array.from(deletedIds)));

      // Dispatch global broadcast event for instant UI update
      window.dispatchEvent(new CustomEvent('elanpro-clients-updated', { detail: { deletedId: clientId } }));
    } catch (e) {
      console.error("LocalStorage delete error for clients:", e);
    }
  }

  // 2. Delete from Supabase Database in background
  try {
    await supabase.from('clients').delete().eq('id', clientId);
  } catch (err) {
    console.warn("Supabase client delete error:", err);
  }

  return true;
}
