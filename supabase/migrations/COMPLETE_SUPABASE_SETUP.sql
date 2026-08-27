-- =========================================================================
-- ELANPRO COMMERCIAL DATABASE: COMPLETE MIGRATION & SEED SCRIPT
-- =========================================================================

-- 1. STORAGE BUCKET POLICIES (Public View & Admin Management)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access on Products Bucket'
  ) THEN
    CREATE POLICY "Public Access on Products Bucket" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'products');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Uploads on Products Bucket'
  ) THEN
    CREATE POLICY "Admin Uploads on Products Bucket" 
    ON storage.objects FOR ALL 
    USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products');
  END IF;
END $$;

-- 2. CLIENTS TABLE SETUP
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  industry TEXT DEFAULT 'Commercial Enterprise',
  website TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Enable public read for clients'
  ) THEN
    CREATE POLICY "Enable public read for clients" 
    ON public.clients FOR SELECT 
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Enable admin write for clients'
  ) THEN
    CREATE POLICY "Enable admin write for clients" 
    ON public.clients FOR ALL 
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- 3. SEED CLIENTS DATA
INSERT INTO public.clients (id, name, url, industry, featured) VALUES
  ('amul', 'Amul', 'https://elanpro.net/wp-content/uploads/2025/06/amul.png', 'Dairy & Ice Cream', true),
  ('baskin-robbins', 'Baskin Robbins', 'https://elanpro.net/wp-content/uploads/2025/06/baskin_robbins.png', 'Dairy & Ice Cream', true),
  ('coca-cola', 'Coca-Cola', 'https://elanpro.net/wp-content/uploads/2025/06/coca_cola.png', 'Beverage & Bars', true),
  ('pepsi', 'Pepsi', 'https://elanpro.net/wp-content/uploads/2025/06/pepsie.png', 'Beverage & Bars', true),
  ('dominos', 'Domino''s', 'https://elanpro.net/wp-content/uploads/2025/06/dominos.png', 'QSR & Restaurants', true),
  ('mcdonalds', 'McDonald''s', 'https://elanpro.net/wp-content/uploads/2025/06/mcdonalds.png', 'QSR & Restaurants', true),
  ('pizza-hut', 'Pizza Hut', 'https://elanpro.net/wp-content/uploads/2025/06/pizza_hut.png', 'QSR & Restaurants', true),
  ('taco-bell', 'Taco Bell', 'https://elanpro.net/wp-content/uploads/2025/06/taco_bell.png', 'QSR & Restaurants', true),
  ('costa-coffee', 'Costa Coffee', 'https://elanpro.net/wp-content/uploads/2025/06/costa_coffee.png', 'Cafes & Bakeries', true),
  ('haldirams', 'Haldiram''s', 'https://elanpro.net/wp-content/uploads/2025/06/haldiram.png', 'QSR & Restaurants', true),
  ('blinkit', 'Blinkit', 'https://elanpro.net/wp-content/uploads/2025/06/blinkit.png', 'Retail & Quick Commerce', true),
  ('zepto', 'Zepto', 'https://elanpro.net/wp-content/uploads/2025/06/zepto.png', 'Retail & Quick Commerce', true),
  ('cadbury', 'Cadbury', 'https://elanpro.net/wp-content/uploads/2025/06/cadbury.png', 'Retail & Supermarkets', true),
  ('lipton', 'Lipton', 'https://elanpro.net/wp-content/uploads/2025/06/lipton.png', 'Beverage & Bars', true),
  ('taj', 'Taj Hotels', 'https://elanpro.net/wp-content/uploads/2025/06/taj.png', 'Hospitality & Hotels', true),
  ('hyatt', 'Hyatt', 'https://elanpro.net/wp-content/uploads/2025/06/hyatt.png', 'Hospitality & Hotels', true),
  ('hilton', 'Hilton', 'https://elanpro.net/wp-content/uploads/2025/06/hillon.png', 'Hospitality & Hotels', true),
  ('bacardi', 'Bacardi', 'https://elanpro.net/wp-content/uploads/2025/06/bacardi.png', 'Beverage & Bars', true),
  ('carlsberg', 'Carlsberg', 'https://elanpro.net/wp-content/uploads/2025/06/carlsberg.png', 'Beverage & Bars', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  industry = EXCLUDED.industry,
  featured = EXCLUDED.featured,
  updated_at = NOW();


-- ==========================================================================
-- Supabase Database Migration & Seed: Real-Time Commercial Products
-- Complete dataset of 170 products with models, dimensions, descriptions,
-- features, specifications, and extracted imagery.
-- ==========================================================================

-- 1. Ensure columns exist on products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT,
  ADD COLUMN IF NOT EXISTS specifications JSONB,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS badge TEXT;

-- 2. Enable Row Level Security & Public Read Policy
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
  END IF;
END $$;

-- 3. Clean up any legacy placeholder mock records
DELETE FROM public.products WHERE id LIKE 'cr-%' OR id LIKE 'fs-%' OR id LIKE 'sp-%';

-- 4. Seed all 170 authentic products with specifications, dimensions, features, and imagery
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-premium-chiller-freezer-egn-1500-c4', 'Reach-In Premium Chiller & Freezer EGN 1500 C4', 'EGN 1500 C4', 'Professional Kitchen', 'Reach-In Premium Chiller & Freezer', 'Commercial-grade Reach-In Premium Chiller & Freezer model EGN 1500 C4 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1300 capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 1420 x 875 x 2090 mm. Utilizes eco-friendly R 290 refrigerant.', '1420 x 875 x 2090', ARRAY['INNOVATIVE DESIGN', 'Flexible space utilisation,', 'Offers upto 100% extra storage', 'No sharp edges, Effortless cleaning', 'Upto 13 GN tray', 'ALL IN ONE DESIGN INNOVATIVE COLD AIR DISTRIBUTION THROUGH DUCT', 'Uniform distribution on each shelf', 'No contamination through moisture/air', '100 MM INSULATION', 'Better Hold Over', 'Better Pull Down', 'Low Power Consumption', 'Auto Defrosting', 'Digital Controller', 'Adjustable Shelves', 'Eco-Friendly Refrigerant', 'Tropicalized at 43°C ambient']::TEXT[], '{"Capacity (Liters)": "1300", "Dimensions (WxDxH mm)": "1420 x 875 x 2090", "Temperature Range (°C)": "-2°°C ~ 8°C", "GN Pan Compatibility": "GN 2/1, 2 x GN 1/1", "Refrigerant": "R 290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "6"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-premium-chiller-freezer-egn-1500-f4', 'Reach-In Premium Chiller & Freezer EGN 1500 F4', 'EGN 1500 F4', 'Professional Kitchen', 'Reach-In Premium Chiller & Freezer', 'Commercial-grade Reach-In Premium Chiller & Freezer model EGN 1500 F4 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1300 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1420 x 875 x 2090 mm. Utilizes eco-friendly R 290 refrigerant.', '1420 x 875 x 2090', ARRAY['INNOVATIVE DESIGN', 'Flexible space utilisation,', 'Offers upto 100% extra storage', 'No sharp edges, Effortless cleaning', 'Upto 13 GN tray', 'ALL IN ONE DESIGN INNOVATIVE COLD AIR DISTRIBUTION THROUGH DUCT', 'Uniform distribution on each shelf', 'No contamination through moisture/air', '100 MM INSULATION', 'Better Hold Over', 'Better Pull Down', 'Low Power Consumption', 'Auto Defrosting', 'Digital Controller', 'Adjustable Shelves', 'Eco-Friendly Refrigerant', 'Tropicalized at 43°C ambient']::TEXT[], '{"Capacity (Liters)": "1300", "Dimensions (WxDxH mm)": "1420 x 875 x 2090", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "GN 2/1, 2 x GN 1/1", "Refrigerant": "R 290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "6"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-premium-chiller-freezer-egn-700-c2', 'Reach-In Premium Chiller & Freezer EGN 700 C2', 'EGN 700 C2', 'Professional Kitchen', 'Reach-In Premium Chiller & Freezer', 'Commercial-grade Reach-In Premium Chiller & Freezer model EGN 700 C2 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 650 capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 740 x 875 x 2090 mm. Utilizes eco-friendly R 290 refrigerant.', '740 x 875 x 2090', ARRAY['INNOVATIVE DESIGN', 'Flexible space utilisation,', 'Offers upto 100% extra storage', 'No sharp edges, Effortless cleaning', 'Upto 13 GN tray', 'ALL IN ONE DESIGN INNOVATIVE COLD AIR DISTRIBUTION THROUGH DUCT', 'Uniform distribution on each shelf', 'No contamination through moisture/air', '100 MM INSULATION', 'Better Hold Over', 'Better Pull Down', 'Low Power Consumption', 'Auto Defrosting', 'Digital Controller', 'Adjustable Shelves', 'Eco-Friendly Refrigerant', 'Tropicalized at 43°C ambient']::TEXT[], '{"Capacity (Liters)": "650", "Dimensions (WxDxH mm)": "740 x 875 x 2090", "Temperature Range (°C)": "-2°°C ~ 8°C", "GN Pan Compatibility": "GN 2/1, 2 x GN 1/1", "Refrigerant": "R 290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-premium-chiller-freezer-egn-700-f2', 'Reach-In Premium Chiller & Freezer EGN 700 F2', 'EGN 700 F2', 'Professional Kitchen', 'Reach-In Premium Chiller & Freezer', 'Commercial-grade Reach-In Premium Chiller & Freezer model EGN 700 F2 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 650 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 740 x 875 x 2090 mm. Utilizes eco-friendly R 290 refrigerant.', '740 x 875 x 2090', ARRAY['INNOVATIVE DESIGN', 'Flexible space utilisation,', 'Offers upto 100% extra storage', 'No sharp edges, Effortless cleaning', 'Upto 13 GN tray', 'ALL IN ONE DESIGN INNOVATIVE COLD AIR DISTRIBUTION THROUGH DUCT', 'Uniform distribution on each shelf', 'No contamination through moisture/air', '100 MM INSULATION', 'Better Hold Over', 'Better Pull Down', 'Low Power Consumption', 'Auto Defrosting', 'Digital Controller', 'Adjustable Shelves', 'Eco-Friendly Refrigerant', 'Tropicalized at 43°C ambient']::TEXT[], '{"Capacity (Liters)": "650", "Dimensions (WxDxH mm)": "740 x 875 x 2090", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "GN 2/1, 2 x GN 1/1", "Refrigerant": "R 290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-premium-chiller-freezer-egn-2100-c', 'Under Counter Premium Chiller & Freezer EGN 2100 C', 'EGN 2100 C', 'Professional Kitchen', 'Under Counter Premium Chiller & Freezer', 'Commercial-grade Under Counter Premium Chiller & Freezer model EGN 2100 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 314 capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 1360 x 700 x 860 mm. Utilizes eco-friendly R600A refrigerant.', '1360 x 700 x 860', ARRAY['Heavy-duty lockable castors', 'Digital controller', 'Eco-friendly refrigerant', 'Adjustable Shelves']::TEXT[], '{"Capacity (Liters)": "314", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Temperature Range (°C)": "-2°°C ~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R600A", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-premium-chiller-freezer-egn-3100-c', 'Under Counter Premium Chiller & Freezer EGN 3100 C', 'EGN 3100 C', 'Professional Kitchen', 'Under Counter Premium Chiller & Freezer', 'Commercial-grade Under Counter Premium Chiller & Freezer model EGN 3100 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 1795 x 700 x 860 mm. Utilizes eco-friendly R600A refrigerant.', '1795 x 700 x 860', ARRAY['Heavy-duty lockable castors', 'Digital controller', 'Eco-friendly refrigerant', 'Adjustable Shelves']::TEXT[], '{"Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Temperature Range (°C)": "-2°°C ~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R600A", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-premium-chiller-freezer-egn-2100-f', 'Under Counter Premium Chiller & Freezer EGN 2100 F', 'EGN 2100 F', 'Professional Kitchen', 'Under Counter Premium Chiller & Freezer', 'Commercial-grade Under Counter Premium Chiller & Freezer model EGN 2100 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 314 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1360 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1360 x 700 x 860', ARRAY['Heavy-duty lockable castors', 'Digital controller', 'Eco-friendly refrigerant', 'Adjustable Shelves']::TEXT[], '{"Capacity (Liters)": "314", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-premium-chiller-freezer-egn-3100-f', 'Under Counter Premium Chiller & Freezer EGN 3100 F', 'EGN 3100 F', 'Professional Kitchen', 'Under Counter Premium Chiller & Freezer', 'Commercial-grade Under Counter Premium Chiller & Freezer model EGN 3100 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1795 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1795 x 700 x 860', ARRAY['Heavy-duty lockable castors', 'Digital controller', 'Eco-friendly refrigerant', 'Adjustable Shelves']::TEXT[], '{"Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('free-standing-cooler-freezer-hr-150u-ss', 'Free Standing Cooler & Freezer HR 150U SS', 'HR 150U SS', 'Professional Kitchen', 'Free Standing Cooler & Freezer', 'Commercial-grade Free Standing Cooler & Freezer model HR 150U SS engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 101 capacity rating. Operates in the 2°°C ~ +8°C temperature range. Dimensions: 600 x 605 x 810 mm.', '600 x 605 x 810', ARRAY['Dixell digital controller', 'Removable gasket', 'SS 304', 'Optional Features', 'Left or Right hinged door', 'Common - All Models', 'HACCP Compliance', 'Drawer in HC150 SS', 'Designed for high ambient conditions', 'Free-standing design', 'Eco-friendly refrigerant', 'Energy efficient design']::TEXT[], '{"Capacity (Liters)": "101", "Dimensions (WxDxH mm)": "600 x 605 x 810", "Temperature Range (°C)": "2°°C ~ +8°C", "Shelves / Drawers": "2 Shelves"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('free-standing-cooler-freezer-hr-135u-ss', 'Free Standing Cooler & Freezer HR 135U SS', 'HR 135U SS', 'Professional Kitchen', 'Free Standing Cooler & Freezer', 'Commercial-grade Free Standing Cooler & Freezer model HR 135U SS engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 101 capacity rating. Operates in the <-18°C temperature range. Dimensions: 600 x 605 x 810 mm.', '600 x 605 x 810', ARRAY['Dixell digital controller', 'Removable gasket', 'SS 304', 'Optional Features', 'Left or Right hinged door', 'Common - All Models', 'HACCP Compliance', 'Drawer in HC150 SS', 'Designed for high ambient conditions', 'Free-standing design', 'Eco-friendly refrigerant', 'Energy efficient design']::TEXT[], '{"Capacity (Liters)": "101", "Dimensions (WxDxH mm)": "600 x 605 x 810", "Temperature Range (°C)": "<-18°C", "Shelves / Drawers": "2 Shelves"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-es-900', 'Salad Counter ES 900', 'ES 900', 'Professional Kitchen', 'Salad Counter', 'Commercial-grade Salad Counter model ES 900 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 240 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 900 x 700 x 906 mm.', '900 x 700 x 906', ARRAY['GN compatible range', 'Common - All Models', 'HACCP Compliance', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Digital controller', 'Removable gasket']::TEXT[], '{"Capacity (Liters)": "240", "Dimensions (WxDxH mm)": "900 x 700 x 906", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "2 x GN 1/1 + 2 x GN 1/4", "Climate Class": "32°C", "Shelves": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image4.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-es-903', 'Salad Counter ES 903', 'ES 903', 'Professional Kitchen', 'Salad Counter', 'Commercial-grade Salad Counter model ES 903 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 360 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1365 x 700 x 906 mm.', '1365 x 700 x 906', ARRAY['GN compatible range', 'Common - All Models', 'HACCP Compliance', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Digital controller', 'Removable gasket']::TEXT[], '{"Capacity (Liters)": "360", "Dimensions (WxDxH mm)": "1365 x 700 x 906", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "4 x GN 1/1", "Climate Class": "32°C", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image4.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-with-prep-table-eps-200', 'Salad Counter with Prep Table EPS 200', 'EPS 200', 'Professional Kitchen', 'Salad Counter with Prep Table', 'Commercial-grade Salad Counter with Prep Table model EPS 200 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 257 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 903 x 700 x 1010 mm.', '903 x 700 x 1010', ARRAY['GN compatible range', 'Common - All Models', 'HACCP Compliance', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Digital controller', 'Removable gasket']::TEXT[], '{"Capacity (Liters)": "257", "Dimensions (WxDxH mm)": "903 x 700 x 1010", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "5 x GN 1/6", "Climate Class": "32°C", "Shelves": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image5.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-with-prep-table-eps-300', 'Salad Counter with Prep Table EPS 300', 'EPS 300', 'Professional Kitchen', 'Salad Counter with Prep Table', 'Commercial-grade Salad Counter with Prep Table model EPS 300 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 444 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1365 x 700 x 1010 mm.', '1365 x 700 x 1010', ARRAY['GN compatible range', 'Common - All Models', 'HACCP Compliance', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Digital controller', 'Removable gasket']::TEXT[], '{"Capacity (Liters)": "444", "Dimensions (WxDxH mm)": "1365 x 700 x 1010", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "8 x GN 1/6", "Climate Class": "32°C", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image5.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-with-prep-table-esh-2000', 'Salad Counter with Prep Table ESH 2000', 'ESH 2000', 'Professional Kitchen', 'Salad Counter with Prep Table', 'Commercial-grade Salad Counter with Prep Table model ESH 2000 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 337 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1510 x 800 x 1085 mm.', '1510 x 800 x 1085', ARRAY['Heavy duty lockable castors', 'GN pan compatible', 'Environment Friendly Refrigerant', 'Removable gasket Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "337", "Dimensions (WxDxH mm)": "1510 x 800 x 1085", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "7 x GN 1/3", "Climate Class": "38°C", "Shelves": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image6.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('salad-counter-with-prep-table-esh-3000', 'Salad Counter with Prep Table ESH 3000', 'ESH 3000', 'Professional Kitchen', 'Salad Counter with Prep Table', 'Commercial-grade Salad Counter with Prep Table model ESH 3000 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 497 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 2020 x 800 x 1085 mm.', '2020 x 800 x 1085', ARRAY['Heavy duty lockable castors', 'GN pan compatible', 'Environment Friendly Refrigerant', 'Removable gasket Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "497", "Dimensions (WxDxH mm)": "2020 x 800 x 1085", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "10 x GN 1/3", "Climate Class": "38°C", "Shelves": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image6.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('sushi-saladette-counter-evrx-1200', 'Sushi & Saladette Counter EVRX 1200', 'EVRX 1200', 'Professional Kitchen', 'Sushi & Saladette Counter', 'Commercial-grade Sushi & Saladette Counter model EVRX 1200 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range.', NULL, ARRAY['LED Lamp', 'Heated Front Glass', 'Top & Bottom Evaporator', 'Safety Curved Glass', 'Removable Glass for', 'easy Cleaning', 'Common - All Models', 'HACCP Compliance', 'Copper evaporator &', 'condenser', 'Dixell digital Controller', 'Options', 'Lid instead of glass', 'in EVRX', 'More options available']::TEXT[], '{"Salad Display Counter": "Sushi Case", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "5 x GN 1/4", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image7.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('sushi-saladette-counter-evrx-1400', 'Sushi & Saladette Counter EVRX 1400', 'EVRX 1400', 'Professional Kitchen', 'Sushi & Saladette Counter', 'Commercial-grade Sushi & Saladette Counter model EVRX 1400 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1400 x 335 x 435 mm.', '1400 x 335 x 435', ARRAY['LED Lamp', 'Heated Front Glass', 'Top & Bottom Evaporator', 'Safety Curved Glass', 'Removable Glass for', 'easy Cleaning', 'Common - All Models', 'HACCP Compliance', 'Copper evaporator &', 'condenser', 'Dixell digital Controller', 'Options', 'Lid instead of glass', 'in EVRX', 'More options available']::TEXT[], '{"Salad Display Counter": "Sushi Case", "Dimensions (WxDxH mm)": "1400 x 335 x 435", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "6 x GN 1/4", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image7.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('sushi-saladette-counter-sss-1500', 'Sushi & Saladette Counter SSS 1500', 'SSS 1500', 'Professional Kitchen', 'Sushi & Saladette Counter', 'Commercial-grade Sushi & Saladette Counter model SSS 1500 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1500 x 415 x 300 mm.', '1500 x 415 x 300', ARRAY['LED Lamp', 'Heated Front Glass', 'Top & Bottom Evaporator', 'Safety Curved Glass', 'Removable Glass for', 'easy Cleaning', 'Common - All Models', 'HACCP Compliance', 'Copper evaporator &', 'condenser', 'Dixell digital Controller', 'Options', 'Lid instead of glass', 'in EVRX', 'More options available']::TEXT[], '{"Salad Display Counter": "Sushi Case", "Dimensions (WxDxH mm)": "1500 x 415 x 300", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "5 x GN 1/3", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image7.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('sushi-saladette-counter-sss-1800', 'Sushi & Saladette Counter SSS 1800', 'SSS 1800', 'Professional Kitchen', 'Sushi & Saladette Counter', 'Commercial-grade Sushi & Saladette Counter model SSS 1800 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1800 x 415 x 300 mm.', '1800 x 415 x 300', ARRAY['LED Lamp', 'Heated Front Glass', 'Top & Bottom Evaporator', 'Safety Curved Glass', 'Removable Glass for', 'easy Cleaning', 'Common - All Models', 'HACCP Compliance', 'Copper evaporator &', 'condenser', 'Dixell digital Controller', 'Options', 'Lid instead of glass', 'in EVRX', 'More options available']::TEXT[], '{"Salad Display Counter": "Sushi Case", "Dimensions (WxDxH mm)": "1800 x 415 x 300", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "7 x GN 1/3", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image7.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('buffet-freezer-sd-59-h', 'Buffet Freezer SD 59 H', 'SD 59 H', 'Professional Kitchen', 'Buffet Freezer', 'Commercial-grade Buffet Freezer model SD 59 H engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 40 capacity rating. Operates in the -16°°C ~ -18°C temperature range. Dimensions: 670 x 735 x 360 mm.', '670 x 735 x 360', ARRAY['Copper evaporator', 'Dixell digital controller', 'GN compatible', 'Extra-strong hinges', 'Tempered & low emissivity glass', 'Eco-friendly refrigerant', 'LED lighting for better visibility', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Dimensions (WxDxH mm)": "670 x 735 x 360", "Capacity (Liters)": "40", "Temperature Range (°C)": "-16°°C ~ -18°C", "Ambient Class": "32°C", "GN 1/3 Pan Capacity": "3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image8.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('frost-top-e3f', 'Frost Top E3F', 'E3F', 'Professional Kitchen', 'Frost Top', 'Commercial-grade Frost Top model E3F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -10°C temperature range. Dimensions: 1102 x 678 x 430 mm.', '1102 x 678 x 430', ARRAY['Copper evaporator', 'Environment Friendly Refrigerant', 'SS 304 CERTIFIED', 'Sleek design enhances', 'Digital controller', 'Easy-to-clean surface', 'Uniform cooling', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Dimensions (WxDxH mm)": "1102 x 678 x 430", "Temperature Range (°C)": "-10°C", "Cooling Mode": "Static", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image9.png', 'SS 304')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('cooling-well-egn-3v', 'Cooling Well EGN 3V', 'EGN 3V', 'Professional Kitchen', 'Cooling Well', 'Commercial-grade Cooling Well model EGN 3V engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1122 x 688 x 636 mm.', '1122 x 688 x 636', ARRAY['Copper evaporator', 'Environment Friendly Refrigerant', 'Ventilated cooling', 'Digital controller', 'GN pan compatibility', 'Compact design', 'Common - All Models', 'HACCP Compliance Options', 'Available in designs 2/4/5xGN 1/1']::TEXT[], '{"Dimensions (WxDxH mm)": "1122 x 688 x 636", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "3 x GN 1/1", "Climate Class": "32°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image10.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('banquet-trolley-he-290', 'Banquet Trolley HE 290', 'HE 290', 'Professional Kitchen', 'Banquet Trolley', 'Commercial-grade Banquet Trolley model HE 290 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 290 L capacity rating. Operates in the 30°°C ~ 90°C temperature range. Dimensions: 395 x 650 x 1430 mm.', '395 x 650 x 1430', ARRAY['Key Features HR', 'HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Refrigeration System', 'Auto Defrost & Condensate Evaporation', 'Magnetic Door Gasket (Tool-Free Replacement)', 'Key Features HE', 'Mobile Heated Cabinet Design', 'Holds +70°C for Up to 1 Hour (Without Power)', '30–90°C Adjustable Temperature Range', 'Fan-Assisted Uniform Heating', 'Automatic Overheat Protection', 'Mechanical Thermostat Display', 'Built-in Humidity Reservoir', 'Supports 20 GN Pans (GN1/1 & GN2/1)']::TEXT[], '{"Dimensions (WxDxH mm)": "395 x 650 x 1430", "Temperature Range (°C)": "30°°C ~ 90°C", "Capacity (Liters)": "290 L", "No. of GN PANS": "20 pcs", "Power Supply": "230V / 50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image11.png', 'Heavy Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('banquet-trolley-he-540', 'Banquet Trolley HE 540', 'HE 540', 'Professional Kitchen', 'Banquet Trolley', 'Commercial-grade Banquet Trolley model HE 540 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 540 L capacity rating. Operates in the 30°°C ~ 90°C temperature range. Dimensions: 877 x 950 x 1776 mm.', '877 x 950 x 1776', ARRAY['Key Features HR', 'HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Refrigeration System', 'Auto Defrost & Condensate Evaporation', 'Magnetic Door Gasket (Tool-Free Replacement)', 'Key Features HE', 'Mobile Heated Cabinet Design', 'Holds +70°C for Up to 1 Hour (Without Power)', '30–90°C Adjustable Temperature Range', 'Fan-Assisted Uniform Heating', 'Automatic Overheat Protection', 'Mechanical Thermostat Display', 'Built-in Humidity Reservoir', 'Supports 20 GN Pans (GN1/1 & GN2/1)']::TEXT[], '{"Dimensions (WxDxH mm)": "877 x 950 x 1776", "Temperature Range (°C)": "30°°C ~ 90°C", "Capacity (Liters)": "540 L", "No. of GN PANS": "40 pcs", "Power Supply": "230V / 50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image11.png', 'Heavy Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('banquet-trolley-hr-290', 'Banquet Trolley HR 290', 'HR 290', 'Professional Kitchen', 'Banquet Trolley', 'Commercial-grade Banquet Trolley model HR 290 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 290 L capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 395 x 650 x 1430 mm.', '395 x 650 x 1430', ARRAY['Key Features HR', 'HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Refrigeration System', 'Auto Defrost & Condensate Evaporation', 'Magnetic Door Gasket (Tool-Free Replacement)', 'Key Features HE', 'Mobile Heated Cabinet Design', 'Holds +70°C for Up to 1 Hour (Without Power)', '30–90°C Adjustable Temperature Range', 'Fan-Assisted Uniform Heating', 'Automatic Overheat Protection', 'Mechanical Thermostat Display', 'Built-in Humidity Reservoir', 'Supports 20 GN Pans (GN1/1 & GN2/1)']::TEXT[], '{"Dimensions (WxDxH mm)": "395 x 650 x 1430", "Temperature Range (°C)": "-2°°C ~ 8°C", "Capacity (Liters)": "290 L", "No. of GN PANS": "20 pcs", "Power Supply": "230V / 50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image11.png', 'Heavy Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('banquet-trolley-hr-540', 'Banquet Trolley HR 540', 'HR 540', 'Professional Kitchen', 'Banquet Trolley', 'Commercial-grade Banquet Trolley model HR 540 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 540 L capacity rating. Operates in the -2°°C ~ 8°C temperature range. Dimensions: 877 x 951 x 2030 mm.', '877 x 951 x 2030', ARRAY['Key Features HR', 'HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Refrigeration System', 'Auto Defrost & Condensate Evaporation', 'Magnetic Door Gasket (Tool-Free Replacement)', 'Key Features HE', 'Mobile Heated Cabinet Design', 'Holds +70°C for Up to 1 Hour (Without Power)', '30–90°C Adjustable Temperature Range', 'Fan-Assisted Uniform Heating', 'Automatic Overheat Protection', 'Mechanical Thermostat Display', 'Built-in Humidity Reservoir', 'Supports 20 GN Pans (GN1/1 & GN2/1)']::TEXT[], '{"Dimensions (WxDxH mm)": "877 x 951 x 2030", "Temperature Range (°C)": "-2°°C ~ 8°C", "Capacity (Liters)": "540 L", "No. of GN PANS": "40 pcs", "Power Supply": "230V / 50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image11.png', 'Heavy Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('fish-file-refrigerator-gn-350-tn', 'Fish File Refrigerator GN 350 TN', 'GN 350 TN', 'Professional Kitchen', 'Fish File Refrigerator', 'Commercial-grade Fish File Refrigerator model GN 350 TN engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 292 L capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 484 x 700 x 2091 mm.', '484 x 700 x 2091', ARRAY['HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Cooling System', 'Auto Defrost Technology', 'Tool-Free Magnetic Gasket', '60 mm Energy-Efficient Insulation', 'Self-Closing Door', 'AISI 304 Stainless Steel Interior & Exterior']::TEXT[], '{"Dimensions (WxDxH mm)": "484 x 700 x 2091", "Temperature Range (°C)": "2°°C ~ 8°C", "Capacity (Liters)": "292 L", "Shelves": "3 pcs", "Power Supply": "230V / 50Hz", "Cooling Mode": "Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image12.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('fish-file-refrigerator-gn-350-bt', 'Fish File Refrigerator GN 350 BT', 'GN 350 BT', 'Professional Kitchen', 'Fish File Refrigerator', 'Commercial-grade Fish File Refrigerator model GN 350 BT engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 292 L capacity rating. Operates in the -18°°C ~ -22°C temperature range. Dimensions: 600 x 878 x 2100 mm.', '600 x 878 x 2100', ARRAY['HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Cooling System', 'Auto Defrost Technology', 'Tool-Free Magnetic Gasket', '60 mm Energy-Efficient Insulation', 'Self-Closing Door', 'AISI 304 Stainless Steel Interior & Exterior']::TEXT[], '{"Dimensions (WxDxH mm)": "600 x 878 x 2100", "Temperature Range (°C)": "-18°°C ~ -22°C", "Capacity (Liters)": "292 L", "Shelves": "3 pcs", "Power Supply": "230V / 50Hz", "Cooling Mode": "Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image12.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('fish-file-refrigerator-gn-350-tn-1d', 'Fish File Refrigerator GN 350 TN 1D', 'GN 350 TN 1D', 'Professional Kitchen', 'Fish File Refrigerator', 'Commercial-grade Fish File Refrigerator model GN 350 TN 1D engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 292 L capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 600 x 878 x 2100 mm.', '600 x 878 x 2100', ARRAY['HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Cooling System', 'Auto Defrost Technology', 'Tool-Free Magnetic Gasket', '60 mm Energy-Efficient Insulation', 'Self-Closing Door', 'AISI 304 Stainless Steel Interior & Exterior']::TEXT[], '{"Dimensions (WxDxH mm)": "600 x 878 x 2100", "Temperature Range (°C)": "2°°C ~ 8°C", "Capacity (Liters)": "292 L", "Shelves": "2 pcs", "Power Supply": "230V / 50Hz", "Cooling Mode": "Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image12.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('fish-file-refrigerator-gn-350-tn-3d', 'Fish File Refrigerator GN 350 TN 3D', 'GN 350 TN 3D', 'Professional Kitchen', 'Fish File Refrigerator', 'Commercial-grade Fish File Refrigerator model GN 350 TN 3D engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 292 L 292 L capacity rating. Operates in the 2°°C ~ 8°C 2°°C ~ 8°C temperature range. Dimensions: 740 x 1035 x 2100740 x 1035 x 2100 mm.', '740 x 1035 x 2100740 x 1035 x 2100', ARRAY['HC-Free Refrigerant & Foam', 'Digital LED Temperature Display', 'Ventilated Cooling System', 'Auto Defrost Technology', 'Tool-Free Magnetic Gasket', '60 mm Energy-Efficient Insulation', 'Self-Closing Door', 'AISI 304 Stainless Steel Interior & Exterior']::TEXT[], '{"Dimensions (WxDxH mm)": "740 x 1035 x 2100740 x 1035 x 2100", "Temperature Range (°C)": "2°°C ~ 8°C 2°°C ~ 8°C", "Capacity (Liters)": "292 L 292 L", "Shelves": "2 pcs 1 pcs", "Power Supply": "230V / 50Hz 230V / 50Hz", "Cooling Mode": "Ventilated Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image12.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('blast-chiller-shock-freezer-ed5', 'Blast Chiller & Shock Freezer ED5', 'ED5', 'Professional Kitchen', 'Blast Chiller & Shock Freezer', 'Commercial-grade Blast Chiller & Shock Freezer model ED5 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 169 capacity rating. Operates in the -35°C temperature range. Dimensions: 800 x 815 x 1015 mm.', '800 x 815 x 1015', ARRAY['Rapid chilling', 'Eco- friendly refrigerant', 'BLAST CHILLER / FREEZER', 'Digital controller', '75mm insulation']::TEXT[], '{"Capacity (Liters)": "169", "Dimensions (WxDxH mm)": "800 x 815 x 1015", "Operating Temperature Range (°C)": "-35°C", "Chill Speed (70°C to 4°C / 90 min)": "18 kg", "Freeze Speed (70°C to -18°C / 240 min)": "14 kg", "GN 1/1 Tray Capacity": "5", "Power Supply": "230 V / 50 Hz", "Cooling Mode": "Ventilated", "Type": "Plugin"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image13.png', 'Rapid Chill')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('blast-chiller-shock-freezer-ed10', 'Blast Chiller & Shock Freezer ED10', 'ED10', 'Professional Kitchen', 'Blast Chiller & Shock Freezer', 'Commercial-grade Blast Chiller & Shock Freezer model ED10 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 368 capacity rating. Operates in the -35°C temperature range. Dimensions: 800 x 815 x 1645 mm.', '800 x 815 x 1645', ARRAY['Rapid chilling', 'Eco- friendly refrigerant', 'BLAST CHILLER / FREEZER', 'Digital controller', '75mm insulation']::TEXT[], '{"Capacity (Liters)": "368", "Dimensions (WxDxH mm)": "800 x 815 x 1645", "Operating Temperature Range (°C)": "-35°C", "Chill Speed (70°C to 4°C / 90 min)": "40 kg", "Freeze Speed (70°C to -18°C / 240 min)": "28 kg", "GN 1/1 Tray Capacity": "10", "Power Supply": "230 V / 50 Hz", "Cooling Mode": "Ventilated", "Type": "Plugin"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image13.png', 'Rapid Chill')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('blast-chiller-shock-freezer-ed14', 'Blast Chiller & Shock Freezer ED14', 'ED14', 'Professional Kitchen', 'Blast Chiller & Shock Freezer', 'Commercial-grade Blast Chiller & Shock Freezer model ED14 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 494 capacity rating. Operates in the -35°C temperature range. Dimensions: 800 x 815 x 2170 mm.', '800 x 815 x 2170', ARRAY['Rapid chilling', 'Eco- friendly refrigerant', 'BLAST CHILLER / FREEZER', 'Digital controller', '75mm insulation']::TEXT[], '{"Capacity (Liters)": "494", "Dimensions (WxDxH mm)": "800 x 815 x 2170", "Operating Temperature Range (°C)": "-35°C", "Chill Speed (70°C to 4°C / 90 min)": "55 kg", "Freeze Speed (70°C to -18°C / 240 min)": "38 kg", "GN 1/1 Tray Capacity": "14", "Power Supply": "380 V / 50 Hz", "Cooling Mode": "Ventilated", "Type": "Plugin"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image13.png', 'Rapid Chill')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('blast-chiller-shock-freezer-ed20', 'Blast Chiller & Shock Freezer ED20', 'ED20', 'Professional Kitchen', 'Blast Chiller & Shock Freezer', 'Commercial-grade Blast Chiller & Shock Freezer model ED20 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -35°C temperature range. Dimensions: 950 x 1673 x 2180 mm.', '950 x 1673 x 2180', ARRAY['Rapid chilling', 'Eco- friendly refrigerant', 'BLAST CHILLER / FREEZER', 'Digital controller', '75mm insulation']::TEXT[], '{"Dimensions (WxDxH mm)": "950 x 1673 x 2180", "Operating Temperature Range (°C)": "-35°C", "Chill Speed (70°C to 4°C / 90 min)": "75 kg", "Freeze Speed (70°C to -18°C / 240 min)": "48 kg", "GN 1/1 Tray Capacity": "20", "Power Supply": "380 V / 50 Hz", "Cooling Mode": "Ventilated", "Type": "Plugin"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image13.png', 'Rapid Chill')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-classic-frost-free-cgn-600-c2', 'Reach-In Classic (Frost Free) CGN 600 C2', 'CGN 600 C2', 'Professional Kitchen', 'Reach-In Classic (Frost Free)', 'Commercial-grade Reach-In Classic (Frost Free) model CGN 600 C2 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 600 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 680 x 810 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '680 x 810 x 2000', ARRAY['Heavy duty lockable castors', 'Copper evaporator & condenser Lock', 'GN compatible', 'Environment Friendly Refrigerant', 'Removable gasket', 'Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features:', 'Left or Right hinged in 2 door unit', 'Single or multi door', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "600", "Dimensions (WxDxH mm)": "680 x 810 x 2000", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "2 x GN 1/1", "Refrigerant": "R 290", "Shelves": "3", "Stainless Steel Grade": "SS 430"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image14.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-classic-frost-free-cgn-600-f2', 'Reach-In Classic (Frost Free) CGN 600 F2', 'CGN 600 F2', 'Professional Kitchen', 'Reach-In Classic (Frost Free)', 'Commercial-grade Reach-In Classic (Frost Free) model CGN 600 F2 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 600 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 680 x 810 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '680 x 810 x 2000', ARRAY['Heavy duty lockable castors', 'Copper evaporator & condenser Lock', 'GN compatible', 'Environment Friendly Refrigerant', 'Removable gasket', 'Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features:', 'Left or Right hinged in 2 door unit', 'Single or multi door', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "600", "Dimensions (WxDxH mm)": "680 x 810 x 2000", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "2 x GN 1/1", "Refrigerant": "R 290", "Shelves": "3", "Stainless Steel Grade": "SS 430"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image14.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-classic-frost-free-cgn-1200-c4', 'Reach-In Classic (Frost Free) CGN 1200 C4', 'CGN 1200 C4', 'Professional Kitchen', 'Reach-In Classic (Frost Free)', 'Commercial-grade Reach-In Classic (Frost Free) model CGN 1200 C4 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1200 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1340 x 810 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '1340 x 810 x 2000', ARRAY['Heavy duty lockable castors', 'Copper evaporator & condenser Lock', 'GN compatible', 'Environment Friendly Refrigerant', 'Removable gasket', 'Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features:', 'Left or Right hinged in 2 door unit', 'Single or multi door', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "1200", "Dimensions (WxDxH mm)": "1340 x 810 x 2000", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "2 x GN 1/1", "Refrigerant": "R 290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "6", "Stainless Steel Grade": "SS 430"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image14.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-classic-frost-free-cgn-1200-f4', 'Reach-In Classic (Frost Free) CGN 1200 F4', 'CGN 1200 F4', 'Professional Kitchen', 'Reach-In Classic (Frost Free)', 'Commercial-grade Reach-In Classic (Frost Free) model CGN 1200 F4 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1200300C + 300F 600C + 600F capacity rating. Operates in the -16°°C ~ -22°C 2°C~8°C / -16°C~-22°C 2°C~8°C / -16°C~-22°C temperature range. Dimensions: 680 x 810 x 20001340x845x2000 mm. Utilizes eco-friendly R 290 R 290 / R 290 R 290 / R 290 refrigerant.', '680 x 810 x 20001340x845x2000', ARRAY['Heavy duty lockable castors', 'Copper evaporator & condenser Lock', 'GN compatible', 'Environment Friendly Refrigerant', 'Removable gasket', 'Digital controller', 'Frost-free cooling', 'Adjustable shelves', 'Optional Features:', 'Left or Right hinged in 2 door unit', 'Single or multi door', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "1200300C + 300F 600C + 600F", "Dimensions (WxDxH mm)": "680 x 810 x 20001340x845x2000", "Temperature Range (°C)": "-16°°C ~ -22°C 2°C~8°C / -16°C~-22°C 2°C~8°C / -16°C~-22°C", "GN Pan Compatibility": "2 x GN 1/12 x GN 1/12 x GN 1/1", "Refrigerant": "R 290 R 290 / R 290 R 290 / R 290", "Cooling Mode": "Static", "Shelves": "63 6", "Stainless Steel Grade": "SS 430 SS 430 SS 430"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image14.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-classic-frost-free-cgn-2100-c', 'Under Counter Classic (Frost Free) CGN 2100 C', 'CGN 2100 C', 'Professional Kitchen', 'Under Counter Classic (Frost Free)', 'Commercial-grade Under Counter Classic (Frost Free) model CGN 2100 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 314 capacity rating. Operates in the 2°C~ 8°C temperature range. Dimensions: 1360 x 700 x 860 mm. Utilizes eco-friendly R600A refrigerant.', '1360 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "314", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Temperature Range (°C)": "2°C~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R600A", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "2", "Stainless Steel Grade": "SS 430", "with the equipment.": "Climate class 38°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image15.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-classic-frost-free-cgn-3100-c', 'Under Counter Classic (Frost Free) CGN 3100 C', 'CGN 3100 C', 'Professional Kitchen', 'Under Counter Classic (Frost Free)', 'Commercial-grade Under Counter Classic (Frost Free) model CGN 3100 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the 2°C~ 8°C temperature range. Dimensions: 1795 x 700 x 860 mm. Utilizes eco-friendly R600A refrigerant.', '1795 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Temperature Range (°C)": "2°C~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R600A", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3", "Stainless Steel Grade": "SS 430", "with the equipment.": "Climate class 38°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image15.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-classic-frost-free-cgn-2100-f', 'Under Counter Classic (Frost Free) CGN 2100 F', 'CGN 2100 F', 'Professional Kitchen', 'Under Counter Classic (Frost Free)', 'Commercial-grade Under Counter Classic (Frost Free) model CGN 2100 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 314 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1360 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1360 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "314", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "2", "Stainless Steel Grade": "SS 430", "with the equipment.": "Climate class 38°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image15.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-classic-frost-free-cgn-3100-f', 'Under Counter Classic (Frost Free) CGN 3100 F', 'CGN 3100 F', 'Professional Kitchen', 'Under Counter Classic (Frost Free)', 'Commercial-grade Under Counter Classic (Frost Free) model CGN 3100 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1795 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1795 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Temperature Range (°C)": "-16°°C ~ -22°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Ventilated Cooling (Frost Free)", "Shelves": "3", "Stainless Steel Grade": "SS 430", "with the equipment.": "Climate class 38°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image15.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-static-ri-551-c', 'Reach-In Static RI 551 C', 'RI 551 C', 'Professional Kitchen', 'Reach-In Static', 'Commercial-grade Reach-In Static model RI 551 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 500 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 680 x 710 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '680 x 710 x 2000', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "500", "Dimensions (WxDxH mm)": "680 x 710 x 2000", "Temperature Range (°C)": "2°°C ~ 8°C", "Refrigerant": "R 290", "Cooling Mode": "Static Cooling", "Shelves": "3", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image16.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-static-ri-551-f', 'Reach-In Static RI 551 F', 'RI 551 F', 'Professional Kitchen', 'Reach-In Static', 'Commercial-grade Reach-In Static model RI 551 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 500 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 680 x 710 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '680 x 710 x 2000', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "500", "Dimensions (WxDxH mm)": "680 x 710 x 2000", "Temperature Range (°C)": "-16°°C ~ -22°C", "Refrigerant": "R 290", "Cooling Mode": "Static Cooling", "Shelves": "3", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image16.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-static-ri-1101-c', 'Reach-In Static RI 1101 C', 'RI 1101 C', 'Professional Kitchen', 'Reach-In Static', 'Commercial-grade Reach-In Static model RI 1101 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1000 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1340 x 710 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '1340 x 710 x 2000', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "1000", "Dimensions (WxDxH mm)": "1340 x 710 x 2000", "Temperature Range (°C)": "2°°C ~ 8°C", "Refrigerant": "R 290", "Cooling Mode": "Static Cooling", "Shelves": "6", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image16.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('reach-in-static-ri-1101-f', 'Reach-In Static RI 1101 F', 'RI 1101 F', 'Professional Kitchen', 'Reach-In Static', 'Commercial-grade Reach-In Static model RI 1101 F engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1000 capacity rating. Operates in the -16°°C ~ -22°C temperature range. Dimensions: 1340 x 710 x 2000 mm. Utilizes eco-friendly R 290 refrigerant.', '1340 x 710 x 2000', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "1000", "Dimensions (WxDxH mm)": "1340 x 710 x 2000", "Temperature Range (°C)": "-16°°C ~ -22°C", "Refrigerant": "R 290", "Cooling Mode": "Static Cooling", "Shelves": "6", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image16.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-static-uc-1502c', 'Under Counter Static UC 1502C', 'UC 1502C', 'Professional Kitchen', 'Under Counter Static', 'Commercial-grade Under Counter Static model UC 1502C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 314 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1360 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1360 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "314", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Static Cooling", "Shelves": "2", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-static-uc-1802c', 'Under Counter Static UC 1802C', 'UC 1802C', 'Professional Kitchen', 'Under Counter Static', 'Commercial-grade Under Counter Static model UC 1802C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1795 x 700 x 860 mm. Utilizes eco-friendly R290 refrigerant.', '1795 x 700 x 860', ARRAY['Removable gasket', 'Heavy duty lockable castors', 'Copper evaporator & condenser', 'Lock', 'GN compatible frost free range', 'Rounded internal', 'edges', 'Digitalcontroller', 'Eco-friendly refrigerant', 'Adjustable shelves', 'Optional Features:', 'Heavy duty adjustable SS legs', 'Common - All Models', 'HACCP Compliance']::TEXT[], '{"Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Temperature Range (°C)": "2°°C ~ 8°C", "GN Pan Compatibility": "1 x GN 1/1", "Refrigerant": "R290", "Cooling Mode": "Static Cooling", "Shelves": "3", "Body Material": "SS 201"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('wine-chiller-cellar-vino-46-uc-1502c', 'Wine Chiller & Cellar Vino 46 (UC 1502C)', 'Vino 46 (UC 1502C)', 'Beverage Cooling', 'Wine Chiller & Cellar', 'Commercial-grade Wine Chiller & Cellar model Vino 46 (UC 1502C) engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 595 x 575 x 820 mm.', '595 x 575 x 820', ARRAY['Actual and set temperature display', 'Lock', 'Frost free', 'Elegant stainless steel door frame', 'Double layer anti UV tinted glass door', 'Cabinet colour: Black', 'Charcoal filter', 'Dual temperature zone', 'Anti-vibration system', 'Pull-out beech wooden shelves', 'Blue LED Lighting']::TEXT[], '{"Descriptions": "Wine Cooler", "Dimensions (WxDxH mm)": "595 x 575 x 820", "Capacity (Standard 750 ml)": "46 Bottles", "Power Consumption (W)": "70", "Temperature range (C)": "5℃~12℃ & 12℃~22℃", "Shelves": "6", "Adjustable Feet / Lock": "Yes/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image17.png', 'Dual Zone')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('wine-chiller-cellar-vino-121-uc-1802c', 'Wine Chiller & Cellar Vino 121 (UC 1802C)', 'Vino 121 (UC 1802C)', 'Beverage Cooling', 'Wine Chiller & Cellar', 'Commercial-grade Wine Chiller & Cellar model Vino 121 (UC 1802C) engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 595 x 680 x 1417 mm.', '595 x 680 x 1417', ARRAY['Actual and set temperature display', 'Lock', 'Frost free', 'Elegant stainless steel door frame', 'Double layer anti UV tinted glass door', 'Cabinet colour: Black', 'Charcoal filter', 'Dual temperature zone', 'Anti-vibration system', 'Pull-out beech wooden shelves', 'Blue LED Lighting']::TEXT[], '{"Descriptions": "Wine Cooler", "Dimensions (WxDxH mm)": "595 x 680 x 1417", "Capacity (Standard 750 ml)": "121 Bottles", "Power Consumption (W)": "120", "Temperature range (C)": "5℃~12℃&12℃~22℃", "Shelves": "11", "Adjustable Feet / Lock": "Yes/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image17.png', 'Dual Zone')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('back-bar-bottle-cooler-ebb-2d-lh', 'Back-Bar Bottle Cooler EBB 2D LH', 'EBB 2D LH', 'Bar Refrigeration', 'Back-Bar Bottle Cooler', 'Commercial-grade Back-Bar Bottle Cooler model EBB 2D LH engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 900 x 510 x 850 mm.', '900 x 510 x 850', ARRAY['SS inside', 'SS wire shelves', 'Double layer glass', 'Digital controller', 'Self-closing Door', 'Internal LED light', 'Options', 'Sliding door in 2 & 3 door', '1 door model available', 'External & internal painting color', 'Height 850mm']::TEXT[], '{"Description": "2 Door Back Bar", "Dimensions (WxDxH mm)": "900 x 510 x 850", "Capacity (Standard 750 ml)": "220 Ltrs.", "Power Consumption (W)": "220", "Temperature range (C)": "2℃~8℃", "Shelves": "1 X 2", "Castors / Lock": "No/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image18.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('back-bar-bottle-cooler-ebb-3d-lh', 'Back-Bar Bottle Cooler EBB 3D LH', 'EBB 3D LH', 'Bar Refrigeration', 'Back-Bar Bottle Cooler', 'Commercial-grade Back-Bar Bottle Cooler model EBB 3D LH engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 1320 x 510 x 850 mm.', '1320 x 510 x 850', ARRAY['SS inside', 'SS wire shelves', 'Double layer glass', 'Digital controller', 'Self-closing Door', 'Internal LED light', 'Options', 'Sliding door in 2 & 3 door', '1 door model available', 'External & internal painting color', 'Height 850mm']::TEXT[], '{"Description": "3 Door Back Bar", "Dimensions (WxDxH mm)": "1320 x 510 x 850", "Capacity (Standard 750 ml)": "300 Ltrs.", "Power Consumption (W)": "300", "Temperature range (C)": "2℃~8℃", "Shelves": "1 X 2", "Castors / Lock": "No/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image18.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('back-bar-bottle-cooler-ebb-2d-ss-lh', 'Back-Bar Bottle Cooler EBB 2D SS LH', 'EBB 2D SS LH', 'Bar Refrigeration', 'Back-Bar Bottle Cooler', 'Commercial-grade Back-Bar Bottle Cooler model EBB 2D SS LH engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 900 x 510 x 850 mm.', '900 x 510 x 850', ARRAY['SS inside', 'SS wire shelves', 'Double layer glass', 'Digital controller', 'Self-closing Door', 'Internal LED light', 'Options', 'Sliding door in 2 & 3 door', '1 door model available', 'External & internal painting color', 'Height 850mm']::TEXT[], '{"Description": "2 Door Back Bar", "Dimensions (WxDxH mm)": "900 x 510 x 850", "Capacity (Standard 750 ml)": "220 Ltrs.", "Power Consumption (W)": "220", "Temperature range (C)": "2℃~8℃", "Shelves": "1 X 2", "Castors / Lock": "No/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image18.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('back-bar-bottle-cooler-ebb-3d-ss-lh', 'Back-Bar Bottle Cooler EBB 3D SS LH', 'EBB 3D SS LH', 'Bar Refrigeration', 'Back-Bar Bottle Cooler', 'Commercial-grade Back-Bar Bottle Cooler model EBB 3D SS LH engineered for high reliability, precise temperature stability, and optimal energy efficiency. Dimensions: 1320 x 510 x 850 mm.', '1320 x 510 x 850', ARRAY['SS inside', 'SS wire shelves', 'Double layer glass', 'Digital controller', 'Self-closing Door', 'Internal LED light', 'Options', 'Sliding door in 2 & 3 door', '1 door model available', 'External & internal painting color', 'Height 850mm']::TEXT[], '{"Description": "3 Door Back Bar", "Dimensions (WxDxH mm)": "1320 x 510 x 850", "Capacity (Standard 750 ml)": "300 Ltrs.", "Power Consumption (W)": "300", "Temperature range (C)": "2℃~8℃", "Shelves": "1 X 2", "Castors / Lock": "No/Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image18.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-bar-glass-froster-egf-5g', 'Under Counter Bar & Glass Froster EGF 5G', 'EGF 5G', 'Bar Refrigeration', 'Under Counter Bar & Glass Froster', 'Commercial-grade Under Counter Bar & Glass Froster model EGF 5G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 100 Ltrs. capacity rating. Operates in the -2°°C ~ -10°C temperature range. Dimensions: 595 x 525 x 875 mm.', '595 x 525 x 875', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Descriptions": "1 Door Glass Froster", "Dimensions (WxDxH mm)": "595 x 525 x 875", "Capacity (Liters)": "100 Ltrs.", "Power Consumption (W)": "280", "Temperature Range (°C)": "-2°°C ~ -10°C", "Shelves": "2", "Castors": "No"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-bar-glass-froster-egn-2100-cg', 'Under Counter Bar & Glass Froster EGN 2100 CG', 'EGN 2100 CG', 'Bar Refrigeration', 'Under Counter Bar & Glass Froster', 'Commercial-grade Under Counter Bar & Glass Froster model EGN 2100 CG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 265 Ltrs. capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 1360 x 700 x 860 mm.', '1360 x 700 x 860', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Descriptions": "2 Door Under Counter Bar", "Dimensions (WxDxH mm)": "1360 x 700 x 860", "Capacity (Liters)": "265 Ltrs.", "Power Consumption (W)": "396", "Temperature Range (°C)": "2°°C ~ 10°C", "Shelves": "2", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('under-counter-bar-glass-froster-egn-3100-cg', 'Under Counter Bar & Glass Froster EGN 3100 CG', 'EGN 3100 CG', 'Bar Refrigeration', 'Under Counter Bar & Glass Froster', 'Commercial-grade Under Counter Bar & Glass Froster model EGN 3100 CG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 400 Ltrs. capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 1795 x 700 x 860 mm.', '1795 x 700 x 860', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Descriptions": "3 Door Under Counter Bar", "Dimensions (WxDxH mm)": "1795 x 700 x 860", "Capacity (Liters)": "400 Ltrs.", "Power Consumption (W)": "514", "Temperature Range (°C)": "2°°C ~ 10°C", "Shelves": "3", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-ice-cube-machine-eim-36', 'Commercial Ice Cube Machine EIM 36', 'EIM 36', 'Ice Machine & Flakers', 'Commercial Ice Cube Machine', 'Commercial-grade Commercial Ice Cube Machine model EIM 36 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 30 capacity rating. Dimensions: 330 x 340 x 610 mm.', '330 x 340 x 610', ARRAY['Adaptive adjustment for ice thickness', 'Transparent viewing door', 'Low water / full ice alert', 'Dual water inlet (suction pump for bottle water)', 'Power off memory', 'Automatic cleaned', 'Compressor high temperature & over load protection', 'Hanging ice scoop', 'Blue LED lighting', 'Ambient temperature dislpay', 'Adjustable foot']::TEXT[], '{"Compatible Bin Model": "Inbuilt", "Ice Production (Kg/24h)": "30", "Ice Bin Capacity (Kg)": "6", "Dimensions (WxDxH mm)": "330 x 340 x 610", "Power Consumption": "260 W", "Water Consumption (L)": "35 L", "Cube Dimensions (mm)": "22 x 22 x 22", "Electrical Spec": "220V / 1 Ph / 50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'Gourmet Ice')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-ice-cube-machine-eim-41-bw', 'Commercial Ice Cube Machine EIM 41 BW#', 'EIM 41 BW#', 'Ice Machine & Flakers', 'Commercial Ice Cube Machine', 'Commercial-grade Commercial Ice Cube Machine model EIM 41 BW# engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 36 capacity rating. Dimensions: 500 x 450 x 800 mm.', '500 x 450 x 800', ARRAY['Adaptive adjustment for ice thickness', 'Transparent viewing door', 'Low water / full ice alert', 'Dual water inlet (suction pump for bottle water)', 'Power off memory', 'Automatic cleaned', 'Compressor high temperature & over load protection', 'Hanging ice scoop', 'Blue LED lighting', 'Ambient temperature dislpay', 'Adjustable foot']::TEXT[], '{"Compatible Bin Model": "Inbuilt", "Ice Production (Kg/24h)": "36", "Ice Bin Capacity (Kg)": "15", "Dimensions (WxDxH mm)": "500 x 450 x 800", "Power Consumption": "300 W", "Water Consumption (L)": "50 L", "Cube Dimensions (mm)": "22 x 22 x 22", "Electrical Spec": "220V / 1 Ph / 50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'Gourmet Ice')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-ice-cube-machine-eim-61-bw', 'Commercial Ice Cube Machine EIM 61 BW#', 'EIM 61 BW#', 'Ice Machine & Flakers', 'Commercial Ice Cube Machine', 'Commercial-grade Commercial Ice Cube Machine model EIM 61 BW# engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 55 capacity rating. Dimensions: 500 x 590 x 850 mm.', '500 x 590 x 850', ARRAY['Adaptive adjustment for ice thickness', 'Transparent viewing door', 'Low water / full ice alert', 'Dual water inlet (suction pump for bottle water)', 'Power off memory', 'Automatic cleaned', 'Compressor high temperature & over load protection', 'Hanging ice scoop', 'Blue LED lighting', 'Ambient temperature dislpay', 'Adjustable foot']::TEXT[], '{"Compatible Bin Model": "Inbuilt", "Ice Production (Kg/24h)": "55", "Ice Bin Capacity (Kg)": "18", "Dimensions (WxDxH mm)": "500 x 590 x 850", "Power Consumption": "360 W", "Water Consumption (L)": "80 L", "Cube Dimensions (mm)": "22 x 22 x 22", "Electrical Spec": "220V / 1 Ph / 50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'Gourmet Ice')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-ice-cube-machine-eim-101', 'Commercial Ice Cube Machine EIM 101', 'EIM 101', 'Ice Machine & Flakers', 'Commercial Ice Cube Machine', 'Commercial-grade Commercial Ice Cube Machine model EIM 101 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 95 capacity rating. Dimensions: 660 x 685 x 920 mm.', '660 x 685 x 920', ARRAY['Adaptive adjustment for ice thickness', 'Transparent viewing door', 'Low water / full ice alert', 'Dual water inlet (suction pump for bottle water)', 'Power off memory', 'Automatic cleaned', 'Compressor high temperature & over load protection', 'Hanging ice scoop', 'Blue LED lighting', 'Ambient temperature dislpay', 'Adjustable foot']::TEXT[], '{"Compatible Bin Model": "Inbuilt", "Ice Production (Kg/24h)": "95", "Ice Bin Capacity (Kg)": "36", "Dimensions (WxDxH mm)": "660 x 685 x 920", "Power Consumption": "580 W", "Water Consumption (L)": "150 L", "Cube Dimensions (mm)": "22 x 22 x 22", "Electrical Spec": "220V / 1 Ph / 50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'Gourmet Ice')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('confectionery-showcase-edc-702-f3', 'Confectionery Showcase EDC 702 F3', 'EDC 702 F3', 'Confectionery Showcase', 'Confectionery Showcase', 'Commercial-grade Confectionery Showcase model EDC 702 F3 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 700 x 665 x 1235 mm.', '700 x 665 x 1235', ARRAY['Available in stainless steel finish', 'Stainless steel interior', 'Lockable castors for easy mobility Elegant design', 'Double pane glass', 'Copper condenser', 'Copper evaporator', 'Aluminum door track', 'Elegant Design', 'Options', 'External low - E with heater', 'Door frame with heater', 'Adjustable table feet']::TEXT[], '{"Dimensions (WxDxH mm)": "700 x 665 x 1235", "Temperature Range (°C)": "2°°C ~ 8°C", "Shelves": "Base + 3", "Input Power (W)": "612"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image21.png', 'Heated Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('confectionery-showcase-edc-902-f3', 'Confectionery Showcase EDC 902 F3', 'EDC 902 F3', 'Confectionery Showcase', 'Confectionery Showcase', 'Commercial-grade Confectionery Showcase model EDC 902 F3 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 900 x 665 x 1235 mm.', '900 x 665 x 1235', ARRAY['Available in stainless steel finish', 'Stainless steel interior', 'Lockable castors for easy mobility Elegant design', 'Double pane glass', 'Copper condenser', 'Copper evaporator', 'Aluminum door track', 'Elegant Design', 'Options', 'External low - E with heater', 'Door frame with heater', 'Adjustable table feet']::TEXT[], '{"Dimensions (WxDxH mm)": "900 x 665 x 1235", "Temperature Range (°C)": "2°°C ~ 8°C", "Shelves": "Base + 3", "Input Power (W)": "638"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image21.png', 'Heated Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('confectionery-showcase-edc-1202-f3', 'Confectionery Showcase EDC 1202 F3', 'EDC 1202 F3', 'Confectionery Showcase', 'Confectionery Showcase', 'Commercial-grade Confectionery Showcase model EDC 1202 F3 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1200 x 665 x 1235 mm.', '1200 x 665 x 1235', ARRAY['Available in stainless steel finish', 'Stainless steel interior', 'Lockable castors for easy mobility Elegant design', 'Double pane glass', 'Copper condenser', 'Copper evaporator', 'Aluminum door track', 'Elegant Design', 'Options', 'External low - E with heater', 'Door frame with heater', 'Adjustable table feet']::TEXT[], '{"Dimensions (WxDxH mm)": "1200 x 665 x 1235", "Temperature Range (°C)": "2°°C ~ 8°C", "Shelves": "Base + 3", "Input Power (W)": "704"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image21.png', 'Heated Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('confectionery-showcase-edc-1502-f3', 'Confectionery Showcase EDC 1502 F3', 'EDC 1502 F3', 'Confectionery Showcase', 'Confectionery Showcase', 'Commercial-grade Confectionery Showcase model EDC 1502 F3 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1500 x 665 x 1235 mm.', '1500 x 665 x 1235', ARRAY['Available in stainless steel finish', 'Stainless steel interior', 'Lockable castors for easy mobility Elegant design', 'Double pane glass', 'Copper condenser', 'Copper evaporator', 'Aluminum door track', 'Elegant Design', 'Options', 'External low - E with heater', 'Door frame with heater', 'Adjustable table feet']::TEXT[], '{"Dimensions (WxDxH mm)": "1500 x 665 x 1235", "Temperature Range (°C)": "2°°C ~ 8°C", "Shelves": "Base + 3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image21.png', 'Heated Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('confectionery-showcase-edc-1802-f3', 'Confectionery Showcase EDC 1802 F3', 'EDC 1802 F3', 'Confectionery Showcase', 'Confectionery Showcase', 'Commercial-grade Confectionery Showcase model EDC 1802 F3 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 1800 x 665 x 1235 mm.', '1800 x 665 x 1235', ARRAY['Available in stainless steel finish', 'Stainless steel interior', 'Lockable castors for easy mobility Elegant design', 'Double pane glass', 'Copper condenser', 'Copper evaporator', 'Aluminum door track', 'Elegant Design', 'Options', 'External low - E with heater', 'Door frame with heater', 'Adjustable table feet']::TEXT[], '{"Dimensions (WxDxH mm)": "1800 x 665 x 1235", "Temperature Range (°C)": "2°°C ~ 8°C", "Shelves": "Base + 3"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image21.png', 'Heated Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('countertop-confectionery-showcase-ehtc-70', 'Countertop Confectionery Showcase EHTC 70', 'EHTC 70', 'Confectionery Showcase', 'Countertop Confectionery Showcase', 'Commercial-grade Countertop Confectionery Showcase model EHTC 70 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 120 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 700 x 560 x 730 mm.', '700 x 560 x 730', ARRAY['Ventilated Cooling', 'Double Glass with big chamber', 'Super thick insulation', 'High Efficieny heat dissipation', 'Door with chamber seal, metal wheel', 'Aluminium door track', 'Options', 'LED CCT', 'S/Steel finishing and typeExternal E Glass with heater', 'Door frame with heater']::TEXT[], '{"Dimensions (WxDxH mm)": "700 x 560 x 730", "Temperature Range (°C)": "2°°C ~ 10°C", "Shelves": "Base + 2", "Capacity (Liters)": "120", "Input Power (W)": "175"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image22.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('countertop-confectionery-showcase-ehtc-90', 'Countertop Confectionery Showcase EHTC 90', 'EHTC 90', 'Confectionery Showcase', 'Countertop Confectionery Showcase', 'Commercial-grade Countertop Confectionery Showcase model EHTC 90 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 160 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 900 x 560 x 730 mm.', '900 x 560 x 730', ARRAY['Ventilated Cooling', 'Double Glass with big chamber', 'Super thick insulation', 'High Efficieny heat dissipation', 'Door with chamber seal, metal wheel', 'Aluminium door track', 'Options', 'LED CCT', 'S/Steel finishing and typeExternal E Glass with heater', 'Door frame with heater']::TEXT[], '{"Dimensions (WxDxH mm)": "900 x 560 x 730", "Temperature Range (°C)": "2°°C ~ 10°C", "Shelves": "Base + 2", "Capacity (Liters)": "160", "Input Power (W)": "190"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image22.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('modular-heavy-duty-ice-maker-eim-201', 'Modular Heavy-Duty Ice Maker EIM 201', 'EIM 201', 'Ice Machine & Flakers', 'Modular Heavy-Duty Ice Maker', 'Commercial-grade Modular Heavy-Duty Ice Maker model EIM 201 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 191 capacity rating. Dimensions: 22 x 22 x 22 mm.', '22 x 22 x 22', ARRAY['Low Energy Consumption', 'Low Water Consumption', 'Air- cooled system', 'Control board with display', 'Vertical evaporator']::TEXT[], '{"Ice Production (Kg/24h)": "191", "Ice Bin Capacity (Kg)": "125", "Dimensions (WxDxH mm)": "22 x 22 x 22", "Power Consumption (24h)": "1100 W", "Water Consumption (L)": "286 L", "Electrical Spec": "220V / 1 Ph / 50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'High Yield')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('modular-heavy-duty-ice-maker-eim-351', 'Modular Heavy-Duty Ice Maker EIM 351', 'EIM 351', 'Ice Machine & Flakers', 'Modular Heavy-Duty Ice Maker', 'Commercial-grade Modular Heavy-Duty Ice Maker model EIM 351 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 318 capacity rating. Dimensions: 22 x 22 x 22 mm.', '22 x 22 x 22', ARRAY['Low Energy Consumption', 'Low Water Consumption', 'Air- cooled system', 'Control board with display', 'Vertical evaporator']::TEXT[], '{"Ice Production (Kg/24h)": "318", "Ice Bin Capacity (Kg)": "170", "Dimensions (WxDxH mm)": "22 x 22 x 22", "Power Consumption (24h)": "1420 W", "Water Consumption (L)": "477 L"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'High Yield')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('modular-heavy-duty-ice-maker-eim-501', 'Modular Heavy-Duty Ice Maker EIM 501', 'EIM 501', 'Ice Machine & Flakers', 'Modular Heavy-Duty Ice Maker', 'Commercial-grade Modular Heavy-Duty Ice Maker model EIM 501 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 455 capacity rating. Dimensions: 22 x 22 x 22 mm.', '22 x 22 x 22', ARRAY['Low Energy Consumption', 'Low Water Consumption', 'Air- cooled system', 'Control board with display', 'Vertical evaporator']::TEXT[], '{"Ice Production (Kg/24h)": "455", "Ice Bin Capacity (Kg)": "170", "Dimensions (WxDxH mm)": "22 x 22 x 22", "Power Consumption (24h)": "2300 W", "Water Consumption (L)": "682 L"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'High Yield')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('modular-heavy-duty-ice-maker-eim-1001', 'Modular Heavy-Duty Ice Maker EIM 1001', 'EIM 1001', 'Ice Machine & Flakers', 'Modular Heavy-Duty Ice Maker', 'Commercial-grade Modular Heavy-Duty Ice Maker model EIM 1001 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 909 capacity rating. Dimensions: 22 x 22 x 22 mm.', '22 x 22 x 22', ARRAY['Low Energy Consumption', 'Low Water Consumption', 'Air- cooled system', 'Control board with display', 'Vertical evaporator']::TEXT[], '{"Ice Production (Kg/24h)": "909", "Ice Bin Capacity (Kg)": "350", "Dimensions (WxDxH mm)": "22 x 22 x 22", "Power Consumption (24h)": "3800 W", "Water Consumption (L)": "1363 L", "Electrical Spec": "380V/1Ph/50 Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image20.png', 'High Yield')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('silent-absorption-hotel-minibar-rb-31', 'Silent Absorption Hotel Minibar RB 31', 'RB 31', 'Mini Bar & Mini Fridge', 'Silent Absorption Hotel Minibar', 'Commercial-grade Silent Absorption Hotel Minibar model RB 31 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 30 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 402 x 440 x 500 mm.', '402 x 440 x 500', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Solid", "Capacity (Liters)": "30", "Input Power (W)": "65", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "402 x 440 x 500"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image23.png', '0 dB Silent')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('silent-absorption-hotel-minibar-rb-31-g', 'Silent Absorption Hotel Minibar RB 31 G', 'RB 31 G', 'Mini Bar & Mini Fridge', 'Silent Absorption Hotel Minibar', 'Commercial-grade Silent Absorption Hotel Minibar model RB 31 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 30 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 402 x 428 x 500 mm.', '402 x 428 x 500', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Glass", "Capacity (Liters)": "30", "Input Power (W)": "65", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "402 x 428 x 500"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image23.png', '0 dB Silent')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('silent-absorption-hotel-minibar-rb-41', 'Silent Absorption Hotel Minibar RB 41', 'RB 41', 'Mini Bar & Mini Fridge', 'Silent Absorption Hotel Minibar', 'Commercial-grade Silent Absorption Hotel Minibar model RB 41 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 40 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 402 x 465 x 560 mm.', '402 x 465 x 560', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Solid", "Capacity (Liters)": "40", "Input Power (W)": "65", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "402 x 465 x 560", "Color": "Black"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image23.png', '0 dB Silent')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('silent-absorption-hotel-minibar-rb-41-g', 'Silent Absorption Hotel Minibar RB 41 G', 'RB 41 G', 'Mini Bar & Mini Fridge', 'Silent Absorption Hotel Minibar', 'Commercial-grade Silent Absorption Hotel Minibar model RB 41 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 40 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 402 x 453 x 560 mm.', '402 x 453 x 560', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Glass", "Capacity (Liters)": "40", "Input Power (W)": "65", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "402 x 453 x 560", "Color": "Black"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image23.png', '0 dB Silent')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('compact-compressor-minibar-fridge-rf-55-g', 'Compact Compressor Minibar & Fridge RF 55 G', 'RF 55 G', 'Mini Bar & Mini Fridge', 'Compact Compressor Minibar & Fridge', 'Commercial-grade Compact Compressor Minibar & Fridge model RF 55 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 50 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 450 x 470 x 500 mm.', '450 x 470 x 500', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Glass", "Capacity (Liters)": "50", "Input Power (W)": "80", "Energy Consumption (kWh/day)": "1.0", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "450 x 470 x 500", "Container (20/40 HC)": "220/550", "Color": "White"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image24.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('compact-compressor-minibar-fridge-rf-57', 'Compact Compressor Minibar & Fridge RF 57', 'RF 57', 'Mini Bar & Mini Fridge', 'Compact Compressor Minibar & Fridge', 'Commercial-grade Compact Compressor Minibar & Fridge model RF 57 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 48 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 455 x 460 x 520 mm.', '455 x 460 x 520', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Solid", "Capacity (Liters)": "48", "Input Power (W)": "55", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "455 x 460 x 520", "Container (20/40 HC)": "220/575", "Color": "Grey"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image24.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('compact-compressor-minibar-fridge-rf-56b', 'Compact Compressor Minibar & Fridge RF 56B', 'RF 56B', 'Mini Bar & Mini Fridge', 'Compact Compressor Minibar & Fridge', 'Commercial-grade Compact Compressor Minibar & Fridge model RF 56B engineered for high reliability, precise temperature stability, and optimal energy efficiency.', NULL, ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image24.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('compact-compressor-minibar-fridge-rf-107', 'Compact Compressor Minibar & Fridge RF 107', 'RF 107', 'Mini Bar & Mini Fridge', 'Compact Compressor Minibar & Fridge', 'Commercial-grade Compact Compressor Minibar & Fridge model RF 107 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 92 capacity rating. Operates in the 2°°C ~ 10°C temperature range. Dimensions: 455 x 495 x 845 mm.', '455 x 495 x 845', ARRAY['Temperature controller', 'Silent Operation', 'Reversible Door', 'Available sizes 30 to 60 Ltrs', 'low energy consumption', 'Designed to perform at 35°C', 'low Noise', 'Color options Black, Silver, GreY']::TEXT[], '{"Door Type": "Solid", "Capacity (Liters)": "92", "Input Power (W)": "55", "Energy Consumption (kWh/day)": "0.7", "Temperature Range (°C)": "2°°C ~ 10°C", "Dimensions (WxDxH mm)": "455 x 495 x 845", "Container (20/40 HC)": "110/230", "Color": "Grey"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image24.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('specialty-display-chiller-can-cooler-ecg-105', 'Specialty Display Chiller & Can Cooler ECG 105', 'ECG 105', 'Retail Refrigeration', 'Specialty Display Chiller & Can Cooler', 'Commercial-grade Specialty Display Chiller & Can Cooler model ECG 105 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 102 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 470 x 535 x 812 mm.', '470 x 535 x 812', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "470 x 535 x 812", "Capacity (Liters)": "102", "Temperature Range (°C)": "2°°C ~ 8°C", "Climate Class": "35°C", "No. of 330ml cans": "90", "Input Power (W)": "120"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('specialty-display-chiller-can-cooler-cc-61-can-cooler', 'Specialty Display Chiller & Can Cooler CC 61 (Can Cooler)', 'CC 61 (Can Cooler)', 'Retail Refrigeration', 'Specialty Display Chiller & Can Cooler', 'Commercial-grade Specialty Display Chiller & Can Cooler model CC 61 (Can Cooler) engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 60 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 451x 925 mm.', '451x 925', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "451x 925", "Capacity (Liters)": "60", "Temperature Range (°C)": "2°°C ~ 8°C", "Climate Class": "32°C", "No. of 330ml cans": "88", "Input Power (W)": "129"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('specialty-display-chiller-can-cooler-sd-51-c', 'Specialty Display Chiller & Can Cooler SD 51 C', 'SD 51 C', 'Retail Refrigeration', 'Specialty Display Chiller & Can Cooler', 'Commercial-grade Specialty Display Chiller & Can Cooler model SD 51 C engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 50 capacity rating. Operates in the -18°°C ~ -20°C temperature range. Dimensions: 550 x 533 x 660 mm.', '550 x 533 x 660', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "550 x 533 x 660", "Capacity (Liters)": "50", "Temperature Range (°C)": "-18°°C ~ -20°C", "Climate Class": "32°C", "Input Power (W)": "197"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-coffee-milk-cooler-bc9cn', 'Commercial Coffee Milk Cooler BC9CN', 'BC9CN', 'Water Solutions', 'Commercial Coffee Milk Cooler', 'Commercial-grade Commercial Coffee Milk Cooler model BC9CN engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 9 capacity rating. Operates in the 2°°C ~ 5°C temperature range. Dimensions: 220 x 452 x 456 mm.', '220 x 452 x 456', ARRAY['Dual-side Port', '4.5Ltrs milk container', 'Digital controller', 'Energy-efficient compressor']::TEXT[], '{"Dimensions (WxDxH mm)": "220 x 452 x 456", "Capacity (Liters)": "9", "Temperature Range (°C)": "2°°C ~ 5°C", "Ambient Class": "32°C", "Capacity (milk container)": "4.5 ltr milk container", "Input Power (W)": "76", "Color": "Black"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image26.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('flat-glass-top-display-chest-freezer-ekg-205-ag', 'Flat Glass Top Display Chest Freezer EKG 205 AG', 'EKG 205 AG', 'Retail Refrigeration', 'Flat Glass Top Display Chest Freezer', 'Commercial-grade Flat Glass Top Display Chest Freezer model EKG 205 AG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 197 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 934 x 574 x 825 mm.', '934 x 574 x 825', ARRAY['Low power consumptions', 'Sliding glass door', 'Durable castors', 'High insulations', 'High performing cooling systems', 'digital Display', 'LED Inside', 'unique dual condenser']::TEXT[], '{"Description": "Flat Glass Top Freezer", "Star Rating (BEE)": "5", "Capacity (Liters)": "197", "Dimensions (WxDxH mm)": "934 x 574 x 825", "Baskets": "2 Q3", "LED*": "No", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "970", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image27.png', '5-Star BEE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('flat-glass-top-display-chest-freezer-ekg-305-ag', 'Flat Glass Top Display Chest Freezer EKG 305 AG', 'EKG 305 AG', 'Retail Refrigeration', 'Flat Glass Top Display Chest Freezer', 'Commercial-grade Flat Glass Top Display Chest Freezer model EKG 305 AG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 285 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1014 x 694 x 8441224 x 694 x 844 mm.', '1014 x 694 x 8441224 x 694 x 844', ARRAY['Low power consumptions', 'Sliding glass door', 'Durable castors', 'High insulations', 'High performing cooling systems', 'digital Display', 'LED Inside', 'unique dual condenser']::TEXT[], '{"Description": "Flat Glass Top Freezer", "Star Rating (BEE)": "5", "Capacity (Liters)": "285", "Dimensions (WxDxH mm)": "1014 x 694 x 8441224 x 694 x 844", "Baskets": "1 Q3 + 1 Q6", "LED*": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1113", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image27.png', '5-Star BEE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('flat-glass-top-display-chest-freezer-ekg-405-ag', 'Flat Glass Top Display Chest Freezer EKG 405 AG', 'EKG 405 AG', 'Retail Refrigeration', 'Flat Glass Top Display Chest Freezer', 'Commercial-grade Flat Glass Top Display Chest Freezer model EKG 405 AG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 363 capacity rating. Operates in the -16°°C ~ -24°C temperature range.', NULL, ARRAY['Low power consumptions', 'Sliding glass door', 'Durable castors', 'High insulations', 'High performing cooling systems', 'digital Display', 'LED Inside', 'unique dual condenser']::TEXT[], '{"Description": "Flat Glass Top Freezer", "Star Rating (BEE)": "5", "Capacity (Liters)": "363", "Baskets": "1 Q3 + 1 Q6", "LED*": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1278", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image27.png', '5-Star BEE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('flat-glass-top-display-chest-freezer-ekg-505-ag', 'Flat Glass Top Display Chest Freezer EKG 505 AG', 'EKG 505 AG', 'Retail Refrigeration', 'Flat Glass Top Display Chest Freezer', 'Commercial-grade Flat Glass Top Display Chest Freezer model EKG 505 AG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 439 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1434 x 694 x 844 mm.', '1434 x 694 x 844', ARRAY['Low power consumptions', 'Sliding glass door', 'Durable castors', 'High insulations', 'High performing cooling systems', 'digital Display', 'LED Inside', 'unique dual condenser']::TEXT[], '{"Description": "Flat Glass Top Freezer", "Star Rating (BEE)": "5", "Capacity (Liters)": "439", "Dimensions (WxDxH mm)": "1434 x 694 x 844", "Baskets": "1 Q3 + 1 Q6", "LED*": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1672", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image27.png', '5-Star BEE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('flat-glass-top-display-chest-freezer-ekg-650-g', 'Flat Glass Top Display Chest Freezer EKG 650 G', 'EKG 650 G', 'Retail Refrigeration', 'Flat Glass Top Display Chest Freezer', 'Commercial-grade Flat Glass Top Display Chest Freezer model EKG 650 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 566 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1800 x 694 x 850 mm.', '1800 x 694 x 850', ARRAY['Low power consumptions', 'Sliding glass door', 'Durable castors', 'High insulations', 'High performing cooling systems', 'digital Display', 'LED Inside', 'unique dual condenser']::TEXT[], '{"Description": "Flat Glass Top Freezer", "Star Rating (BEE)": "5", "Capacity (Liters)": "566", "Dimensions (WxDxH mm)": "1800 x 694 x 850", "Baskets": "8", "LED*": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "2007", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image27.png', '5-Star BEE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('curved-glass-top-display-island-freezer-ekg-215-dpg', 'Curved Glass Top Display Island Freezer EKG 215 DPG', 'EKG 215 DPG', 'Retail Refrigeration', 'Curved Glass Top Display Island Freezer', 'Commercial-grade Curved Glass Top Display Island Freezer model EKG 215 DPG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 169 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 785 x 656 x 839 mm.', '785 x 656 x 839', ARRAY['High insulations', 'Low power consumptions', 'Sliding glass door', 'Durable castors', 'DigitalDisplay', 'Unique dual condenser', 'Eco- friendly refrigerant', 'LED Inside']::TEXT[], '{"Description": "Curve Glass Top Freezer", "Star Rating (BEE)": "4", "Capacity (Liters)": "169", "Dimensions (WxDxH mm)": "785 x 656 x 839", "Baskets": "1", "LED": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "920", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image28.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('curved-glass-top-display-island-freezer-ekg-310-dlg', 'Curved Glass Top Display Island Freezer EKG 310 DLG', 'EKG 310 DLG', 'Retail Refrigeration', 'Curved Glass Top Display Island Freezer', 'Commercial-grade Curved Glass Top Display Island Freezer model EKG 310 DLG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 255 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1000 x 649 x 850 mm.', '1000 x 649 x 850', ARRAY['High insulations', 'Low power consumptions', 'Sliding glass door', 'Durable castors', 'DigitalDisplay', 'Unique dual condenser', 'Eco- friendly refrigerant', 'LED Inside']::TEXT[], '{"Description": "Curve Glass Top Freezer", "Star Rating (BEE)": "3", "Capacity (Liters)": "255", "Dimensions (WxDxH mm)": "1000 x 649 x 850", "Baskets": "4", "LED": "Yes", "Digital Display": "No", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1460", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image28.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('curved-glass-top-display-island-freezer-ekg-410-dlg', 'Curved Glass Top Display Island Freezer EKG 410 DLG', 'EKG 410 DLG', 'Retail Refrigeration', 'Curved Glass Top Display Island Freezer', 'Commercial-grade Curved Glass Top Display Island Freezer model EKG 410 DLG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 330 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1224 x 649 x 850 mm.', '1224 x 649 x 850', ARRAY['High insulations', 'Low power consumptions', 'Sliding glass door', 'Durable castors', 'DigitalDisplay', 'Unique dual condenser', 'Eco- friendly refrigerant', 'LED Inside']::TEXT[], '{"Description": "Curve Glass Top Freezer", "Star Rating (BEE)": "4", "Capacity (Liters)": "330", "Dimensions (WxDxH mm)": "1224 x 649 x 850", "Baskets": "4", "LED": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1552", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image28.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('curved-glass-top-display-island-freezer-ekg-415-dlg', 'Curved Glass Top Display Island Freezer EKG 415 DLG', 'EKG 415 DLG', 'Retail Refrigeration', 'Curved Glass Top Display Island Freezer', 'Commercial-grade Curved Glass Top Display Island Freezer model EKG 415 DLG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 333 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1225 x 695 x 918 mm.', '1225 x 695 x 918', ARRAY['High insulations', 'Low power consumptions', 'Sliding glass door', 'Durable castors', 'DigitalDisplay', 'Unique dual condenser', 'Eco- friendly refrigerant', 'LED Inside']::TEXT[], '{"Description": "Curve Glass Top Freezer", "Star Rating (BEE)": "4", "Capacity (Liters)": "333", "Dimensions (WxDxH mm)": "1225 x 695 x 918", "Baskets": "5", "LED": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "1321", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image28.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('curved-glass-top-display-island-freezer-ekg-626-dlg', 'Curved Glass Top Display Island Freezer EKG 626 DLG', 'EKG 626 DLG', 'Retail Refrigeration', 'Curved Glass Top Display Island Freezer', 'Commercial-grade Curved Glass Top Display Island Freezer model EKG 626 DLG engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 574 capacity rating. Operates in the -16°°C ~ -24°C temperature range. Dimensions: 1844 x 694 x 850 mm.', '1844 x 694 x 850', ARRAY['High insulations', 'Low power consumptions', 'Sliding glass door', 'Durable castors', 'DigitalDisplay', 'Unique dual condenser', 'Eco- friendly refrigerant', 'LED Inside']::TEXT[], '{"Description": "Curve Glass Top Freezer", "Star Rating (BEE)": "4", "Capacity (Liters)": "574", "Dimensions (WxDxH mm)": "1844 x 694 x 850", "Baskets": "8", "LED": "Yes", "Digital Display": "Yes", "Temperature Range (°C)": "-16°°C ~ -24°C", "Energy Consumption (kWh/yr)": "2336", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image28.png', 'Curved Glass')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-deep-freezer-mc-76', 'Hard Top Deep Freezer MC 76', 'MC 76', 'Retail Refrigeration', 'Hard Top Deep Freezer', 'Commercial-grade Hard Top Deep Freezer model MC 76 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 76 capacity rating. Dimensions: 404 x 610 x 830 mm.', '404 x 610 x 830', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Tropicalized @43°C', 'Big on storage space', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Capacity (Liters)": "76", "Dimensions (WxDxH mm)": "404 x 610 x 830", "Baskets": "1", "Number of Doors": "1", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-deep-freezer-mc-105g', 'Hard Top Deep Freezer MC 105G', 'MC 105G', 'Retail Refrigeration', 'Hard Top Deep Freezer', 'Commercial-grade Hard Top Deep Freezer model MC 105G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 98 capacity rating. Operates in the 2°°C ~ 8°C temperature range. Dimensions: 550 x 475 x 848 mm.', '550 x 475 x 848', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Tropicalized @43°C', 'Big on storage space', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "Milk Cooler", "Capacity (Liters)": "98", "Dimensions (WxDxH mm)": "550 x 475 x 848", "Baskets": "1", "Number of Doors": "1", "Temperature Range (°C)": "2°°C ~ 8°C", "Energy Consumption (kWh/yr)": "310", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-deep-freezer-mc-205g', 'Hard Top Deep Freezer MC 205G', 'MC 205G', 'Retail Refrigeration', 'Hard Top Deep Freezer', 'Commercial-grade Hard Top Deep Freezer model MC 205G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 197 capacity rating. Dimensions: 820 x 554 x 848 mm.', '820 x 554 x 848', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Tropicalized @43°C', 'Big on storage space', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Capacity (Liters)": "197", "Dimensions (WxDxH mm)": "820 x 554 x 848", "Baskets": "1", "Number of Doors": "1", "Energy Consumption (kWh/yr)": "493", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-deep-freezer-pcf-110', 'Hard Top Deep Freezer PCF 110', 'PCF 110', 'Retail Refrigeration', 'Hard Top Deep Freezer', 'Commercial-grade Hard Top Deep Freezer model PCF 110 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 110 capacity rating. Operates in the -18°°C ~ -28°C temperature range. Dimensions: 980 x 645 x 825 mm.', '980 x 645 x 825', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Tropicalized @43°C', 'Big on storage space', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "FOW", "Capacity (Liters)": "110", "Dimensions (WxDxH mm)": "980 x 645 x 825", "Number of Doors": "1", "Temperature Range (°C)": "-18°°C ~ -28°C"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-deep-freezer-pcf-200', 'Hard Top Deep Freezer PCF 200', 'PCF 200', 'Retail Refrigeration', 'Hard Top Deep Freezer', 'Commercial-grade Hard Top Deep Freezer model PCF 200 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 200 capacity rating. Dimensions: 1035 x 645 x 905 mm.', '1035 x 645 x 905', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Tropicalized @43°C', 'Big on storage space', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Capacity (Liters)": "200", "Dimensions (WxDxH mm)": "1035 x 645 x 905", "Number of Doors": "2"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-dual-temp-convertible-freezer-ef-305-gdd', 'Hard Top Dual Temp Convertible Freezer EF 305 GDD', 'EF 305 GDD', 'Retail Refrigeration', 'Hard Top Dual Temp Convertible Freezer', 'Commercial-grade Hard Top Dual Temp Convertible Freezer model EF 305 GDD engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 283 capacity rating. Operates in the 2°°C ~ 8°C / -18°°C ~ -25°C temperature range. Dimensions: 1100 x 662 x 886 mm.', '1100 x 662 x 886', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Dual temperature convertible Freezer & Chiller', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "Hard Top Freezer Cum Chiller", "Star Rating (BEE)": "4", "Capacity (Liters)": "283", "Dimensions (WxDxH mm)": "1100 x 662 x 886", "Baskets": "1", "Number of Doors": "2", "Temperature Range (°C)": "2°°C ~ 8°C / -18°°C ~ -25°C", "Energy Consumption (kWh/yr)": "767", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image30.png', 'Dual Temp')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-dual-temp-convertible-freezer-ef-455-g', 'Hard Top Dual Temp Convertible Freezer EF 455 G', 'EF 455 G', 'Retail Refrigeration', 'Hard Top Dual Temp Convertible Freezer', 'Commercial-grade Hard Top Dual Temp Convertible Freezer model EF 455 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 375 capacity rating. Operates in the 2°°C ~ 8°C / -18°°C ~ -25°C temperature range. Dimensions: 1309 x 693 x 838 mm.', '1309 x 693 x 838', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Dual temperature convertible Freezer & Chiller', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "Hard Top Freezer Cum Chiller", "Star Rating (BEE)": "5", "Capacity (Liters)": "375", "Dimensions (WxDxH mm)": "1309 x 693 x 838", "Baskets": "2", "Number of Doors": "2", "Temperature Range (°C)": "2°°C ~ 8°C / -18°°C ~ -25°C", "Energy Consumption (kWh/yr)": "785", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image30.png', 'Dual Temp')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-dual-temp-convertible-freezer-ef-555-g', 'Hard Top Dual Temp Convertible Freezer EF 555 G', 'EF 555 G', 'Retail Refrigeration', 'Hard Top Dual Temp Convertible Freezer', 'Commercial-grade Hard Top Dual Temp Convertible Freezer model EF 555 G engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 465 capacity rating. Operates in the 2°°C ~ 8°C / -18°°C ~ -25°C temperature range. Dimensions: 1653 x 695 x 842 mm.', '1653 x 695 x 842', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Dual temperature convertible Freezer & Chiller', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "Hard Top Freezer Cum Chiller", "Star Rating (BEE)": "5", "Capacity (Liters)": "465", "Dimensions (WxDxH mm)": "1653 x 695 x 842", "Baskets": "2", "Number of Doors": "2", "Temperature Range (°C)": "2°°C ~ 8°C / -18°°C ~ -25°C", "Energy Consumption (kWh/yr)": "803", "Castors": "Yes", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image30.png', 'Dual Temp')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('hard-top-dual-temp-convertible-freezer-ef-875', 'Hard Top Dual Temp Convertible Freezer EF 875', 'EF 875', 'Retail Refrigeration', 'Hard Top Dual Temp Convertible Freezer', 'Commercial-grade Hard Top Dual Temp Convertible Freezer model EF 875 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 805 capacity rating. Operates in the 2°°C ~ 8°C / -18°°C ~ -25°C temperature range. Dimensions: 1848 x 857 x 960 mm.', '1848 x 857 x 960', ARRAY['High insulation', 'Castors for easy mobility', 'Hinge door', 'Dual temperature convertible Freezer & Chiller', 'Low power Consumption', 'Eco- friendly refrigerant', '4 Side Cooling']::TEXT[], '{"Description": "Hard Top Freezer Cum Chiller", "Star Rating (BEE)": "5", "Capacity (Liters)": "805", "Dimensions (WxDxH mm)": "1848 x 857 x 960", "Baskets": "1", "Number of Doors": "3", "Temperature Range (°C)": "2°°C ~ 8°C / -18°°C ~ -25°C", "Energy Consumption (kWh/yr)": "1311", "Door Lock": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image30.png', 'Dual Temp')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-205', 'Upright Showcase Display Visi-Cooler ECG 205', 'ECG 205', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 205 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 200 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "200", "Shelves": "3", "Doors": "1/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Input Power (W)": "124"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-305', 'Upright Showcase Display Visi-Cooler ECG 305', 'ECG 305', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 305 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 300 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "300", "Shelves": "4", "Doors": "1/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Input Power (W)": "164"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-405', 'Upright Showcase Display Visi-Cooler ECG 405', 'ECG 405', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 405 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 400 capacity rating. Operates in the 2°°C ~ 10°C 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "400", "Shelves": "4", "Doors": "1/Glass", "Temperature Range (°C)": "2°°C ~ 10°C 2°°C ~ 10°C", "Input Power (W)": "256"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-515', 'Upright Showcase Display Visi-Cooler ECG 515', 'ECG 515', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 515 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 515 capacity rating.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "515", "Shelves": "4", "Doors": "1/Glass", "Digital Controller": "Yes", "Input Power (W)": "260"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-606', 'Upright Showcase Display Visi-Cooler ECG 606', 'ECG 606', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 606 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 600 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "600", "Shelves": "5", "Doors": "1/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Input Power (W)": "325"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-775', 'Upright Showcase Display Visi-Cooler ECG 775', 'ECG 775', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 775 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 730 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "730", "Shelves": "8", "Doors": "2/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Digital Controller": "Yes", "Input Power (W)": "360"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-1075', 'Upright Showcase Display Visi-Cooler ECG 1075', 'ECG 1075', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 1075 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1023 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "1023", "Shelves": "8", "Doors": "2/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Digital Controller": "Yes", "Input Power (W)": "420"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-display-visi-cooler-ecg-1506', 'Upright Showcase Display Visi-Cooler ECG 1506', 'ECG 1506', 'Retail Refrigeration', 'Upright Showcase Display Visi-Cooler', 'Commercial-grade Upright Showcase Display Visi-Cooler model ECG 1506 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1500 capacity rating. Operates in the 2°°C ~ 10°C temperature range.', NULL, ARRAY['LED lighting for better visibility', 'Low power consumption', 'High insulation', 'Removable gasket', 'Castor & Lock available', 'Designed for high ambient', 'Back-lit canopy boosts branding', 'Eco- friendly refrigerant', 'Adjustable shelves']::TEXT[], '{"Description": "Upright Display Chiller", "Capacity (Liters)": "1500", "Shelves": "12", "Doors": "3/Glass", "Temperature Range (°C)": "2°°C ~ 10°C", "Digital Controller": "Yes", "Input Power (W)": "600"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Bestseller')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-glass-door-freezer-efgv-375', 'Upright Showcase Glass Door Freezer EFGV 375', 'EFGV 375', 'Retail Refrigeration', 'Upright Showcase Glass Door Freezer', 'Commercial-grade Upright Showcase Glass Door Freezer model EFGV 375 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 375 capacity rating. Operates in the -16°°C ~ -20°C temperature range. Dimensions: 600 x 610 x 1750 mm.', '600 x 610 x 1750', ARRAY['LED lighting for better visibility', 'High insulation', 'Removable gasket', 'Tropicalized for harsh Indian weather conditions', 'Castor & Lock available', 'Frost free technology', 'Low power Consumption', 'Eco- friendly refrigerant', 'Triple pane heated glass door']::TEXT[], '{"Description": "Upright Display Freezer", "Capacity (Liters)": "375", "Dimensions (WxDxH mm)": "600 x 610 x 1750", "Shelves": "4", "Doors": "1/Glass", "Temperature Range (°C)": "-16°°C ~ -20°C", "Digital Controller": "Yes", "Input Power (W)": "760"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Frost Free')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-glass-door-freezer-efgv-500', 'Upright Showcase Glass Door Freezer EFGV 500', 'EFGV 500', 'Retail Refrigeration', 'Upright Showcase Glass Door Freezer', 'Commercial-grade Upright Showcase Glass Door Freezer model EFGV 500 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 500 capacity rating. Operates in the -16°°C ~ -20°C temperature range. Dimensions: 680 x 700 x 2020 mm.', '680 x 700 x 2020', ARRAY['LED lighting for better visibility', 'High insulation', 'Removable gasket', 'Tropicalized for harsh Indian weather conditions', 'Castor & Lock available', 'Frost free technology', 'Low power Consumption', 'Eco- friendly refrigerant', 'Triple pane heated glass door']::TEXT[], '{"Description": "Upright Display Freezer", "Capacity (Liters)": "500", "Dimensions (WxDxH mm)": "680 x 700 x 2020", "Shelves": "4", "Doors": "1/Glass", "Temperature Range (°C)": "-16°°C ~ -20°C", "Digital Controller": "Yes", "Input Power (W)": "760"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Frost Free')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-glass-door-freezer-efgv-1000', 'Upright Showcase Glass Door Freezer EFGV 1000', 'EFGV 1000', 'Retail Refrigeration', 'Upright Showcase Glass Door Freezer', 'Commercial-grade Upright Showcase Glass Door Freezer model EFGV 1000 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1000 capacity rating. Operates in the -16°°C ~ -20°C temperature range. Dimensions: 1370 x 700 x 1985 mm.', '1370 x 700 x 1985', ARRAY['LED lighting for better visibility', 'High insulation', 'Removable gasket', 'Tropicalized for harsh Indian weather conditions', 'Castor & Lock available', 'Frost free technology', 'Low power Consumption', 'Eco- friendly refrigerant', 'Triple pane heated glass door']::TEXT[], '{"Description": "Upright Display Freezer", "Capacity (Liters)": "1000", "Dimensions (WxDxH mm)": "1370 x 700 x 1985", "Shelves": "10", "Doors": "2/Glass", "Temperature Range (°C)": "-16°°C ~ -20°C", "Digital Controller": "Yes", "Input Power (W)": "1011"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Frost Free')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('upright-showcase-glass-door-freezer-efgv-1500', 'Upright Showcase Glass Door Freezer EFGV 1500', 'EFGV 1500', 'Retail Refrigeration', 'Upright Showcase Glass Door Freezer', 'Commercial-grade Upright Showcase Glass Door Freezer model EFGV 1500 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1500 capacity rating. Operates in the -16°°C ~ -20°C temperature range. Dimensions: 2057 x 700 x 1985 mm.', '2057 x 700 x 1985', ARRAY['LED lighting for better visibility', 'High insulation', 'Removable gasket', 'Tropicalized for harsh Indian weather conditions', 'Castor & Lock available', 'Frost free technology', 'Low power Consumption', 'Eco- friendly refrigerant', 'Triple pane heated glass door']::TEXT[], '{"Description": "Upright Display Freezer", "Capacity (Liters)": "1500", "Dimensions (WxDxH mm)": "2057 x 700 x 1985", "Shelves": "15", "Doors": "3/Glass", "Temperature Range (°C)": "-16°°C ~ -20°C", "Digital Controller": "Yes", "Input Power (W)": "1300"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Frost Free')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-open-multideck-chiller-shf-70-55-15d', 'Plug-In Open Multideck Chiller SHF-70-55-15D', 'SHF-70-55-15D', 'Supermarket Systems', 'Plug-In Open Multideck Chiller', 'Commercial-grade Plug-In Open Multideck Chiller model SHF-70-55-15D engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 750 x 550 x 1500 mm.', '750 x 550 x 1500', ARRAY['Ultra-low front handrail for easy loading/unloading.', 'Rear air return and low-noise compressor for uniform cooling.', 'LED lighting for better display visibility and energy savings.', 'Optional pull-out drawers for convenient goods handling', 'Night Curtain', 'Large space display', 'Customized electronic controller', 'Eco-friendly R290 refrigerant', 'Adjustable LED shelves']::TEXT[], '{"Dimensions (WxDxH mm)": "750 x 550 x 1500", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "166", "Display Area (m²)": "0.98", "Input Power (W)": "487", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Night Curtain')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-open-multideck-chiller-shf-91-55-15d', 'Plug-In Open Multideck Chiller SHF-91-55-15D', 'SHF-91-55-15D', 'Supermarket Systems', 'Plug-In Open Multideck Chiller', 'Commercial-grade Plug-In Open Multideck Chiller model SHF-91-55-15D engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 960 x 550 x 1500 mm.', '960 x 550 x 1500', ARRAY['Ultra-low front handrail for easy loading/unloading.', 'Rear air return and low-noise compressor for uniform cooling.', 'LED lighting for better display visibility and energy savings.', 'Optional pull-out drawers for convenient goods handling', 'Night Curtain', 'Large space display', 'Customized electronic controller', 'Eco-friendly R290 refrigerant', 'Adjustable LED shelves']::TEXT[], '{"Dimensions (WxDxH mm)": "960 x 550 x 1500", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "220", "Display Area (m²)": "1.34", "Input Power (W)": "556", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Night Curtain')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-open-multideck-chiller-sf-93-76-19', 'Plug-In Open Multideck Chiller SF-93-76-19', 'SF-93-76-19', 'Supermarket Systems', 'Plug-In Open Multideck Chiller', 'Commercial-grade Plug-In Open Multideck Chiller model SF-93-76-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1050 x 770 x 1900 mm.', '1050 x 770 x 1900', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1050 x 770 x 1900", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "505", "Display Area (m²)": "2.34", "Input Power (W)": "1100", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-open-multideck-chiller-sf-125-76-19', 'Plug-In Open Multideck Chiller SF-125-76-19', 'SF-125-76-19', 'Supermarket Systems', 'Plug-In Open Multideck Chiller', 'Commercial-grade Plug-In Open Multideck Chiller model SF-125-76-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1360 x 770 x 1900 mm.', '1360 x 770 x 1900', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1360 x 770 x 1900", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "645", "Display Area (m²)": "2.71", "Input Power (W)": "1320", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-open-multideck-chiller-sf-188-76-19', 'Plug-In Open Multideck Chiller SF-188-76-19', 'SF-188-76-19', 'Supermarket Systems', 'Plug-In Open Multideck Chiller', 'Commercial-grade Plug-In Open Multideck Chiller model SF-188-76-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1985 x 770 x 1900 mm.', '1985 x 770 x 1900', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1985 x 770 x 1900", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "970", "Display Area (m²)": "3.57", "Input Power (W)": "1800", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('remote-multideck-open-chiller-rf-188-76-19', 'Remote Multideck Open Chiller RF-188-76-19', 'RF-188-76-19', 'Supermarket Systems', 'Remote Multideck Open Chiller', 'Commercial-grade Remote Multideck Open Chiller model RF-188-76-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1925 x 770 x 1900 mm.', '1925 x 770 x 1900', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1925 x 770 x 1900", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "1100", "Display Area (m²)": "2.64", "Input Power (W)": "128", "Cooling Capacity (kW)": "2.36", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Remote')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('remote-multideck-open-chiller-rf-250-76-19', 'Remote Multideck Open Chiller RF-250-76-19', 'RF-250-76-19', 'Supermarket Systems', 'Remote Multideck Open Chiller', 'Commercial-grade Remote Multideck Open Chiller model RF-250-76-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 2550 x 770 x 1900 mm.', '2550 x 770 x 1900', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "2550 x 770 x 1900", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "1400", "Display Area (m²)": "3.53", "Input Power (W)": "182", "Cooling Capacity (kW)": "3.1", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Remote')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('glass-door-chiller-cabinet-sm2d-131-75-19', 'Glass Door Chiller Cabinet SM2D-131-75-19', 'SM2D-131-75-19', 'Supermarket Systems', 'Glass Door Chiller Cabinet', 'Commercial-grade Glass Door Chiller Cabinet model SM2D-131-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1310 x 750 x 1930 mm.', '1310 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1310 x 750 x 1930", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "944", "Display Area (m²)": "1.31", "Input Power (W)": "610", "Power Supply": "220V/50Hz", "Type": "Plug-In"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('glass-door-chiller-cabinet-sm3d-197-75-19', 'Glass Door Chiller Cabinet SM3D-197-75-19', 'SM3D-197-75-19', 'Supermarket Systems', 'Glass Door Chiller Cabinet', 'Commercial-grade Glass Door Chiller Cabinet model SM3D-197-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1965 x 750 x 1930 mm.', '1965 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1965 x 750 x 1930", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "1473", "Display Area (m²)": "1.97", "Input Power (W)": "830", "Power Supply": "220V/50Hz", "Type": "Plug-In"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('glass-door-chiller-cabinet-rm2d-131a-75-19', 'Glass Door Chiller Cabinet RM2D-131A-75-19', 'RM2D-131A-75-19', 'Supermarket Systems', 'Glass Door Chiller Cabinet', 'Commercial-grade Glass Door Chiller Cabinet model RM2D-131A-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1310 x 750 x 1930 mm.', '1310 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1310 x 750 x 1930", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "1050", "Display Area (m²)": "1.5", "Input Power (W)": "230", "Power Supply": "220V/50Hz", "Type": "Remote"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('glass-door-chiller-cabinet-rm3d-197a-75-19', 'Glass Door Chiller Cabinet RM3D-197A-75-19', 'RM3D-197A-75-19', 'Supermarket Systems', 'Glass Door Chiller Cabinet', 'Commercial-grade Glass Door Chiller Cabinet model RM3D-197A-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~7 temperature range. Dimensions: 1965 x 750 x 1930 mm.', '1965 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1965 x 750 x 1930", "Temperature Range (°C)": "2~7", "Effective Capacity (L)": "1550", "Display Area (m²)": "2.25", "Input Power (W)": "380", "Power Supply": "220V/50Hz", "Type": "Remote"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-glass-door-freezer-cabinet-sl2d-131-75-19', 'Plug-In Glass Door Freezer Cabinet SL2D-131-75-19', 'SL2D-131-75-19', 'Supermarket Systems', 'Plug-In Glass Door Freezer Cabinet', 'Commercial-grade Plug-In Glass Door Freezer Cabinet model SL2D-131-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the <=-18 temperature range. Dimensions: 1310 x 750 x 1930 mm.', '1310 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1310 x 750 x 1930", "Temperature Range (°C)": "<=-18", "Effective Capacity (L)": "750", "Display Area (m²)": "1.31", "Input Power (W)": "610", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('plug-in-glass-door-freezer-cabinet-sl3d-197-75-19', 'Plug-In Glass Door Freezer Cabinet SL3D-197-75-19', 'SL3D-197-75-19', 'Supermarket Systems', 'Plug-In Glass Door Freezer Cabinet', 'Commercial-grade Plug-In Glass Door Freezer Cabinet model SL3D-197-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the <=-18 temperature range. Dimensions: 1965 x 750 x 1930 mm.', '1965 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1965 x 750 x 1930", "Temperature Range (°C)": "<=-18", "Effective Capacity (L)": "1170", "Display Area (m²)": "1.97", "Input Power (W)": "830", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('remote-glass-door-slim-freezer-cabinet-rl2d-131-75-19', 'Remote Glass Door Slim Freezer Cabinet RL2D-131-75-19', 'RL2D-131-75-19', 'Supermarket Systems', 'Remote Glass Door Slim Freezer Cabinet', 'Commercial-grade Remote Glass Door Slim Freezer Cabinet model RL2D-131-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the <=-18 temperature range. Dimensions: 1310 x 750 x 1930 mm.', '1310 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1310 x 750 x 1930", "Temperature Range (°C)": "<=-18", "Effective Capacity (L)": "900", "Display Area (m²)": "0.98", "Input Power (W)": "401 (Defrost 1170)", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Remote')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('remote-glass-door-slim-freezer-cabinet-rl3d-197-75-19', 'Remote Glass Door Slim Freezer Cabinet RL3D-197-75-19', 'RL3D-197-75-19', 'Supermarket Systems', 'Remote Glass Door Slim Freezer Cabinet', 'Commercial-grade Remote Glass Door Slim Freezer Cabinet model RL3D-197-75-19 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the <=-18 temperature range. Dimensions: 1965 x 750 x 1930 mm.', '1965 x 750 x 1930', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1965 x 750 x 1930", "Temperature Range (°C)": "<=-18", "Effective Capacity (L)": "1395", "Display Area (m²)": "1.34", "Input Power (W)": "556 (Defrost 2130)", "Power Supply": "220V/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image2.png', 'Remote')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('ultra-low-temperature-86-c-deep-freezer-edw-86l575', 'Ultra-Low Temperature -86°C Deep Freezer EDW 86L575', 'EDW 86L575', 'Pharma & Medical', 'Ultra-Low Temperature -86°C Deep Freezer', 'Commercial-grade Ultra-Low Temperature -86°C Deep Freezer model EDW 86L575 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 568 capacity rating. Operates in the -40°°C ~ -86°C temperature range. Dimensions: 885 x 995 x 1980 mm. Utilizes eco-friendly Mixed Refrigerant refrigerant.', '885 x 995 x 1980', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cabinet Type": "Upright", "Cooling Mode": "Direct Cooling", "Refrigerant": "Mixed Refrigerant", "Capacity (Liters)": "568", "Internal Material": "Stainless Steel", "Display": "LED", "Temperature Range (°C)": "-40°°C ~ -86°C", "Dimensions (WxDxH mm)": "885 x 995 x 1980", "Interior Dimensions (WxDxH mm)": "595 x 720 x 1310", "Power Supply": "110 V-240V/50,60Hz", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Ultra-Low -86°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('ultra-low-temperature-86-c-deep-freezer-edw-86l475', 'Ultra-Low Temperature -86°C Deep Freezer EDW 86L475', 'EDW 86L475', 'Pharma & Medical', 'Ultra-Low Temperature -86°C Deep Freezer', 'Commercial-grade Ultra-Low Temperature -86°C Deep Freezer model EDW 86L475 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 458 capacity rating. Operates in the -40°°C ~ -86°C temperature range. Dimensions: 885 x 855 x 1980 mm. Utilizes eco-friendly Mixed Refrigerant refrigerant.', '885 x 855 x 1980', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cabinet Type": "Upright", "Cooling Mode": "Direct Cooling", "Refrigerant": "Mixed Refrigerant", "Capacity (Liters)": "458", "Internal Material": "Stainless Steel", "Display": "LED", "Temperature Range (°C)": "-40°°C ~ -86°C", "Dimensions (WxDxH mm)": "885 x 855 x 1980", "Interior Dimensions (WxDxH mm)": "595 x 580 x 1310", "Power Supply": "110 V-240V/50,60Hz", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Ultra-Low -86°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('ultra-low-temperature-86-c-deep-freezer-edw-86l-375', 'Ultra-Low Temperature -86°C Deep Freezer EDW 86L 375', 'EDW 86L 375', 'Pharma & Medical', 'Ultra-Low Temperature -86°C Deep Freezer', 'Commercial-grade Ultra-Low Temperature -86°C Deep Freezer model EDW 86L 375 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 358 capacity rating. Operates in the -40°°C ~ -86°C temperature range. Dimensions: 795 x 885 x 1855 mm. Utilizes eco-friendly Mixed refrigerant refrigerant.', '795 x 885 x 1855', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cabinet Type": "Upright", "Cooling Mode": "Direct Cooling", "Refrigerant": "Mixed refrigerant", "Capacity (Liters)": "358", "Internal Material": "PCM Liner", "Display": "LED", "Temperature Range (°C)": "-40°°C ~ -86°C", "Dimensions (WxDxH mm)": "795 x 885 x 1855", "Interior Dimensions (WxDxH mm)": "450 x 583 x 1326", "Power Supply": "220~ 240V/50Hz", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Ultra-Low -86°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('ultra-low-temperature-86-c-deep-freezer-edw-86l-125', 'Ultra-Low Temperature -86°C Deep Freezer EDW 86L 125', 'EDW 86L 125', 'Pharma & Medical', 'Ultra-Low Temperature -86°C Deep Freezer', 'Commercial-grade Ultra-Low Temperature -86°C Deep Freezer model EDW 86L 125 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 108 capacity rating. Operates in the -40°°C ~ -86°C temperature range. Dimensions: 955 x 675 x 815 mm. Utilizes eco-friendly Mixed refrigerant refrigerant.', '955 x 675 x 815', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cabinet Type": "Upright", "Cooling Mode": "Direct Cooling", "Refrigerant": "Mixed refrigerant", "Capacity (Liters)": "108", "Internal Material": "Galvanized Steel Sheet", "Display": "LED", "Temperature Range (°C)": "-40°°C ~ -86°C", "Dimensions (WxDxH mm)": "955 x 675 x 815", "Interior Dimensions (WxDxH mm)": "440 x 435 x 590", "Power Supply": "220~240v/ 50HZ", "Castors": "No"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Ultra-Low -86°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('biomedical-40-c-laboratory-freezer-edw-40l-525', 'Biomedical -40°C Laboratory Freezer EDW 40L 525', 'EDW 40L 525', 'Pharma & Medical', 'Biomedical -40°C Laboratory Freezer', 'Commercial-grade Biomedical -40°C Laboratory Freezer model EDW 40L 525 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -20°°C ~ -40°C temperature range. Dimensions: 866 x 811 x 1920 mm.', '866 x 811 x 1920', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Temperature Range (°C)": "-20°°C ~ -40°C", "External Material": "High Quality Coated Steel", "Internal Material": "High Quality Coated Steel", "Dimensions (WxDxH mm)": "866 x 811 x 1920", "Interior Dimensions (WxDxH mm)": "680 x 620 x 650", "Net/Gross Weight (Kg)": "142 / 164", "Foaming agent": "Cyclopantane", "Cooling Mode": "Direct Cooling", "Power Supply": "220~240V/50Hz", "Display": "LED display", "Castors": "Yes"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Medical -40°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('biomedical-40-c-laboratory-freezer-edw-40l-325', 'Biomedical -40°C Laboratory Freezer EDW 40L 325', 'EDW 40L 325', 'Pharma & Medical', 'Biomedical -40°C Laboratory Freezer', 'Commercial-grade Biomedical -40°C Laboratory Freezer model EDW 40L 325 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -20°°C ~ -40°C temperature range. Dimensions: 700 x 690 x 1920 mm.', '700 x 690 x 1920', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Temperature Range (°C)": "-20°°C ~ -40°C", "External Material": "High Quality Coated Steel", "Internal Material": "High Quality Coated Steel", "Dimensions (WxDxH mm)": "700 x 690 x 1920", "Interior Dimensions (WxDxH mm)": "540 x 450 x 1277", "Net/Gross Weight (Kg)": "102 / 114", "Foaming agent": "Cyclopantane", "Cooling Mode": "Direct Cooling", "Power Supply": "220V/50Hz", "Display": "LCD display", "Castors": "4/front 2 wheels lockable"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Medical -40°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('precision-laboratory-refrigerator-ecg-305-lab', 'Precision Laboratory Refrigerator ECG 305 Lab', 'ECG 305 Lab', 'Pharma & Medical', 'Precision Laboratory Refrigerator', 'Commercial-grade Precision Laboratory Refrigerator model ECG 305 Lab engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 300 capacity rating. Operates in the 2°C ~ 8C temperature range. Dimensions: 22 x 24 x 67 mm. Utilizes eco-friendly R134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "300", "Dimensions (WxDxH inch)": "22 x 24 x 67", "Temperature Range (°C)": "2°C ~ 8C", "Cooling Mode": "Ventilated Cooling", "Digital Display": "Yes", "Refrigerant": "R134a", "No. of Shelf": "4", "Door Type": "Double Layer Vacuum Glass", "Door Lock": "Yes", "Power Supply": "220/50"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Pharma Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('precision-laboratory-refrigerator-ecg-405-lab', 'Precision Laboratory Refrigerator ECG 405 Lab', 'ECG 405 Lab', 'Pharma & Medical', 'Precision Laboratory Refrigerator', 'Commercial-grade Precision Laboratory Refrigerator model ECG 405 Lab engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 400 capacity rating. Operates in the 2°C ~ 8C temperature range. Dimensions: 26 x 25 x 77 mm. Utilizes eco-friendly R134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "400", "Dimensions (WxDxH inch)": "26 x 25 x 77", "Temperature Range (°C)": "2°C ~ 8C", "Cooling Mode": "Ventilated Cooling", "Digital Display": "Yes", "Refrigerant": "R134a", "No. of Shelf": "4", "Door Type": "Double Layer Vacuum Glass", "Door Lock": "Yes", "Power Supply": "220/50"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Pharma Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('precision-laboratory-refrigerator-ecg-505-lab', 'Precision Laboratory Refrigerator ECG 505 Lab', 'ECG 505 Lab', 'Pharma & Medical', 'Precision Laboratory Refrigerator', 'Commercial-grade Precision Laboratory Refrigerator model ECG 505 Lab engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 515 capacity rating. Operates in the 2°C ~ 8C temperature range. Dimensions: 23 x 27 x 79 mm. Utilizes eco-friendly R134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "515", "Dimensions (WxDxH inch)": "23 x 27 x 79", "Temperature Range (°C)": "2°C ~ 8C", "Cooling Mode": "Ventilated Cooling", "Digital Display": "Yes", "Refrigerant": "R134a", "No. of Shelf": "4", "Door Type": "Double Layer Vacuum Glass", "Door Lock": "Yes", "Power Supply": "220/50"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Pharma Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('precision-laboratory-refrigerator-ecg-775-lab', 'Precision Laboratory Refrigerator ECG 775 Lab', 'ECG 775 Lab', 'Pharma & Medical', 'Precision Laboratory Refrigerator', 'Commercial-grade Precision Laboratory Refrigerator model ECG 775 Lab engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 700 capacity rating. Operates in the 2°C ~ 8C temperature range. Dimensions: 41 x 25 x 80 mm. Utilizes eco-friendly R134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "700", "Dimensions (WxDxH inch)": "41 x 25 x 80", "Temperature Range (°C)": "2°C ~ 8C", "Cooling Mode": "Ventilated Cooling", "Digital Display": "Yes", "Refrigerant": "R134a", "No. of Shelf": "8", "Door Type": "Double Layer Vacuum Glass", "Door Lock": "Yes", "Power Supply": "220/50"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Pharma Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('precision-laboratory-refrigerator-ecg-1075-lab', 'Precision Laboratory Refrigerator ECG 1075 Lab', 'ECG 1075 Lab', 'Pharma & Medical', 'Precision Laboratory Refrigerator', 'Commercial-grade Precision Laboratory Refrigerator model ECG 1075 Lab engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1000 capacity rating. Operates in the 2°C ~ 8C temperature range. Dimensions: 48 x 28 x 80 mm. Utilizes eco-friendly R134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "1000", "Dimensions (WxDxH inch)": "48 x 28 x 80", "Temperature Range (°C)": "2°C ~ 8C", "Cooling Mode": "Ventilated Cooling", "Digital Display": "Yes", "Refrigerant": "R134a", "No. of Shelf": "8", "Door Type": "Double Layer Vacuum Glass", "Door Lock": "Yes", "Power Supply": "220/50"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image31.png', 'Pharma Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('portable-active-vaccine-freezer-ebf-60t', 'Portable Active Vaccine Freezer EBF 60T', 'EBF 60T', 'Pharma & Medical', 'Portable Active Vaccine Freezer', 'Commercial-grade Portable Active Vaccine Freezer model EBF 60T engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 60 Ltr. capacity rating. Operates in the -20C To +20C temperature range. Utilizes eco-friendly R 134A refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "60 Ltr.", "Refrigerant": "R 134A", "Temperature Range (°C)": "-20C To +20C", "Digital Microprocessor": "Yes", "Temperature Display": "Digital Display", "Individual Temperature Set": "Yes", "Hold Over Time": "4 to 6 Hr", "Battery Backup": "6 to 8 Hr", "Inside Light": "Yes", "Removable Partition": "Yes", "Storage Chamber": "Convertible Dual Chamber", "Power Supply": "AC-220 to 240V, DC-12V/24V"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', 'WHO-PQS Ready')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('portable-active-vaccine-freezer-ebf-101', 'Portable Active Vaccine Freezer EBF 101', 'EBF 101', 'Pharma & Medical', 'Portable Active Vaccine Freezer', 'Commercial-grade Portable Active Vaccine Freezer model EBF 101 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 90 Ltr. capacity rating. Operates in the -20C To +20C temperature range. Utilizes eco-friendly R 134A refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "90 Ltr.", "Refrigerant": "R 134A", "Temperature Range (°C)": "-20C To +20C", "Digital Microprocessor": "Yes", "Temperature Display": "Digital Display", "Individual Temperature Set": "Yes", "Hold Over Time": "4 to 6 Hr", "Battery Backup": "6 to 8 Hr", "Inside Light": "Yes", "Removable Partition": "Yes", "Storage Chamber": "Convertible Dual Chamber", "Power Supply": "AC-220 to 240V, DC-12V/24V"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image29.png', 'WHO-PQS Ready')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('heavy-duty-laboratory-freezer-elf-1200-lab-6-2-shelves', 'Heavy-Duty Laboratory Freezer ELF 1200 Lab (6+2 Shelves)', 'ELF 1200 Lab (6+2 Shelves)', 'Pharma & Medical', 'Heavy-Duty Laboratory Freezer', 'Commercial-grade Heavy-Duty Laboratory Freezer model ELF 1200 Lab (6+2 Shelves) engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 1200 capacity rating. Operates in the -16°C ~ -25C temperature range.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Capacity (Liters)": "1200", "Temperature Range (°C)": "-16°C ~ -25C", "Temperature Display": "Digital", "Digital Microprocessor": "Yes", "Door Lock": "Yes", "Shelves": "6 + 2 Base", "Wheels": "Yes", "Door Type": "Solid / Glass Door"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Medical Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('heavy-duty-laboratory-freezer-elf-600-lab-3-1-shelves', 'Heavy-Duty Laboratory Freezer ELF 600 Lab (3+1 Shelves)', 'ELF 600 Lab (3+1 Shelves)', 'Pharma & Medical', 'Heavy-Duty Laboratory Freezer', 'Commercial-grade Heavy-Duty Laboratory Freezer model ELF 600 Lab (3+1 Shelves) engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16°C ~ -25C temperature range.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Temperature Range (°C)": "-16°C ~ -25C", "Temperature Display": "Digital", "Digital Microprocessor": "Yes", "Door Lock": "Yes", "Shelves": "3 + 1 Base", "Wheels": "Yes", "Door Type": "Solid / Glass Door"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png', 'Medical Grade')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-8', 'Commercial Refrigeration Condensing Unit CH-8', 'CH-8', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-8 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-134a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "2.34 Kw", "Refrigerant": "R-134a", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "250", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "1.5", "Power Supply": "220V/1Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-12', 'Commercial Refrigeration Condensing Unit CH-12', 'CH-12', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-12 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-407c refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "3.51 Kw", "Refrigerant": "R-407c", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "540", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "1.7", "Power Supply": "220V/1Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-15', 'Commercial Refrigeration Condensing Unit CH-15', 'CH-15', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-15 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-407c refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "4.39 Kw", "Refrigerant": "R-407c", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "770", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "2.2", "Power Supply": "220V/1Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-20', 'Commercial Refrigeration Condensing Unit CH-20', 'CH-20', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-20 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-407c refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "5.85 Kw", "Refrigerant": "R-407c", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "1200", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "3.1", "Power Supply": "400V/3Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-35', 'Commercial Refrigeration Condensing Unit CH-35', 'CH-35', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-35 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-407c refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "6.14 Kw", "Refrigerant": "R-407c", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "1200", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "5", "Power Supply": "400V/3Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-ch-42', 'Commercial Refrigeration Condensing Unit CH-42', 'CH-42', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CH-42 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the 2~6 temperature range. Utilizes eco-friendly R-407c refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "12.29 Kw", "Refrigerant": "R-407c", "Temperature Range (°C)": "2~6", "Loading Temperature (°C)": "30-35", "Max Loading (Kg/Day)": "2500", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "6.2", "Power Supply": "400V/3Ph/50Hz"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-4', 'Commercial Refrigeration Condensing Unit CL-4', 'CL-4', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-4 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "1.17 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "100", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "1.1", "Power Supply": "220V/1Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-6', 'Commercial Refrigeration Condensing Unit CL-6', 'CL-6', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-6 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "1.76 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "200", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "1.3", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-8', 'Commercial Refrigeration Condensing Unit CL-8', 'CL-8', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-8 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "2.34 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "350", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "2.5", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-10', 'Commercial Refrigeration Condensing Unit CL-10', 'CL-10', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-10 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "2.93 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "500", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "2.9", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-14', 'Commercial Refrigeration Condensing Unit CL-14', 'CL-14', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-14 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "4.1 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "1000", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "4.3", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-20', 'Commercial Refrigeration Condensing Unit CL-20', 'CL-20', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-20 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "5.85 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "2000", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "5.0", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-24', 'Commercial Refrigeration Condensing Unit CL-24', 'CL-24', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-24 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "7.02 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "2500", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "7.0", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('commercial-refrigeration-condensing-unit-cl-30', 'Commercial Refrigeration Condensing Unit CL-30', 'CL-30', 'Cold Room Solutions', 'Commercial Refrigeration Condensing Unit', 'Commercial-grade Commercial Refrigeration Condensing Unit model CL-30 engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the -16 ~ -20 temperature range. Utilizes eco-friendly R-404a refrigerant.', NULL, ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Cooling Capacity (kW)": "8.78 Kw", "Refrigerant": "R-404a", "Temperature Range (°C)": "-16 ~ -20", "Loading Temperature (°C)": "-10 ~ -15", "Max Loading (Kg/Day)": "3500", "Ambient (C)": "43 ~ 46", "Power Consumption (kW)": "8.5", "Power Supply": "400V/3Ph/50Hz", "Defrosting System": "Electric"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image3.png', 'Tropicalized 46°C')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('smart-automated-vending-machine-galaxy', 'Smart Automated Vending Machine Galaxy', 'Galaxy', 'Vending Solutions', 'Smart Automated Vending Machine', 'Commercial-grade Smart Automated Vending Machine model Galaxy engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 360~510 capacity rating. Operates in the 4°C ~ 25C temperature range. Dimensions: 1180 x 890 x 1985 mm.', '1180 x 890 x 1985', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1180 x 890 x 1985", "Touchscreen Display": "10 / 22", "SKU Capacity": "60 Varieties (Max)", "Number of Trays": "6", "Temperature Range (°C)": "4°C ~ 25C", "Power Supply": "220V/50Hz", "Power Consumption (W)": "422/24", "Gross Weight (Kg)": "350", "Item Capacity (Pcs)": "360~510"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', 'Smart IoT')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('smart-automated-vending-machine-nova', 'Smart Automated Vending Machine Nova', 'Nova', 'Vending Solutions', 'Smart Automated Vending Machine', 'Commercial-grade Smart Automated Vending Machine model Nova engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 300~350 capacity rating. Operates in the 4°C ~ 25C temperature range. Dimensions: 1275 x 790 x 1940 mm.', '1275 x 790 x 1940', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1275 x 790 x 1940", "Touchscreen Display": "22", "SKU Capacity": "42 Varieties (Max)", "Number of Trays": "6", "Temperature Range (°C)": "4°C ~ 25C", "Power Supply": "220V/50Hz", "Power Consumption (W)": "422/24", "Gross Weight (Kg)": "370", "Item Capacity (Pcs)": "300~350"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', 'Smart IoT')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('smart-automated-vending-machine-frozone', 'Smart Automated Vending Machine Frozone', 'Frozone', 'Vending Solutions', 'Smart Automated Vending Machine', 'Commercial-grade Smart Automated Vending Machine model Frozone engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 340 capacity rating. Operates in the 4°C ~ -18C temperature range. Dimensions: 1375 x 875 x 1940 mm.', '1375 x 875 x 1940', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1375 x 875 x 1940", "Touchscreen Display": "22", "SKU Capacity": "60 Varieties (Max)", "Number of Trays": "6", "Temperature Range (°C)": "4°C ~ -18C", "Power Supply": "220V/50Hz", "Power Consumption (W)": "422/24", "Gross Weight (Kg)": "370", "Item Capacity (Pcs)": "340"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', 'Smart IoT')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('smart-automated-vending-machine-apollo', 'Smart Automated Vending Machine Apollo', 'Apollo', 'Vending Solutions', 'Smart Automated Vending Machine', 'Commercial-grade Smart Automated Vending Machine model Apollo engineered for high reliability, precise temperature stability, and optimal energy efficiency. Operates in the Ambient temperature range. Dimensions: 1080 x 440 x 1840 mm.', '1080 x 440 x 1840', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "1080 x 440 x 1840", "Touchscreen Display": "10/13/15", "SKU Capacity": "17/19/24/37 (slots)", "Number of Trays": "6", "Temperature Range (°C)": "Ambient", "Power Supply": "220V/50Hz", "Power Consumption (W)": "422/24", "Gross Weight (Kg)": "As per slots"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', 'Smart IoT')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('smart-automated-vending-machine-orion', 'Smart Automated Vending Machine Orion', 'Orion', 'Vending Solutions', 'Smart Automated Vending Machine', 'Commercial-grade Smart Automated Vending Machine model Orion engineered for high reliability, precise temperature stability, and optimal energy efficiency. Features 180 capacity rating. Operates in the 4°C ~ 25C temperature range. Dimensions: 630 x 870 x 1940 mm.', '630 x 870 x 1940', ARRAY['Commercial heavy-duty high durability construction', 'Precision digital temperature controller', 'Eco-friendly high efficiency cooling circuit', 'Engineered to perform in harsh 43°C ambient Indian climate']::TEXT[], '{"Dimensions (WxDxH mm)": "630 x 870 x 1940", "Touchscreen Display": "QR / 10\"", "SKU Capacity": "60 Varieties (Max)", "Number of Trays": "6", "Temperature Range (°C)": "4°C ~ 25C", "Power Supply": "220V/50Hz", "Power Consumption (W)": "422/24", "Gross Weight (Kg)": "190", "Item Capacity (Pcs)": "180"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image25.png', 'Smart IoT')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-mini-lady', 'Draft Beer Dispenser Mini Lady', 'Mini Lady', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Mini Lady engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 407 x 407 x 280 mm.', '407 x 407 x 280', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "407 x 407 x 280", "Compressor Rating": "1/6 Hp", "Water Tank Capacity (L)": "12 L", "Ice Bank Capacity (Kg)": "4 Kg", "Number of Coils/Kegs": "1-2 Coils", "Dispense Rate (200ml/min)": "2 Glass", "Cooling Output": "25 Ltrs./Hr."}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', 'Compact')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-life-100', 'Draft Beer Dispenser Life 100', 'Life 100', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Life 100 engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 420 x 440 x 760 mm.', '420 x 440 x 760', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "420 x 440 x 760", "Compressor Rating": "1/3 Hp", "Water Tank Capacity (L)": "36 L", "Ice Bank Capacity (Kg)": "15 Kg", "Number of Coils/Kegs": "1-4 Coils", "Dispense Rate (200ml/min)": "8 Glass", "Cooling Output": "100 Ltrs./Hr."}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', 'Popular')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-life-130', 'Draft Beer Dispenser Life 130', 'Life 130', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Life 130 engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 480 x 490 x 840 mm.', '480 x 490 x 840', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "480 x 490 x 840", "Compressor Rating": "1/2 Hp", "Water Tank Capacity (L)": "50 L", "Ice Bank Capacity (Kg)": "23 Kg", "Number of Coils/Kegs": "1-8 Coils", "Dispense Rate (200ml/min)": "10 Glass", "Cooling Output": "130 Ltrs./Hr."}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-life-250', 'Draft Beer Dispenser Life 250', 'Life 250', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Life 250 engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 590 x 900 x 720 mm.', '590 x 900 x 720', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "590 x 900 x 720", "Compressor Rating": "3/4 Hp", "Water Tank Capacity (L)": "90 L", "Ice Bank Capacity (Kg)": "40 Kg", "Number of Coils/Kegs": "1-10 Coils", "Dispense Rate (200ml/min)": "20 Glass", "Cooling Output": "250 Ltrs./Hr."}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', 'Heavy Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-kegerator-4-slim', 'Draft Beer Dispenser Kegerator 4 Slim', 'Kegerator 4 Slim', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Kegerator 4 Slim engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 604 x 790 x 1000 mm.', '604 x 790 x 1000', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "604 x 790 x 1000", "Compressor Rating": "1/4 Hp", "Number of Coils/Kegs": "4 Slim Kegs (20 Ltr)", "Cooling Mode": "Direct Draw Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', '4-Tap')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
INSERT INTO public.products (id, name, model, category, subcategory, description, dimensions, features, specifications, image, badge)
VALUES ('draft-beer-dispenser-kegerator-6-slim', 'Draft Beer Dispenser Kegerator 6 Slim', 'Kegerator 6 Slim', 'Bar Refrigeration', 'Draft Beer Dispensing System', 'Professional draft beer cooling and dispensing unit model Kegerator 6 Slim engineered with Italian craftsmanship for optimal beer flow and rapid pull down. Dimensions: 1135 x 740 x 1020 mm.', '1135 x 740 x 1020', ARRAY['Premium Italian craftsmanship and heavy-duty build', 'Expandable tap design with optimized beer flow line', 'Eco-friendly high performance refrigerant', 'Rapid pull-down chilling system with cold water ice bank']::TEXT[], '{"Dimensions (WxDxH mm)": "1135 x 740 x 1020", "Compressor Rating": "1/3 Hp", "Number of Coils/Kegs": "6 Slim Kegs (20 Ltr)", "Cooling Mode": "Direct Draw Ventilated"}'::jsonb, 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image19.png', '6-Tap')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  description = EXCLUDED.description,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;