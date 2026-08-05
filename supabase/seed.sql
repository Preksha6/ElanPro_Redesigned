-- Seed Categories
INSERT INTO categories (id, name, count, icon, image) VALUES
  (1, 'Commercial Refrigeration', 124, '❄️', 'https://elanpro.net/wp-content/uploads/2025/06/Frame-2-min.jpg'),
  (2, 'Food Service & Beverage Equipment', 85, '🍷', 'https://elanpro.net/wp-content/uploads/2025/06/Frame-3.png'),
  (3, 'Specialized Solutions', 32, '🏥', 'https://elanpro.net/wp-content/uploads/2025/06/Frame-4-min.jpg')
ON CONFLICT (id) DO NOTHING;

-- Seed Industries
INSERT INTO industries (id, name, description, stat, image, products) VALUES
  ('ind-1', 'Hospitality', 'Premium cooling solutions for luxury hotels, resorts, and premium venues ensuring optimal guest experience.', '1000+ Hotels', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925', '{"Display Chillers", "Wine Coolers", "Under-Counter Freezers"}'),
  ('ind-2', 'Retail & Supermarkets', 'High-visibility display freezers and multi-deck chillers for modern retail environments.', '5000+ Stores', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974', '{"Multi-Deck Chillers", "Chest Freezers", "Island Freezers"}'),
  ('ind-3', 'Food & Beverage', 'Heavy-duty commercial kitchen refrigeration built for the demands of bustling restaurants.', '10000+ Kitchens', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974', '{"Reach-In Freezers", "Prep Counters", "Back-Bar Coolers"}'),
  ('ind-4', 'Healthcare', 'Precision temperature-controlled medical and pharmacy refrigerators for critical supplies.', '500+ Hospitals', '/images/healthcare_refrigeration.jpg', '{"Pharmacy Refrigerators", "Blood Bank Chillers", "Ultra-Low Freezers"}')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, name, category, subcategory, description, features, image, badge) VALUES
  ('cr-1', 'ProFreeze Chest Freezer', 'Commercial Refrigeration', 'Chest Freezers', 'High-capacity deep freezer optimised for bulk storage in supermarkets and large kitchens.', '{"Heavy-duty compressor", "Energy efficient", "Lockable lids"}', 'https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png', 'Popular'),
  ('cr-2', 'AeroCool Visi-Cooler', 'Commercial Refrigeration', 'Visi-Coolers', 'Vertical glass door chiller perfect for beverage display and grab-and-go retail.', '{"Anti-fog glass", "LED interior lighting", "Adjustable shelves"}', 'https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png', 'Bestseller'),
  ('cr-3', 'Gourmet Pastry Showcase', 'Commercial Refrigeration', 'Confectionery Showcases', 'Elegant curved-glass display chiller designed for premium bakeries and patisseries.', '{"Humidity control", "Curved aesthetic glass", "Rear sliding doors"}', 'https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png', 'New'),
  ('cr-4', 'ChefLine Under-Counter Chiller', 'Commercial Refrigeration', 'Under-Counter Chillers', 'Space-saving stainless steel chiller that doubles as a kitchen prep table.', '{"Food-grade stainless steel", "Auto-defrost", "Gastronorm compatible"}', 'https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png', NULL),
  ('cr-5', 'Titan Reach-In Refrigerator', 'Commercial Refrigeration', 'Reach-In Refrigerators', 'Upright solid-door refrigerator for heavy-duty restaurant operations.', '{"Digital temperature control", "Tropicalized compressor", "Self-closing doors"}', 'https://elanpro.net/wp-content/uploads/2025/06/URD-24SS-UFD-24SS-2.png', NULL),
  ('cr-6', 'Neon Back-Bar Chiller', 'Commercial Refrigeration', 'Back-Bar Chillers', 'Sleek low-profile cooler designed for busy bar environments.', '{"Black textured finish", "Bright interior illumination", "Fast pull-down cooling"}', 'https://elanpro.net/wp-content/uploads/2025/06/EFGV-1000-2.png', NULL),
  ('cr-7', 'VinoReserve Wine Chiller', 'Commercial Refrigeration', 'Wine Chillers', 'Dual-zone wine cooler for optimal preservation of reds and whites.', '{"Dual climate zones", "Vibration-free cooling", "UV-protected glass"}', 'https://elanpro.net/wp-content/uploads/2025/07/RL2D-123-156-RL3D-183234RL4D-245312-RL5D-390-RM2D-123-RM3D-183-RM-4D-245.png', 'Premium'),
  ('cr-8', 'SilentStay Absorption Minibar', 'Commercial Refrigeration', 'Absorption Minibars', 'Completely silent operation mini-fridge engineered for luxury hotel rooms.', '{"0 dB noise level", "Compact footprint", "Reversible door hinge"}', 'https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png', NULL),
  ('fs-1', 'CrystalClear Ice Cube Machine', 'Food Service & Beverage Equipment', 'Ice Machines', 'High-yield commercial ice maker producing solid, slow-melting cubes.', '{"Self-cleaning cycle", "Large storage bin", "Air/Water cooled options"}', 'https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png', NULL),
  ('fs-2', 'DraftMaster Beer Dispenser', 'Food Service & Beverage Equipment', 'Dispensing Systems', 'Multi-tap draft beer dispensing system with precise carbonation control.', '{"Glycol cooling", "Stainless steel taps", "Rapid flow rate"}', 'https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png', 'Popular'),
  ('fs-3', 'BaristaPro Espresso Machine', 'Food Service & Beverage Equipment', 'Professional Espresso Machines', 'Italian-engineered multi-group espresso machine for specialty coffee shops.', '{"Dual boiler", "PID temperature control", "Cool-touch steam wands"}', 'https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png', 'Premium'),
  ('fs-4', 'BrewMatic Filter Coffee Maker', 'Food Service & Beverage Equipment', 'Filter Coffee Machines', 'High-volume batch brewer for breakfast buffets and corporate dining.', '{"Thermal carafe", "Programmable recipes", "Direct water line"}', 'https://elanpro.net/wp-content/uploads/2025/06/URD-24SS-UFD-24SS-2.png', NULL),
  ('fs-5', 'SodaFlow Dispenser', 'Food Service & Beverage Equipment', 'Soda Dispensing Systems', 'Post-mix soda and juice dispensing system for QSRs and cafeterias.', '{"8 beverage options", "Touchless dispensing", "Compact countertop form"}', 'https://elanpro.net/wp-content/uploads/2025/06/EFGV-1000-2.png', NULL),
  ('fs-6', 'ChillBlast Water Dispenser', 'Food Service & Beverage Equipment', 'Water Dispensers', 'High-capacity chilled and hot water dispenser for office and hospitality use.', '{"Instant hot/cold", "Built-in filtration", "Stainless steel tank"}', 'https://elanpro.net/wp-content/uploads/2025/07/RL2D-123-156-RL3D-183234RL4D-245312-RL5D-390-RM2D-123-RM3D-183-RM-4D-245.png', NULL),
  ('sp-1', 'BioSafe Lab Refrigerator', 'Specialized Solutions', 'Life Science Refrigerators', 'Precision cooling unit designed for sensitive pharmaceutical and biological samples.', '{"±1°C variance", "Data logging", "Battery backup alarms"}', 'https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png', 'Medical Grade'),
  ('sp-2', 'CryoVault Ultra-Low Freezer', 'Specialized Solutions', 'Laboratory Freezers', 'Ultra-low temperature freezer reaching -86°C for long-term sample preservation.', '{"Cascade refrigeration", "VIP insulation", "Access port"}', 'https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png', 'New'),
  ('sp-3', 'MediCool Blood Bank Refrigerator', 'Specialized Solutions', 'Medical-Grade Coolers', 'Certified blood storage refrigerator with specialised drawers and continuous monitoring.', '{"Chart recorder", "Stainless steel drawers", "Transparent inner doors"}', 'https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png', NULL),
  ('sp-4', 'VaxGuard Vaccine Refrigerator', 'Specialized Solutions', 'Vaccine Storage', 'WHO-PQS certified vaccine refrigerator maintaining 2–8°C for immunisation programmes.', '{"Passive cooling backup", "Remote temp monitoring", "Tamper-proof lock"}', 'https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png', 'Certified')
ON CONFLICT (id) DO NOTHING;

-- Seed Services
INSERT INTO services (id, title, description, icon) VALUES
  ('srv-1', 'Nationwide Distribution', 'A robust logistics network covering over 150 cities across India, ensuring rapid delivery and seamless installation.', 'truck'),
  ('srv-2', 'Premium After-Sales Support', 'Dedicated 24/7 helpline and a fleet of certified technicians ready to resolve issues with minimum downtime.', 'headphones'),
  ('srv-3', 'Preventive Maintenance', 'Comprehensive AMC (Annual Maintenance Contract) programs designed to extend equipment lifespan and optimize performance.', 'wrench')
ON CONFLICT (id) DO NOTHING;

-- Seed Stats
INSERT INTO stats (id, value, label, numeric, suffix) VALUES
  (1, '10,000+', 'Clients Served', 10000, '+'),
  (2, '150+', 'Cities Network', 150, '+'),
  (3, '50,000+', 'Units Deployed', 50000, '+')
ON CONFLICT (id) DO NOTHING;
