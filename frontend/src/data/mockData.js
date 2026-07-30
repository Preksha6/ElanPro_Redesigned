































export const CATEGORIES = [
"Commercial Refrigeration",
"Food Service & Beverage Equipment",
"Specialized Solutions"];

export const MOCK_CATEGORIES = [
  { id: 1, name: "Commercial Refrigeration", count: 124, icon: "❄️", image: "https://elanpro.net/wp-content/uploads/2025/06/Frame-2-min.jpg" },
  { id: 2, name: "Food Service & Beverage Equipment", count: 85, icon: "🍷", image: "https://elanpro.net/wp-content/uploads/2025/06/Frame-3.png" },
  { id: 3, name: "Specialized Solutions", count: 32, icon: "🏥", image: "https://elanpro.net/wp-content/uploads/2025/06/Frame-4-min.jpg" }
];

export const MOCK_INDUSTRIES = [
  {
    id: "ind-1",
    name: "Hospitality",
    description: "Premium cooling solutions for luxury hotels, resorts, and premium venues ensuring optimal guest experience.",
    stat: "1000+ Hotels",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925",
    products: ["Display Chillers", "Wine Coolers", "Under-Counter Freezers"]
  },
  {
    id: "ind-2",
    name: "Retail & Supermarkets",
    description: "High-visibility display freezers and multi-deck chillers for modern retail environments.",
    stat: "5000+ Stores",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974",
    products: ["Multi-Deck Chillers", "Chest Freezers", "Island Freezers"]
  },
  {
    id: "ind-3",
    name: "Food & Beverage",
    description: "Heavy-duty commercial kitchen refrigeration built for the demands of bustling restaurants.",
    stat: "10000+ Kitchens",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974",
    products: ["Reach-In Freezers", "Prep Counters", "Back-Bar Coolers"]
  },
  {
    id: "ind-4",
    name: "Healthcare",
    description: "Precision temperature-controlled medical and pharmacy refrigerators for critical supplies.",
    stat: "500+ Hospitals",
    image: "/images/healthcare_refrigeration.jpg",
    products: ["Pharmacy Refrigerators", "Blood Bank Chillers", "Ultra-Low Freezers"]
  }
];


export const MOCK_PRODUCTS = [
// ── Commercial Refrigeration ──────────────────────────────────────────────
{
  id: "cr-1",
  name: "ProFreeze Chest Freezer",
  category: "Commercial Refrigeration",
  subcategory: "Chest Freezers",
  description: "High-capacity deep freezer optimised for bulk storage in supermarkets and large kitchens.",
  features: ["Heavy-duty compressor", "Energy efficient", "Lockable lids"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/chest-freezer.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png",
  badge: "Popular"
},
{
  id: "cr-2",
  name: "AeroCool Visi-Cooler",
  category: "Commercial Refrigeration",
  subcategory: "Visi-Coolers",
  description: "Vertical glass door chiller perfect for beverage display and grab-and-go retail.",
  features: ["Anti-fog glass", "LED interior lighting", "Adjustable shelves"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/visi-cooler.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png",
  badge: "Bestseller"
},
{
  id: "cr-3",
  name: "Gourmet Pastry Showcase",
  category: "Commercial Refrigeration",
  subcategory: "Confectionery Showcases",
  description: "Elegant curved-glass display chiller designed for premium bakeries and patisseries.",
  features: ["Humidity control", "Curved aesthetic glass", "Rear sliding doors"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/pastry-showcase.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png",
  badge: "New"
},
{
  id: "cr-4",
  name: "ChefLine Under-Counter Chiller",
  category: "Commercial Refrigeration",
  subcategory: "Under-Counter Chillers",
  description: "Space-saving stainless steel chiller that doubles as a kitchen prep table.",
  features: ["Food-grade stainless steel", "Auto-defrost", "Gastronorm compatible"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/under-counter-chiller.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png"
},
{
  id: "cr-5",
  name: "Titan Reach-In Refrigerator",
  category: "Commercial Refrigeration",
  subcategory: "Reach-In Refrigerators",
  description: "Upright solid-door refrigerator for heavy-duty restaurant operations.",
  features: ["Digital temperature control", "Tropicalized compressor", "Self-closing doors"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/reach-in-fridge.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/URD-24SS-UFD-24SS-2.png"
},
{
  id: "cr-6",
  name: "Neon Back-Bar Chiller",
  category: "Commercial Refrigeration",
  subcategory: "Back-Bar Chillers",
  description: "Sleek low-profile cooler designed for busy bar environments.",
  features: ["Black textured finish", "Bright interior illumination", "Fast pull-down cooling"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/back-bar-chiller.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/EFGV-1000-2.png"
},
{
  id: "cr-7",
  name: "VinoReserve Wine Chiller",
  category: "Commercial Refrigeration",
  subcategory: "Wine Chillers",
  description: "Dual-zone wine cooler for optimal preservation of reds and whites.",
  features: ["Dual climate zones", "Vibration-free cooling", "UV-protected glass"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/wine-chiller.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/RL2D-123-156-RL3D-183234RL4D-245312-RL5D-390-RM2D-123-RM3D-183-RM-4D-245.png",
  badge: "Premium"
},
{
  id: "cr-8",
  name: "SilentStay Absorption Minibar",
  category: "Commercial Refrigeration",
  subcategory: "Absorption Minibars",
  description: "Completely silent operation mini-fridge engineered for luxury hotel rooms.",
  features: ["0 dB noise level", "Compact footprint", "Reversible door hinge"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/minibar.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png"
},

// ── Food Service & Beverage Equipment ────────────────────────────────────
{
  id: "fs-1",
  name: "CrystalClear Ice Cube Machine",
  category: "Food Service & Beverage Equipment",
  subcategory: "Ice Machines",
  description: "High-yield commercial ice maker producing solid, slow-melting cubes.",
  features: ["Self-cleaning cycle", "Large storage bin", "Air/Water cooled options"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/ice-machine.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png"
},
{
  id: "fs-2",
  name: "DraftMaster Beer Dispenser",
  category: "Food Service & Beverage Equipment",
  subcategory: "Dispensing Systems",
  description: "Multi-tap draft beer dispensing system with precise carbonation control.",
  features: ["Glycol cooling", "Stainless steel taps", "Rapid flow rate"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/beer-dispenser.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png",
  badge: "Popular"
},
{
  id: "fs-3",
  name: "BaristaPro Espresso Machine",
  category: "Food Service & Beverage Equipment",
  subcategory: "Professional Espresso Machines",
  description: "Italian-engineered multi-group espresso machine for specialty coffee shops.",
  features: ["Dual boiler", "PID temperature control", "Cool-touch steam wands"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/espresso-machine.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png",
  badge: "Premium"
},
{
  id: "fs-4",
  name: "BrewMatic Filter Coffee Maker",
  category: "Food Service & Beverage Equipment",
  subcategory: "Filter Coffee Machines",
  description: "High-volume batch brewer for breakfast buffets and corporate dining.",
  features: ["Thermal carafe", "Programmable recipes", "Direct water line"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/filter-coffee.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/URD-24SS-UFD-24SS-2.png"
},
{
  id: "fs-5",
  name: "SodaFlow Dispenser",
  category: "Food Service & Beverage Equipment",
  subcategory: "Soda Dispensing Systems",
  description: "Post-mix soda and juice dispensing system for QSRs and cafeterias.",
  features: ["8 beverage options", "Touchless dispensing", "Compact countertop form"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/soda-dispenser.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/EFGV-1000-2.png"
},
{
  id: "fs-6",
  name: "ChillBlast Water Dispenser",
  category: "Food Service & Beverage Equipment",
  subcategory: "Water Dispensers",
  description: "High-capacity chilled and hot water dispenser for office and hospitality use.",
  features: ["Instant hot/cold", "Built-in filtration", "Stainless steel tank"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/water-dispenser.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/RL2D-123-156-RL3D-183234RL4D-245312-RL5D-390-RM2D-123-RM3D-183-RM-4D-245.png"
},

// ── Specialized Solutions ─────────────────────────────────────────────────
{
  id: "sp-1",
  name: "BioSafe Lab Refrigerator",
  category: "Specialized Solutions",
  subcategory: "Life Science Refrigerators",
  description: "Precision cooling unit designed for sensitive pharmaceutical and biological samples.",
  features: ["±1°C variance", "Data logging", "Battery backup alarms"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/lab-refrigerator.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png",
  badge: "Medical Grade"
},
{
  id: "sp-2",
  name: "CryoVault Ultra-Low Freezer",
  category: "Specialized Solutions",
  subcategory: "Laboratory Freezers",
  description: "Ultra-low temperature freezer reaching -86°C for long-term sample preservation.",
  features: ["Cascade refrigeration", "VIP insulation", "Access port"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/ultra-low-freezer.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/RB-41G-and-RB-31G.png",
  badge: "New"
},
{
  id: "sp-3",
  name: "MediCool Blood Bank Refrigerator",
  category: "Specialized Solutions",
  subcategory: "Medical-Grade Coolers",
  description: "Certified blood storage refrigerator with specialised drawers and continuous monitoring.",
  features: ["Chart recorder", "Stainless steel drawers", "Transparent inner doors"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/blood-bank-fridge.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/06/JDLP-8-x-2.png"
},
{
  id: "sp-4",
  name: "VaxGuard Vaccine Refrigerator",
  category: "Specialized Solutions",
  subcategory: "Vaccine Storage",
  description: "WHO-PQS certified vaccine refrigerator maintaining 2–8°C for immunisation programmes.",
  features: ["Passive cooling backup", "Remote temp monitoring", "Tamper-proof lock"],
  // REPLACE WITH LOCAL PATH: /assets/images/products/vaccine-fridge.jpg
  image: "https://elanpro.net/wp-content/uploads/2025/07/EDC-1202-F3-Photoroom.png",
  badge: "Certified"
}];



export const MOCK_SERVICES = [
{
  id: "srv-1",
  title: "Nationwide Distribution",
  description: "A robust logistics network covering over 150 cities across India, ensuring rapid delivery and seamless installation.",
  icon: "truck"
},
{
  id: "srv-2",
  title: "Premium After-Sales Support",
  description: "Dedicated 24/7 helpline and a fleet of certified technicians ready to resolve issues with minimum downtime.",
  icon: "headphones"
},
{
  id: "srv-3",
  title: "Preventive Maintenance",
  description: "Comprehensive AMC (Annual Maintenance Contract) programs designed to extend equipment lifespan and optimize performance.",
  icon: "wrench"
}];

export const MOCK_STATS = [
{ value: "10,000+", label: "Clients Served", numeric: 10000, suffix: "+" },
{ value: "150+", label: "Cities Network", numeric: 150, suffix: "+" },
{ value: "50,000+", label: "Units Deployed", numeric: 50000, suffix: "+" }];