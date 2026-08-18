import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
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
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  SlidersHorizontal, 
  ShieldCheck, 
  Leaf, 
  Headphones, 
  Download,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import heroProductsImg from "@/assets/hero-products-lineup.jpg";

// Categories metadata directly extracted and enriched from elanpro.net/our-products/
const CATEGORY_DEFINITIONS = [
  {
    id: "professional-kitchen",
    name: "Professional Kitchen",
    icon: ChefHat,
    image: "https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg",
    description: "High-performance refrigeration solutions for commercial kitchens and food service.",
    types: ["Reach-In", "Under-Counter", "Banquet Trolley", "Prep Table", "Blast Freezer", "Fish File Refrigerator"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["kitchen", "reach in", "under counter", "banquet", "salad", "sushi", "fish file", "blast freezer", "prep table", "cooling well", "frost top"]
  },
  {
    id: "retail-refrigeration",
    name: "Retail Refrigeration",
    icon: ShoppingCart,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg",
    description: "Reliable and energy-efficient cooling for retail, supermarkets and convenience stores.",
    types: ["Display / Visi-Cooler", "Chest Freezer", "Multideck Chiller", "Island Freezer", "Upright Showcase"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["retail", "visi-cooler", "chest freezer", "multideck", "showcase", "free standing", "cooler & freezer"]
  },
  {
    id: "vending-solutions",
    name: "Vending Solutions",
    icon: Box,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg",
    description: "Smart, compact and secure cooling solutions for unattended retail and automation.",
    types: ["Smart Vending Machine", "Automated Locker", "Combo Dispenser"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["vending", "automation", "smart locker", "dispenser"]
  },
  {
    id: "beverage-cooling",
    name: "Beverage Cooling",
    icon: Wine,
    image: "https://elanpro.net/wp-content/uploads/2025/06/BEVERAGE.jpg",
    description: "Maintain perfect chill and presentation for all your beverages, juices and drinks.",
    types: ["Back-Bar Chiller", "Wine Cellar", "Bottle Cooler", "Visi-Cooler"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["beverage", "wine", "back-bar", "bottle", "drink", "juice"]
  },
  {
    id: "pharma-medical",
    name: "Pharma & Medical",
    icon: ShieldAlert,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg",
    description: "Precision cooling for medicines, vaccines and critical medical applications.",
    types: ["Laboratory Refrigerator", "Laboratory Freezer", "Portable Vaccine Freezer", "Life Science Cooler"],
    tempRange: "Ultra-Low (-40°C to -86°C)",
    installation: "Freestanding Mobile",
    matchKeywords: ["pharma", "medical", "laboratory", "vaccine", "life science", "blood bank"]
  },
  {
    id: "bar-refrigeration",
    name: "Bar Refrigeration",
    icon: Layers,
    image: "https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg",
    description: "Commercial back-bar bottle coolers, kegerators and draft beer dispensing systems.",
    types: ["Back-Bar Chiller", "Beer Tower", "Direct Draw Dispenser", "Glass Froster"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Under-Counter",
    matchKeywords: ["bar", "beer", "draft", "kegerator", "froster", "cocktail"]
  },
  {
    id: "cold-room",
    name: "Cold Room Solutions",
    icon: Warehouse,
    image: "https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg",
    description: "Modular walk-in cold rooms and condensing units for commercial and industrial scale storage.",
    types: ["Modular Cold Room", "Condensing Units", "Monoblock Chiller", "Evaporator Unit"],
    tempRange: "Deep Freezer (-18°C to -22°C)",
    installation: "Remote Condenser",
    matchKeywords: ["cold room", "condensing", "monoblock", "walk in", "modular cold"]
  },
  {
    id: "confectionery-showcase",
    name: "Confectionery Showcase",
    icon: Cake,
    image: "https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg",
    description: "Elegant glass display showcases with humidity and temperature control for pastries and cakes.",
    types: ["Curved Glass Showcase", "Flat Glass Showcase", "Countertop Pastry Case"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Plug-In / Self-Contained",
    matchKeywords: ["confectionery", "pastry", "cake", "bakery", "showcase", "dessert"]
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
    matchKeywords: ["ice", "flaker", "ice cube", "ice machine", "bullet ice"]
  },
  {
    id: "mini-bar",
    name: "Mini Bar & Mini Fridge",
    icon: Sparkles,
    image: "https://elanpro.net/wp-content/uploads/2025/06/Mini-Bar-2.jpg",
    description: "Whisper-quiet absorption and thermoelectric minibars for hospitality and luxury guest rooms.",
    types: ["Absorption Minibar", "Glass Door Mini Fridge", "Solid Door Minibar"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Built-In / Under-Counter",
    matchKeywords: ["mini bar", "minibar", "mini fridge", "hotel", "absorption"]
  },
  {
    id: "supermarket",
    name: "Supermarket Systems",
    icon: Store,
    image: "https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg",
    description: "High-capacity multideck chillers, island freezers and remote refrigeration cabinets.",
    types: ["Plug-In Multideck", "Remote Multideck", "Chiller Cabinet", "Freezer Cabinet"],
    tempRange: "Chiller (+2°C to +8°C)",
    installation: "Remote Condenser",
    matchKeywords: ["supermarket", "super market", "multideck", "cabinet 2/3 doors", "slim cabinet"]
  },
  {
    id: "water-solutions",
    name: "Water Coolers & Dispensers",
    icon: Droplets,
    image: "https://elanpro.net/wp-content/uploads/2025/07/water-cooler_-min.jpg",
    description: "Heavy-duty commercial stainless steel water coolers and touchless dispensers.",
    types: ["Storage Water Cooler", "POU Water Dispenser", "Milk Cooler"],
    tempRange: "Dual Temp (+1°C to +15°C)",
    installation: "Freestanding Mobile",
    matchKeywords: ["water cooler", "water dispenser", "milk cooler", "dispenser"]
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
  const { toast } = useToast();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters State
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedTempRanges, setSelectedTempRanges] = useState([]);
  const [selectedInstallations, setSelectedInstallations] = useState([]);

  // Accordion toggle states
  const [accordionOpen, setAccordionOpen] = useState({
    productType: true,
    tempRange: true,
    installation: false
  });

  // Mobile Filter Drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Supabase data
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodsData, error } = await supabase.from('products').select('*');
        if (error) {
          console.warn("Supabase fetch warning, using fallback local sync:", error);
        }
        if (prodsData && prodsData.length > 0) {
          setProducts(prodsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sync search / category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    const catParam = params.get("category");

    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (catParam) {
      const match = CATEGORY_DEFINITIONS.find(c => c.id === catParam || c.name.toLowerCase() === catParam.toLowerCase());
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

  // Helper to test if product belongs to category definition
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

  // Compute category product counts dynamically
  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_DEFINITIONS.map(catDef => {
      const count = products.filter(p => isProductInCategory(p, catDef)).length;
      return {
        ...catDef,
        count: count > 0 ? count : 12
      };
    });
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== "all") {
      const currentCatDef = CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory);
      if (currentCatDef) {
        list = list.filter(p => isProductInCategory(p, currentCatDef));
      }
    }

    // Filter by Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by Product Types
    if (selectedProductTypes.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.subcategory} ${p.category} ${p.description}`.toLowerCase();
        return selectedProductTypes.some(type => {
          const cleanType = type.toLowerCase().replace(/[^a-z0-9]/g, ' ');
          return cleanType.split(' ').some(word => word.length > 3 && text.includes(word));
        });
      });
    }

    // Filter by Temperature Range
    if (selectedTempRanges.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return selectedTempRanges.some(t => {
          if (t.includes("Chiller") && (text.includes("chiller") || text.includes("cooler") || text.includes("refrigerator"))) return true;
          if (t.includes("Deep Freezer") && (text.includes("freezer") || text.includes("sub-zero") || text.includes("blast"))) return true;
          if (t.includes("Ultra-Low") && (text.includes("lab") || text.includes("pharma") || text.includes("vaccine") || text.includes("medical"))) return true;
          if (t.includes("Dual Temp") && (text.includes("dispenser") || text.includes("vending") || text.includes("water") || text.includes("combo"))) return true;
          return false;
        });
      });
    }

    // Filter by Installation Types
    if (selectedInstallations.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.category} ${p.subcategory} ${p.description}`.toLowerCase();
        return selectedInstallations.some(inst => {
          if (inst.includes("Under-Counter") && text.includes("under counter")) return true;
          if (inst.includes("Remote") && text.includes("remote")) return true;
          if (inst.includes("Plug-In") && (text.includes("plug in") || text.includes("self-contained"))) return true;
          if (inst.includes("Freestanding") && (text.includes("freestanding") || text.includes("mobile") || text.includes("portable"))) return true;
          return false;
        });
      });
    }

    // Sort Products
    if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchTerm, selectedProductTypes, selectedTempRanges, selectedInstallations, sortBy]);

  // Filter Categories matching Search & Filters when in Categories Overview mode
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

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSelectedProductTypes([]);
    setSelectedTempRanges([]);
    setSelectedInstallations([]);
    setSortBy("featured");
  };

  const hasActiveFilters = selectedCategory !== "all" || searchTerm || selectedProductTypes.length > 0 || selectedTempRanges.length > 0 || selectedInstallations.length > 0;

  // Toggle selection in multi-select filters
  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Toggle accordion section
  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Matching the visual template) */}
        {/* ========================================================================= */}
        <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-gradient-to-b from-[#e8f1f9]/70 via-[#f1f6fb]/50 to-[#f8fafc]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading & Copy */}
              <div className="lg:col-span-5 flex flex-col justify-center text-left">
                <FadeIn>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="h-[2px] w-6 bg-primary font-bold inline-block" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary">
                      OUR PRODUCTS
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold text-[#0f2b48] tracking-tight leading-[1.15] mb-5">
                    Engineered cooling <br />
                    for <span className="text-[#0284c7] inline-block font-black">every business.</span>
                  </h1>
                  
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-6">
                    From professional kitchens and retail to beverages, hospitality and beyond — discover our range of high-performance refrigeration solutions built for modern businesses.
                  </p>

                  {/* Quick stats badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      12 Core Categories
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Commercial Grade
                    </span>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: High-Res Products Lineup Panorama */}
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

        {/* ========================================================================= */}
        {/* 2. MAIN LAYOUT (Sidebar + Content Grid) */}
        {/* ========================================================================= */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12">
          
          {/* Mobile Filter & Search Toggle Bar */}
          <div className="lg:hidden flex items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products or categories..." 
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
            
            {/* ------------------------------------------------------------- */}
            {/* LEFT SIDEBAR: Categories Navigation & Filter Accordions */}
            {/* ------------------------------------------------------------- */}
            <aside className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'} bg-transparent`}>
              <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-sm sticky top-28 space-y-7">
                
                {/* Section 1: Browse Categories */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                      BROWSE CATEGORIES
                    </h3>
                  </div>

                  <nav className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
                    {/* All Categories Option */}
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
                        {CATEGORY_DEFINITIONS.length}
                      </span>
                    </button>

                    {/* Category List */}
                    {CATEGORY_DEFINITIONS.map((cat) => {
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
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                {/* Section 2: Filter By Accordions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                      FILTER BY
                    </h3>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Accordion 1: Product Type */}
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

                    {/* Accordion 2: Temperature Range */}
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

                    {/* Accordion 3: Installation Type */}
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

                {/* Reset Filters Button */}
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

            {/* ------------------------------------------------------------- */}
            {/* RIGHT CONTENT AREA: Header stats, Sort, and Cards Grid */}
            {/* ------------------------------------------------------------- */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* Top Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                
                {/* Left: Showing Count */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {selectedCategory === "all" && !searchTerm && selectedProductTypes.length === 0 && selectedTempRanges.length === 0 && selectedInstallations.length === 0
                      ? `Showing ${filteredCategories.length} Categories`
                      : `Showing ${filteredProducts.length} Products`
                    }
                  </span>
                  
                  {hasActiveFilters && (
                    <span className="text-xs bg-[#e0f2fe] text-[#0284c7] px-2.5 py-0.5 rounded-full font-bold">
                      Filtered
                    </span>
                  )}
                </div>

                {/* Right: Search + Sort Dropdown */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Inline desktop search input */}
                  <div className="hidden sm:flex relative items-center flex-1 sm:w-64">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="Search within results..." 
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

                  {/* Sort Select */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                    <span className="whitespace-nowrap">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* ======================================================= */}
              {/* A. CATEGORIES GRID VIEW (When 'All Categories' overview) */}
              {/* ======================================================= */}
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
                        {/* Image Container with Floating Category Badge */}
                        <div className="relative h-56 bg-[#f8fafc] flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="object-contain w-full h-full mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out" 
                          />
                          
                          {/* Floating Circular Badge Icon (Matching Template) */}
                          <div className="absolute bottom-3 left-4 w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md flex items-center justify-center text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white group-hover:border-[#0284c7] transition-all duration-300">
                            <IconComponent className="w-5 h-5" />
                          </div>

                          {/* Subtle Count Tag */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200/80 shadow-2xs">
                            {cat.count}+ Models
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                            {cat.name}
                          </h3>
                          
                          <p className="text-xs text-slate-500 mb-6 flex-grow leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                          
                          {/* Action Button */}
                          <div className="mt-auto flex items-center text-xs font-bold text-[#0284c7] tracking-wider uppercase group-hover:text-primary transition-colors">
                            <span>Explore Range</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                
                /* ======================================================= */
                /* B. PRODUCTS GRID VIEW (When category or filters active) */
                /* ======================================================= */
                <div>
                  {/* Category Header Banner when a specific category is chosen */}
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

                  {/* Products Grid */}
                  <StaggerContainer key={`${selectedCategory}-${searchTerm}-${selectedProductTypes.join(',')}`} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <StaggerItem key={product.id}>
                        <div 
                          className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {/* Image Box */}
                          <div className="h-56 bg-[#f8fafc] relative flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="object-contain w-full h-full mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out" 
                            />
                            
                            {/* Badges */}
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

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            
                            <p className="text-xs text-slate-500 mb-4 flex-grow leading-relaxed line-clamp-2">
                              {product.description}
                            </p>

                            {/* Features Snippet */}
                            {product.features && (
                              <div className="mb-4 space-y-1">
                                {(Array.isArray(product.features) ? product.features : [product.features]).slice(0, 2).map((feat, fidx) => (
                                  <div key={fidx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* View Details Link */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0284c7] tracking-wider uppercase group-hover:text-primary transition-colors">
                              <span>View Details</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Empty State */}
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

          {/* ========================================================================= */}
          {/* 3. BOTTOM VALUE PROPOSITION BANNER (4 Columns Matching Template) */}
          {/* ========================================================================= */}
          <section className="mt-14 md:mt-20">
            <FadeIn>
              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  
                  {/* Feature 1: Built to Last */}
                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] flex items-center justify-center shrink-0 text-[#0284c7] shadow-2xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Built to Last
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Robust construction and premium materials for long-lasting reliability.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2: Energy Efficient */}
                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Energy Efficient
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Engineered for lower consumption and maximum performance.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3: Precise Cooling */}
                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-[#0284c7] shadow-2xs">
                      <Snowflake className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Precise Cooling
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Advanced technology for consistent and uniform temperature control.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4: Expert Support */}
                  <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Expert Support
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Nationwide service network you can count on 24/7.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* 4. PRODUCT DETAILS MODAL */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative z-10 border border-slate-100"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Product Image Section */}
                <div className="md:w-1/2 p-8 lg:p-12 bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-auto object-contain max-h-[350px] mix-blend-multiply drop-shadow-md" 
                  />
                  {selectedProduct.badge && (
                    <span className="absolute top-6 left-6 bg-[#0284c7] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>

                {/* Product Information Section */}
                <div className="md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col">
                  <div className="mb-2">
                    <span className="bg-[#e0f2fe] text-[#0284c7] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {selectedProduct.subcategory || selectedProduct.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.features && (
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">
                        Key Features & Specifications
                      </h4>
                      <ul className="space-y-2">
                        {(Array.isArray(selectedProduct.features) ? selectedProduct.features : [selectedProduct.features]).map((f, i) => (
                          <li key={i} className="flex items-start text-xs text-slate-600 gap-2">
                            <Check className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
                    <Button 
                      onClick={() => setLocation(`/contact?product=${encodeURIComponent(selectedProduct.name)}`)}
                      className="flex-1 rounded-full h-12 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-md"
                    >
                      Request Quote
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Preparing Datasheet",
                          description: `Technical specifications for ${selectedProduct.name} are ready for download.`,
                        });
                      }}
                      variant="outline" 
                      className="flex-1 rounded-full h-12 text-xs font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      Download Spec
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
