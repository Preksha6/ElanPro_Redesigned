import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  LayoutGrid, 
  ChefHat, 
  ShoppingCart, 
  Box, 
  Wine, 
  ShieldAlert, 
  Layers, 
  Warehouse, 
  Cake, 
  Snowflake, 
  Sparkles, 
  Store, 
  Droplets, 
  RotateCcw, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  X, 
  SlidersHorizontal, 
  ShieldCheck, 
  Leaf, 
  Headphones, 
  CheckCircle2,
  Ruler,
  ThermometerSnowflake,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import heroProductsImg from "@/assets/hero-products-lineup.jpg";
import { getProductsFromDB, formatCleanDimensions, formatCleanTemp, getProductImage } from "@/lib/productService";

const CATEGORY_DEFINITIONS = [
  {
    id: "professional-kitchen",
    name: "Professional Kitchen",
    icon: ChefHat,
    image: "https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg",
    description: "Heavy-duty commercial reach-in, under-counter, salad counters, prep tables, and blast freezers.",
    types: ["Reach-In", "Under-Counter", "Banquet Trolley", "Prep Table", "Blast Freezer", "Fish File Refrigerator"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["professional kitchen", "reach-in", "under-counter", "salad counter", "sushi", "buffet", "frost top", "cooling well", "banquet trolley", "fish file", "blast chiller", "blast freezer", "prep table", "free-standing"]
  },
  {
    id: "retail-refrigeration",
    name: "Retail Refrigeration",
    icon: ShoppingCart,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg",
    description: "High-visibility glass-top chest freezers, island freezers, hard top freezers, and visi-coolers.",
    types: ["Display / Visi-Cooler", "Chest Freezer", "Multideck Chiller", "Island Freezer", "Upright Showcase"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["retail refrigeration", "flat glass", "curved glass", "hard top", "visi-cooler", "upright showcase", "specialty commercial", "chest freezer"]
  },
  {
    id: "vending-solutions",
    name: "Vending Solutions",
    icon: Box,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg",
    description: "Smart IoT automated vending machines for chilled beverages, snacks, and fresh food dispensing.",
    types: ["Smart Vending Machine", "Automated Locker", "Combo Dispenser"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["vending solutions", "smart automated vending", "vending", "galaxy", "nova", "frozone", "apollo", "orion"]
  },
  {
    id: "beverage-cooling",
    name: "Beverage Cooling",
    icon: Wine,
    image: "https://elanpro.net/wp-content/uploads/2025/06/BEVERAGE.jpg",
    description: "Wine chillers, back-bar bottle coolers, and draft beverage dispensing systems.",
    types: ["Back-Bar Chiller", "Wine Cellar", "Bottle Cooler", "Visi-Cooler"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["beverage cooling", "wine chiller", "back-bar", "under-counter bar", "beer & beverage", "wine"]
  },
  {
    id: "pharma-medical",
    name: "Pharma & Medical",
    icon: ShieldAlert,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg",
    description: "Ultra-low temperature -86°C deep freezers, biomedical -40°C freezers, and pharmacy refrigerators.",
    types: ["Laboratory Refrigerator", "Laboratory Freezer", "Portable Vaccine Freezer", "Life Science Cooler"],
    tempRange: "Ultra-Low (-40°C to -86°C)",
    installation: "Freestanding Mobile",
    matchKeywords: ["pharma & medical", "ultra-low", "biomedical", "laboratory", "vaccine", "pharma", "edw", "ecg 305", "epv", "elf"]
  },
  {
    id: "bar-refrigeration",
    name: "Bar Refrigeration",
    icon: Layers,
    image: "https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg",
    description: "Commercial back-bar bottle coolers, under-counter bars, and draft beer dispensing towers.",
    types: ["Back-Bar Chiller", "Beer Tower", "Direct Draw Dispenser", "Glass Froster"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Under-Counter",
    matchKeywords: ["bar refrigeration", "back-bar", "beer & beverage dispenser", "under-counter bar", "beer tower"]
  },
  {
    id: "cold-room",
    name: "Cold Room Solutions",
    icon: Warehouse,
    image: "https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg",
    description: "Modular walk-in cold rooms and condensing units for industrial & commercial cold storage.",
    types: ["Modular Cold Room", "Condensing Units", "Monoblock Chiller", "Evaporator Unit"],
    tempRange: "Deep Freezer (-18°C to -22°C)",
    installation: "Remote Condenser",
    matchKeywords: ["cold room solutions", "commercial condensing unit", "condensing", "cold room", "ecu"]
  },
  {
    id: "confectionery-showcase",
    name: "Confectionery Showcase",
    icon: Cake,
    image: "https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg",
    description: "Curved and flat glass display showcases with precision humidity control for pastries & bakery.",
    types: ["Curved Glass Showcase", "Flat Glass Showcase", "Countertop Pastry Case"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["confectionery showcase", "confectionery display", "countertop confectionery", "confectionery", "edc", "ehtc"]
  },
  {
    id: "ice-machine",
    name: "Ice Machine & Flakers",
    icon: Snowflake,
    image: "https://elanpro.net/wp-content/uploads/2025/06/ice.jpg",
    description: "High-yield commercial ice makers producing gourmet cubes, bullet ice, and flakers.",
    types: ["Modular Ice Machine", "Self-Contained Ice Maker", "Ice Flaker", "Ice Dispenser"],
    tempRange: "Deep Freezer (-18°C to -22°C)",
    installation: "Freestanding Mobile",
    matchKeywords: ["ice machine & flakers", "commercial ice machine", "ice machine", "flaker", "eim"]
  },
  {
    id: "mini-bar",
    name: "Mini Bar & Mini Fridge",
    icon: Sparkles,
    image: "https://elanpro.net/wp-content/uploads/2025/06/Mini-Bar-2.jpg",
    description: "Whisper-quiet absorption and thermoelectric minibars for hospitality and luxury suites.",
    types: ["Absorption Minibar", "Glass Door Mini Fridge", "Solid Door Minibar"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Built-In / Under-Counter",
    matchKeywords: ["mini bar & mini fridge", "silent hotel minibar", "mini bar", "minibar", "mini fridge", "emb"]
  },
  {
    id: "supermarket",
    name: "Supermarket Systems",
    icon: Store,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg",
    description: "High-capacity multideck open chillers, island freezers and 2/3 door remote cabinets.",
    types: ["Plug-In Multideck", "Remote Multideck", "Chiller Cabinet", "Freezer Cabinet"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Remote Condenser",
    matchKeywords: ["supermarket systems", "plug-in multideck", "remote multideck", "chiller cabinet", "freezer cabinet", "slim freezer", "multideck"]
  },
  {
    id: "water-solutions",
    name: "Water Coolers & Dispensers",
    icon: Droplets,
    image: "https://elanpro.net/wp-content/uploads/2025/07/water-cooler_-min.jpg",
    description: "Heavy-duty commercial stainless steel bulk milk coolers and water dispensers.",
    types: ["Storage Water Cooler", "POU Water Dispenser", "Milk Cooler"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Freestanding Mobile",
    matchKeywords: ["water solutions", "bulk milk cooler", "water cooler", "milk cooler", "dispenser", "emc"]
  }
];

const FILTER_PRODUCT_TYPES = [
  "Reach-In",
  "Under-Counter",
  "Display & Showcase",
  "Chest Freezers",
  "Visi-Coolers",
  "Blast Freezers",
  "Dispensing Systems",
  "Laboratory & Medical",
  "Cold Room & Condensing"
];

const FILTER_TEMPERATURES = [
  "Chiller (+2°C to +8°C)",
  "Deep Freezer (-18°C to -22°C)",
  "Ultra-Low (-40°C to -86°C)",
  "Dual Temp (+1°C to +15°C)"
];

const FILTER_INSTALLATIONS = [
  "Plug-In / Self-Contained",
  "Remote Condenser",
  "Under-Counter",
  "Freestanding Mobile"
];

export default function Categories() {
  const [location, setLocation] = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedTempRanges, setSelectedTempRanges] = useState([]);
  const [selectedInstallations, setSelectedInstallations] = useState([]);

  const [accordionOpen, setAccordionOpen] = useState({
    productType: true,
    tempRange: true,
    installation: false
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getProductsFromDB();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleCatalogueUpdated = () => {
      loadData();
    };
    window.addEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
    return () => window.removeEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || params.get("q");
    const catParam = params.get("category") || params.get("cat") || params.get("c");

    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (catParam) {
      const cleanCat = decodeURIComponent(catParam).toLowerCase().trim();
      const match = CATEGORY_DEFINITIONS.find(c => 
        c.id.toLowerCase() === cleanCat || 
        c.name.toLowerCase() === cleanCat ||
        c.id.replace(/-/g, ' ') === cleanCat ||
        cleanCat.includes(c.name.toLowerCase())
      );
      if (match) {
        setSelectedCategory(match.id);
      }
    }

    const handleNavbarSearch = () => {
      const q = new URLSearchParams(window.location.search).get("search");
      if (q !== null) {
        setSearchTerm(q);
      }
    };

    window.addEventListener("navbar-search", handleNavbarSearch);
    window.addEventListener("popstate", handleNavbarSearch);
    return () => {
      window.removeEventListener("navbar-search", handleNavbarSearch);
      window.removeEventListener("popstate", handleNavbarSearch);
    };
  }, [location]);

  const isProductInCategory = (product, catDef) => {
    if (!product || !catDef) return false;
    const cat = (product.category || "").toLowerCase();
    const subcat = (product.subcategory || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();

    return catDef.matchKeywords.some(kw => 
      cat.includes(kw) || subcat.includes(kw) || name.includes(kw) || desc.includes(kw)
    );
  };

  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_DEFINITIONS.map(catDef => {
      const count = products.filter(p => isProductInCategory(p, catDef)).length;
      return {
        ...catDef,
        count: count
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      const currentCatDef = CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory);
      if (currentCatDef) {
        list = list.filter(p => isProductInCategory(p, currentCatDef));
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.model && p.model.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedProductTypes.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.subcategory} ${p.category} ${p.description}`.toLowerCase();
        return selectedProductTypes.some(type => {
          const cleanType = type.toLowerCase().replace(/[^a-z0-9]/g, ' ');
          return cleanType.split(' ').some(word => word.length > 3 && text.includes(word));
        });
      });
    }

    if (selectedTempRanges.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.category} ${p.description} ${JSON.stringify(p.specifications || {})}`.toLowerCase();
        return selectedTempRanges.some(t => {
          if (t.includes("Chiller") && (text.includes("chiller") || text.includes("cooler") || text.includes("2°c") || text.includes("refrigerator"))) return true;
          if (t.includes("Deep Freezer") && (text.includes("freezer") || text.includes("-18°c") || text.includes("-22°c") || text.includes("blast"))) return true;
          if (t.includes("Ultra-Low") && (text.includes("-86") || text.includes("-40") || text.includes("lab") || text.includes("vaccine") || text.includes("pharma"))) return true;
          if (t.includes("Dual Temp") && (text.includes("dispenser") || text.includes("vending") || text.includes("water") || text.includes("milk"))) return true;
          return false;
        });
      });
    }

    if (selectedInstallations.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.category} ${p.subcategory} ${p.description} ${JSON.stringify(p.specifications || {})}`.toLowerCase();
        return selectedInstallations.some(inst => {
          if (inst.includes("Under-Counter") && text.includes("under counter")) return true;
          if (inst.includes("Remote") && (text.includes("remote") || text.includes("condensing"))) return true;
          if (inst.includes("Plug-In") && (text.includes("plug in") || text.includes("self-contained") || text.includes("reach in") || text.includes("showcase"))) return true;
          if (inst.includes("Freestanding") && (text.includes("freestanding") || text.includes("mobile") || text.includes("portable") || text.includes("trolley"))) return true;
          return false;
        });
      });
    }

    if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchTerm, selectedProductTypes, selectedTempRanges, selectedInstallations, sortBy]);

  const filteredCategories = useMemo(() => {
    if (selectedCategory !== "all") {
      return categoriesWithCounts.filter(c => c.id === selectedCategory);
    }
    if (!searchTerm.trim()) {
      return categoriesWithCounts;
    }
    const q = searchTerm.toLowerCase();
    return categoriesWithCounts.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.types.some(t => t.toLowerCase().includes(q))
    );
  }, [categoriesWithCounts, selectedCategory, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSelectedProductTypes([]);
    setSelectedTempRanges([]);
    setSelectedInstallations([]);
    setSortBy("featured");
  };

  const hasActiveFilters = selectedCategory !== "all" || searchTerm || selectedProductTypes.length > 0 || selectedTempRanges.length > 0 || selectedInstallations.length > 0;

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        
        {/* HERO SECTION */}
        <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-gradient-to-b from-[#e8f1f9]/70 via-[#f1f6fb]/50 to-[#f8fafc]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col justify-center text-left">
                <FadeIn>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="h-[2px] w-6 bg-primary font-bold inline-block" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
                      COMMERCIAL COOLING SOLUTIONS
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold text-[#0f2b48] tracking-tight leading-[1.15] mb-5">
                    Engineered cooling <br />
                    for <span className="text-[#0284c7] inline-block font-black">every business.</span>
                  </h1>
                  
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-6">
                    Explore 170+ high-performance commercial refrigeration solutions — engineered for precision cooling and 43°C tropical ambient durability.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      12 Core Categories
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      170 Real Models
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Tropicalized at 43°C
                    </span>
                  </div>
                </FadeIn>
              </div>

              <div className="lg:col-span-7 relative flex items-center justify-center">
                <FadeIn delay={0.2} className="w-full">
                  <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,43,72,0.08)] border border-white/80 bg-white/40 backdrop-blur-sm group">
                    <img 
                      src={heroProductsImg} 
                      alt="Elanpro Commercial Refrigeration Equipment Lineup" 
                      className="w-full h-auto object-cover max-h-[360px] md:max-h-[420px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* MAIN LAYOUT */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12">
          
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-500">Loading categories...</p>
            </div>
          ) : (
            <>
              {/* Mobile Filter & Search Toggle Bar */}
              <div className="lg:hidden flex items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search model (e.g. EGN, EIM, EDW)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <Button 
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)} 
                  variant="outline" 
                  className="flex items-center gap-2 rounded-xl text-xs font-bold shrink-0 border-slate-200"
                >
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDEBAR */}
                <aside className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'} bg-transparent`}>
                  <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-sm sticky top-28 space-y-7">
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                          BROWSE CATEGORIES
                        </h3>
                      </div>

                      <nav className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                            selectedCategory === "all"
                              ? "bg-[#e0f2fe] text-[#0284c7] font-bold shadow-sm"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LayoutGrid className={`w-4 h-4 ${selectedCategory === "all" ? "text-[#0284c7]" : "text-slate-400"}`} />
                            <span>All Categories</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === "all" ? "bg-white/80 text-[#0284c7]" : "text-slate-400 bg-slate-100"}`}>
                            {products.length}
                          </span>
                        </button>

                        {categoriesWithCounts.map((cat) => {
                          const IconComponent = cat.icon;
                          const isSelected = selectedCategory === cat.id;

                          return (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
                                isSelected
                                  ? "bg-[#e0f2fe] text-[#0284c7] font-bold shadow-sm"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-[#0284c7]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span className="truncate">{cat.name}</span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${isSelected ? "bg-white/80 text-[#0284c7]" : "text-slate-400 bg-slate-100 group-hover:bg-slate-200/60"}`}>
                                {cat.count}
                              </span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="h-[1px] bg-slate-100 w-full" />

                    {/* Filter By Accordions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                          FILTER BY
                        </h3>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Product Type */}
                        <div className="border-b border-slate-100 pb-3">
                          <button 
                            onClick={() => toggleAccordion("productType")}
                            className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-primary transition-colors py-1"
                          >
                            <span>Product Type</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${accordionOpen.productType ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {accordionOpen.productType && (
                            <div className="mt-2.5 space-y-2 pl-1">
                              {FILTER_PRODUCT_TYPES.map((type) => {
                                const isChecked = selectedProductTypes.includes(type);
                                return (
                                  <label 
                                    key={type} 
                                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                                  >
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleFilter(selectedProductTypes, setSelectedProductTypes, type)}
                                      className="rounded border-slate-300 text-primary focus:ring-primary/20 w-3.5 h-3.5"
                                    />
                                    <span>{type}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Temperature Range */}
                        <div className="border-b border-slate-100 pb-3">
                          <button 
                            onClick={() => toggleAccordion("tempRange")}
                            className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-primary transition-colors py-1"
                          >
                            <span>Temperature Range</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${accordionOpen.tempRange ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {accordionOpen.tempRange && (
                            <div className="mt-2.5 space-y-2 pl-1">
                              {FILTER_TEMPERATURES.map((temp) => {
                                const isChecked = selectedTempRanges.includes(temp);
                                return (
                                  <label 
                                    key={temp} 
                                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                                  >
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleFilter(selectedTempRanges, setSelectedTempRanges, temp)}
                                      className="rounded border-slate-300 text-primary focus:ring-primary/20 w-3.5 h-3.5"
                                    />
                                    <span>{temp}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Installation Type */}
                        <div className="pb-1">
                          <button 
                            onClick={() => toggleAccordion("installation")}
                            className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-primary transition-colors py-1"
                          >
                            <span>Installation Type</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${accordionOpen.installation ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {accordionOpen.installation && (
                            <div className="mt-2.5 space-y-2 pl-1">
                              {FILTER_INSTALLATIONS.map((inst) => {
                                const isChecked = selectedInstallations.includes(inst);
                                return (
                                  <label 
                                    key={inst} 
                                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                                  >
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleFilter(selectedInstallations, setSelectedInstallations, inst)}
                                      className="rounded border-slate-300 text-primary focus:ring-primary/20 w-3.5 h-3.5"
                                    />
                                    <span>{inst}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleResetFilters}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        Reset Filters
                      </button>
                    </div>

                  </div>
                </aside>

                {/* RIGHT CONTENT AREA */}
                <main className="lg:col-span-9 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-800">
                        {selectedCategory === "all" && !searchTerm && selectedProductTypes.length === 0 && selectedTempRanges.length === 0 && selectedInstallations.length === 0
                          ? `Showing ${filteredCategories.length} Categories (${products.length} Total Models)`
                          : `Showing ${filteredProducts.length} Models`
                        }
                      </span>
                      
                      {hasActiveFilters && (
                        <span className="text-xs bg-[#e0f2fe] text-[#0284c7] px-2.5 py-0.5 rounded-full font-bold">
                          Filtered
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="hidden sm:flex relative items-center flex-1 sm:w-64">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input 
                          type="text" 
                          placeholder="Search model (e.g. EGN, EIM, EDW)..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                        />
                        {searchTerm && (
                          <button onClick={() => setSearchTerm("")} className="absolute right-2 text-slate-400 hover:text-slate-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                        <span className="whitespace-nowrap">Sort by:</span>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          <option value="featured">Featured</option>
                          <option value="name-asc">Model: A to Z</option>
                          <option value="name-desc">Model: Z to A</option>
                          <option value="popular">Premium Badged</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CATEGORIES GRID VIEW */}
                  {selectedCategory === "all" && !searchTerm && selectedProductTypes.length === 0 && selectedTempRanges.length === 0 && selectedInstallations.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredCategories.map((cat, idx) => {
                        const IconComponent = cat.icon;

                        return (
                          <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: idx * 0.04 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer group"
                          >
                            <div className="relative h-56 bg-[#f8fafc] flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                              <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="object-contain w-full h-full mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out" 
                              />
                              
                              <div className="absolute bottom-3 left-4 w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md flex items-center justify-center text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white group-hover:border-[#0284c7] transition-all duration-300">
                                <IconComponent className="w-5 h-5" />
                              </div>

                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200/80 shadow-2xs">
                                {cat.count} Models
                              </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                                {cat.name}
                              </h3>
                              
                              <p className="text-xs text-slate-500 mb-6 flex-grow leading-relaxed line-clamp-2">
                                {cat.description}
                              </p>
                              
                              <div className="mt-auto flex items-center text-xs font-bold text-[#0284c7] tracking-wider uppercase group-hover:text-primary transition-colors">
                                <span>Explore {cat.count} Models</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    
                    /* PRODUCTS GRID VIEW */
                    <div>
                      {selectedCategory !== "all" && (
                        <div className="mb-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            {CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory) && (
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                <img 
                                  src={CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory)?.image} 
                                  alt="Category Preview" 
                                  className="w-full h-full object-contain mix-blend-multiply" 
                                />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <button 
                                  onClick={() => setSelectedCategory("all")}
                                  className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                                >
                                  <ArrowLeft className="w-3 h-3" /> All Categories
                                </button>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-900">
                                {CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory)?.name || "Category Products"}
                              </h2>
                              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                                {CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory)?.description}
                              </p>
                            </div>
                          </div>

                          <Button 
                            onClick={() => setSelectedCategory("all")} 
                            variant="outline" 
                            className="rounded-full text-xs font-bold border-slate-200 hover:bg-slate-50 shrink-0"
                          >
                            View All Categories
                          </Button>
                        </div>
                      )}

                      <StaggerContainer key={`${selectedCategory}-${searchTerm}-${selectedProductTypes.join(',')}`} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => {
                          const specs = product.specifications || {};
                          const rawDim = product.dimensions || specs["Dimensions (WxDxH mm)"] || specs["Dimension WxDxH (mm)"] || specs["Product Dimensions(mm)(wxdxh)"] || specs["Dimensions WxDxH (mm)"] || specs["Dimension (WxDxH) mm"] || "";
                          const dim = formatCleanDimensions(rawDim);
                          const cap = specs["Capacity (Liters)"] || specs["Capacity (L)"] || specs["SKU / Selection Capacity"] || specs["Item Capacity (Pcs)"] || specs["Storage Capacity (Items)"] || specs["Ice Bin Capacity (Kg)"] || specs["Total Storage Volume(L )"] || specs["Capacity Ltrs."] || "";
                          const rawTemp = specs["Temperature Range (°C)"] || specs["Temperature range (°C)"] || specs["Temperature Range"] || specs["Temperature (°C)"] || "";
                          const temp = formatCleanTemp(rawTemp);

                          return (
                            <StaggerItem key={product.id}>
                              <Link 
                                href={`/products/${product.id}`}
                                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                              >
                                <div className="h-56 bg-[#f8fafc] relative flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                                  <img 
                                    src={getProductImage(product)} 
                                    alt={product.name} 
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png';
                                    }}
                                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out" 
                                  />
                                  
                                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 pointer-events-none">
                                    <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs truncate max-w-[70%]">
                                      {product.subcategory || product.category}
                                    </span>
                                    {product.badge && (
                                      <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                                        {product.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-black tracking-wider text-[#0284c7] uppercase">
                                      Model: {product.model || product.name}
                                    </span>
                                  </div>

                                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {product.name}
                                  </h3>
                                  
                                  <p className="text-xs text-slate-500 mb-4 flex-grow leading-relaxed line-clamp-2">
                                    {product.description}
                                  </p>

                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {dim && (
                                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px] text-slate-600 font-medium truncate max-w-full">
                                        <Ruler className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{dim}</span>
                                      </span>
                                    )}
                                    {cap && (
                                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px] text-slate-600 font-medium">
                                        <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span>{cap}</span>
                                      </span>
                                    )}
                                    {temp && (
                                      <span className="inline-flex items-center gap-1 bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] text-[#0284c7] font-medium">
                                        <ThermometerSnowflake className="w-3 h-3 text-[#0284c7] shrink-0" />
                                        <span>{temp}</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0284c7] tracking-wider uppercase group-hover:text-primary transition-colors">
                                    <span>View Details & Specs</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </Link>
                            </StaggerItem>
                          );
                        })}
                      </StaggerContainer>

                      {filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm mt-4 p-8">
                          <Box className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching products found</h3>
                          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                            We couldn't find any products matching your current category and filter selection.
                          </p>
                          <Button onClick={handleResetFilters} className="rounded-full px-6 text-xs font-bold bg-primary text-white">
                            Reset All Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                </main>

              </div>
            </>
          )}

          {/* BOTTOM VALUE PROPOSITION BANNER */}
          <section className="mt-14 md:mt-20">
            <FadeIn>
              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  
                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] flex items-center justify-center shrink-0 text-[#0284c7] shadow-2xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Built to Last
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Robust construction and SS 304 food-grade materials for heavy-duty reliability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Energy Efficient
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Eco-friendly R290/R600a refrigerants engineered for lower power consumption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-[#0284c7] shadow-2xs">
                      <Snowflake className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Precise Cooling
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Dixell digital micro-controllers for uniform temperature stability at 43°C ambient.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Expert Support
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pan-India 300+ city authorized service and spare parts network 24/7.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          </section>

        </div>
      </div>
    </Layout>
  );
}
