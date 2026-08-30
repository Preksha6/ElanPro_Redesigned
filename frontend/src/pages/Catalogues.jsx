import React, { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  Eye, 
  Search, 
  Check, 
  CheckCircle2, 
  Grid, 
  List, 
  Filter, 
  Sparkles, 
  Layers, 
  X, 
  ArrowRight, 
  ExternalLink, 
  Mail, 
  Building2, 
  HardDrive, 
  Utensils, 
  ShoppingBag, 
  Stethoscope, 
  Wine, 
  Coffee,
  Share2,
  PackageCheck,
  Send,
  Lock,
  PhoneCall,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const CATALOGUES_DATA = [
  {
    id: "cold-room",
    name: "Cold Room Solutions",
    category: "industrial",
    categoryLabel: "Cold Chain & Industrial",
    year: "2024-2025",
    edition: "Vol. 4.2",
    size: "4.8 MB",
    pages: "36 Pages",
    modelsCount: "28+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg",
    desc: "Modular walk-in cold rooms, polyurethane insulation panels, hermetic & semi-hermetic condensing units, and rapid blast freezers for industrial and bulk food preservation.",
    featuredModels: ["Modular Walk-in Chillers", "Deep Freeze Walk-in Rooms", "Condensing Units", "Monoblock Units"],
    specs: "Temp Range: -40°C to +10°C | PUF Density: 40±2 kg/m³ | Eco Refrigerants: R404A / R449A",
    industries: ["Food Processing", "Hotels & Banquets", "Pharma Logistics", "Agri Cold Storage"],
    popular: true
  },
  {
    id: "pharma",
    name: "Pharma & Medical Refrigeration",
    category: "healthcare",
    categoryLabel: "Healthcare & Pharma",
    year: "2024-2025",
    edition: "Vol. 3.8",
    size: "3.4 MB",
    pages: "28 Pages",
    modelsCount: "18+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg",
    desc: "WHO-PQS compliant vaccine refrigerators, blood bank storage freezers, laboratory specimen deep freezers, and pharmacy temperature logging systems.",
    featuredModels: ["2°C to 8°C Vaccine Fridges", "-86°C Ultra Low Freezers", "Blood Bank Refrigerators", "Mortuary Chambers"],
    specs: "Microprocessor PID Controller | Dual Temp Probes | Battery Backup Loggers | DIN 58345 Compliant",
    industries: ["Hospitals", "Diagnostic Labs", "Blood Banks", "Vaccine Centers", "Research Institutes"],
    popular: true
  },
  {
    id: "professional-kitchen",
    name: "Professional Kitchen Refrigeration",
    category: "kitchen",
    categoryLabel: "Commercial Kitchen",
    year: "2024-2025",
    edition: "Vol. 5.1",
    size: "5.2 MB",
    pages: "44 Pages",
    modelsCount: "42+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg",
    desc: "Heavy-duty SS 304 food-grade reach-in upright chillers, blast chillers, GN pan refrigerated work counters, and pizza preparation stations.",
    featuredModels: ["Upright 2 & 4 Door Chillers", "Under-Counter Prep Counters", "Blast Chiller Shock Freezers", "Saladette Counters"],
    specs: "Stainless Steel 304 | Tropicalized at +43°C Ambient | Auto Defrost | Monoblock Cooling",
    industries: ["5-Star Hotels", "Cloud Kitchens", "Fine Dining", "QSR Chains", "Institutional Catering"],
    popular: true
  },
  {
    id: "supermarket",
    name: "Supermarket & Hypermarket Retail",
    category: "retail",
    categoryLabel: "Retail & Supermarket",
    year: "2024-2025",
    edition: "Vol. 4.0",
    size: "6.8 MB",
    pages: "52 Pages",
    modelsCount: "35+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg",
    desc: "Commercial open-front multidecks, island glass-top display freezers, serve-over delicatessen counters, and plug-in/remote supermarket cooling displays.",
    featuredModels: ["Open Multideck Chillers", "Panoramic Island Freezers", "Pastry & Deli Counters", "Vertical Glass Door Reach-ins"],
    specs: "Night Blinds for Energy Savings | Dual Temperature Switches | Inverter Compressors | LED Canopy",
    industries: ["Hypermarkets", "Supermarket Chains", "Gourmet Grocery Stores", "Convenience Stores"],
    popular: false
  },
  {
    id: "bar-refrigeration",
    name: "Bar & Beverage Refrigeration",
    category: "hospitality",
    categoryLabel: "Hospitality & Bar",
    year: "2024-2025",
    edition: "Vol. 3.5",
    size: "4.5 MB",
    pages: "32 Pages",
    modelsCount: "24+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg",
    desc: "High-visibility back-bar glass door chillers, under-counter bottle coolers, draft beer dispensers, keg coolers, and multi-zone wine cellars.",
    featuredModels: ["Back-Bar Bottle Coolers", "Draft Beer Dispensers (Kegerators)", "Multi-Zone Wine Coolers", "Frosters"],
    specs: "Low-E Heated Anti-Fog Glass | Digital Thermostat | Sub-Zero Beer Chilling (-2°C to +2°C)",
    industries: ["Pubs & Microbreweries", "Hotel Lounges", "Nightclubs", "Fine Dining Bars"],
    popular: false
  },
  {
    id: "confectionery",
    name: "Confectionery & Bakery Showcases",
    category: "hospitality",
    categoryLabel: "Hospitality & Bar",
    year: "2024-2025",
    edition: "Vol. 3.2",
    size: "3.9 MB",
    pages: "30 Pages",
    modelsCount: "22+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg",
    desc: "Luxury 4-sided glass pastry counters, humidity-controlled chocolate display showcases, rotating cake displays, and heated bakery warmers.",
    featuredModels: ["Curved Glass Cake Showcases", "Flat Square Glass Deli Counters", "Chocolate Temperature Humidifiers"],
    specs: "Heated Front Glass prevents condensation | 70% RH Humidity Control | Warm 3000K Bakery LED Lighting",
    industries: ["Artisan Bakeries", "Cafes & Patisseries", "Sweet Shops", "Hotel Coffee Shops"],
    popular: false
  },
  {
    id: "ice-machines",
    name: "Commercial Ice Machines & Flakers",
    category: "kitchen",
    categoryLabel: "Commercial Kitchen",
    year: "2024-2025",
    edition: "Vol. 2.9",
    size: "2.8 MB",
    pages: "24 Pages",
    modelsCount: "16+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/ice.jpg",
    desc: "High-output crystal gourmet dice ice makers, bullet ice machines, and granular flake ice dispensers for bars, restaurants, and medical applications.",
    featuredModels: ["Gourmet Dice Ice Makers", "Bullet Shape Ice Machines", "Flake Ice Generators", "Integrated Storage Bins"],
    specs: "Output from 25 kg/day to 1000 kg/day | Air & Water Cooled Condensers | Anti-Bacterial Food Grade Bins",
    industries: ["Bars & Cocktail Lounges", "QSR & Fast Food", "Seafood Processing", "Hospitals & Physiotherapy"],
    popular: false
  },
  {
    id: "vending-machines",
    name: "Smart Vending & Automated Retail",
    category: "retail",
    categoryLabel: "Retail & Supermarket",
    year: "2024-2025",
    edition: "Vol. 2.5",
    size: "2.6 MB",
    pages: "20 Pages",
    modelsCount: "12+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg",
    desc: "Next-generation automated retail vending machines with touchscreens, cloud telemetry, UPI QR payments, and dual-zone temperature compartments.",
    featuredModels: ["Snack & Beverage Combo Vending", "Elevator Drop Fresh Food Vending", "Frozen Ice Cream Vending"],
    specs: "Android/Linux OS | 21.5-inch Touchscreen | Drop Sensors | MDB Protocol & UPI Telemetry Integration",
    industries: ["Corporate Offices", "Airports & Metro Stations", "Hospitals", "Universities & Colleges"],
    popular: false
  },
  {
    id: "retail-coolers",
    name: "Retail Visi Coolers & Chest Freezers",
    category: "retail",
    categoryLabel: "Retail & Supermarket",
    year: "2024-2025",
    edition: "Vol. 4.6",
    size: "4.1 MB",
    pages: "38 Pages",
    modelsCount: "30+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg",
    desc: "Single, double, and triple door vertical beverage visi-coolers, curved glass deep freezers, and hard-top commercial storage freezers.",
    featuredModels: ["1/2/3 Glass Door Visi Coolers", "Curved Glass Island Chest Freezers", "Hard Top Commercial Freezers"],
    specs: "Heavy Duty BLDC Fans | Copper Tube Condensers | R290 Green Refrigerant | Dynamic Branding Canopies",
    industries: ["Beverage Bottlers", "Ice Cream Brands", "FMCG Retail Stores", "Local Supermarkets"],
    popular: true
  },
  {
    id: "mini-bars",
    name: "Hospitality Mini Bars & In-Room Solutions",
    category: "hospitality",
    categoryLabel: "Hospitality & Bar",
    year: "2024-2025",
    edition: "Vol. 2.1",
    size: "2.1 MB",
    pages: "18 Pages",
    modelsCount: "14+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/MINI-BAR.jpg",
    desc: "Whisper-silent 0dB absorption and thermoelectric guest room minibars, solid door and glass door variants, and luxury motorized hotel in-room safes.",
    featuredModels: ["Silent Absorption Minibars (30L to 60L)", "Thermoelectric Minibars", "In-Room Electronic Safes"],
    specs: "0 dB Silent Operation | Low Energy Consumption (A+ Rating) | Reversible Door Hinges | Internal LED",
    industries: ["Luxury Hotels & Resorts", "Business Boutique Hotels", "Executive Guest Houses", "Hospitals"],
    popular: false
  },
  {
    id: "special-refrigeration",
    name: "Specialized & Custom Commercial Builds",
    category: "industrial",
    categoryLabel: "Cold Chain & Industrial",
    year: "2024-2025",
    edition: "Vol. 3.0",
    size: "3.7 MB",
    pages: "26 Pages",
    modelsCount: "15+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Special-1.jpg",
    desc: "Bespoke engineered refrigeration solutions including drop-in wells, sushi display cases, aging meat dry agers, and mobile catering cold carts.",
    featuredModels: ["Dry Age Meat Cabinets", "Sushi Counter Displays", "Drop-in Cold Wells", "Buffet Counters"],
    specs: "Himalayan Salt Block Integration | Precision Humidity & Temp Calibration | Custom Architectural Finishes",
    industries: ["Steakhouses & Premium Meats", "Sushi & Japanese Dining", "Luxury Banquets", "Custom Architecture"],
    popular: false
  },
  {
    id: "lifestyle",
    name: "Life Style & Residential Luxury Cooling",
    category: "hospitality",
    categoryLabel: "Hospitality & Bar",
    year: "2024-2025",
    edition: "Vol. 2.8",
    size: "3.6 MB",
    pages: "24 Pages",
    modelsCount: "12+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Life-Style-1.jpg",
    desc: "Premium residential wine chillers, under-counter outdoor kitchen beverage stations, cigar humidors, and architectural glass refrigeration.",
    featuredModels: ["Dual Zone Home Wine Cellars", "Outdoor Kitchen Beverage Fridges", "Electronic Cigar Humidors"],
    specs: "Touch Control with OLED | Vibration Damping Wooden Shelves | UV-Protected Tinted Triple Glass",
    industries: ["Luxury Residences", "Private Villas", "Executive Boardrooms", "Yachts & High-End Penthouses"],
    popular: false
  },
  {
    id: "master-range",
    name: "Complete Brand Product Range Master Guide",
    category: "industrial",
    categoryLabel: "Cold Chain & Industrial",
    year: "2024-2025",
    edition: "Omnibus Edition",
    size: "12.5 MB",
    pages: "120 Pages",
    modelsCount: "200+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Range.jpg",
    desc: "Comprehensive master catalogue encapsulating Elanpro's entire portfolio of commercial refrigeration, display cases, medical cooling, and kitchen solutions.",
    featuredModels: ["Full 2024-2025 Product Matrix", "Technical Dimension Index", "Comparative Energy Charts"],
    specs: "Complete OEM & Technical Spec Book | Dimensional Layouts | Electrical & Plumbing Connection Diagrams",
    industries: ["Architects & Consultants", "Kitchen Planners", "Procurement Heads", "Dealers & Distributors"],
    popular: true
  },
  {
    id: "vending-2",
    name: "Automated Vending 2.0 Series",
    category: "retail",
    categoryLabel: "Retail & Supermarket",
    year: "2024-2025",
    edition: "Series 2.0",
    size: "3.1 MB",
    pages: "22 Pages",
    modelsCount: "10+ Models",
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Vending-Machine.jpg",
    desc: "Advanced smart micro-market refrigeration kiosks, smart weight-sensing grab-and-go coolers, and biometric vending solutions.",
    featuredModels: ["Smart Glass Fridge Micro-Markets", "Weight-Sensing Smart Coolers", "App-Driven Locker Kiosks"],
    specs: "AI Computer Vision & Load Cell Technology | Seamless App Checkout | Real-Time Cloud Inventory Sync",
    industries: ["Tech Parks", "Co-working Hubs", "Transit Terminals", "Fitness Gyms & Sports Arenas"],
    popular: false
  }
];

const CATEGORIES = [
  { id: "all", label: "All Catalogues", icon: Layers },
  { id: "kitchen", label: "Commercial Kitchen", icon: Utensils },
  { id: "retail", label: "Retail & Supermarket", icon: ShoppingBag },
  { id: "hospitality", label: "Hospitality & Bar", icon: Wine },
  { id: "healthcare", label: "Healthcare & Pharma", icon: Stethoscope },
  { id: "industrial", label: "Cold Chain & Industrial", icon: Building2 }
];

export default function Catalogues() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [selectedCatalogues, setSelectedCatalogues] = useState([]);
  const [previewCatalogue, setPreviewCatalogue] = useState(null);
  
  // Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [targetCataloguesForRequest, setTargetCataloguesForRequest] = useState([]); // array of catalogue objects
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "Hospitality & Hotels",
    requirement: ""
  });

  // Filter Catalogues
  const filteredCatalogues = useMemo(() => {
    return CATALOGUES_DATA.filter((cat) => {
      const matchesCategory = selectedCategory === "all" || cat.category === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.featuredModels.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cat.industries.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Open Request Modal for a single catalogue
  const handleOpenRequest = (cat) => {
    setTargetCataloguesForRequest([cat]);
    setIsSuccess(false);
    setRequestModalOpen(true);
  };

  // Open Request Modal for batch selection
  const handleOpenBatchRequest = () => {
    const targets = CATALOGUES_DATA.filter(c => selectedCatalogues.includes(c.id));
    setTargetCataloguesForRequest(targets.length > 0 ? targets : [filteredCatalogues[0]]);
    setIsSuccess(false);
    setRequestModalOpen(true);
  };

  // Toggle selection for batch download
  const toggleSelectCatalogue = (id) => {
    setSelectedCatalogues(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const allIds = filteredCatalogues.map(c => c.id);
    setSelectedCatalogues(allIds);
  };

  const clearSelection = () => {
    setSelectedCatalogues([]);
  };

  // Handle Form Submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.name || !requestForm.email || !requestForm.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter your name, email, and phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const catalogueNames = targetCataloguesForRequest.map(c => c.name).join(", ");

    const newInquiry = {
      id: "req-" + Date.now(),
      name: requestForm.name,
      email: requestForm.email,
      phone: requestForm.phone,
      company: requestForm.company || "N/A",
      product_interest: `Catalogue Request: ${catalogueNames}`,
      message: `Sector: ${requestForm.industry} | Note: ${requestForm.requirement || 'Requested high-res PDF literature'}`,
      status: 'unread',
      created_at: new Date().toISOString()
    };

    let insertedToDb = false;
    try {
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert([
          {
            name: newInquiry.name,
            email: newInquiry.email,
            phone: newInquiry.phone,
            company: newInquiry.company,
            product_interest: newInquiry.product_interest,
            message: newInquiry.message,
            status: 'unread'
          }
        ]);
        if (!error) {
          insertedToDb = true;
        }
      }
    } catch (err) {
      console.warn("Supabase insert notice:", err);
    }

    // Only save to local storage if database insert was not successful
    if (!insertedToDb) {
      try {
        const stored = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
        localStorage.setItem('elanpro_contact_messages', JSON.stringify([newInquiry, ...stored]));
      } catch (e) {}
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Literature Access Approved",
        description: `Your requested catalogue package is ready for ${requestForm.email}.`,
      });
    }, 600);
  };

  // Simulated instant file download post verification
  const handleTriggerDirectDownload = () => {
    toast({
      title: "Downloading Literature Files...",
      description: `Dispatched ${targetCataloguesForRequest.length} PDF catalogue(s).`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://elanpro.net/wp-content/uploads/2025/06/Catalogue.jpg"
            alt="Elanpro Catalogues"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Literature &amp; Technical Spec Sheets</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Product Catalogues
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
              Request comprehensive product brochures, dimensional blueprints, electrical spec sheets, and equipment guides for over 200+ commercial cooling systems.
            </p>

            {/* Quick Stats Banner */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>14 Specialist Catalogues</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                <span>200+ Commercial Models</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2024-2025 Current Editions</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Filter & Navigation Section */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-[56px] md:top-[64px] z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const count = cat.id === "all" 
                  ? CATALOGUES_DATA.length 
                  : CATALOGUES_DATA.filter(c => c.category === cat.id).length;
                
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-slate-500"}`} />
                    <span>{cat.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & View Mode Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by equipment, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Catalogues Listing Section */}
      <section className="py-16 bg-slate-50/50 min-h-[600px]">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Quick Selection Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
            <div className="text-xs text-slate-600">
              Showing <strong className="text-slate-900">{filteredCatalogues.length}</strong> of {CATALOGUES_DATA.length} Catalogues
              {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={selectAllFiltered}
                className="text-xs font-semibold text-accent hover:text-primary transition-colors"
              >
                Select All ({filteredCatalogues.length})
              </button>
              {selectedCatalogues.length > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={clearSelection}
                    className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                  >
                    Clear Selection ({selectedCatalogues.length})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === "grid" ? (
            <motion.div 
              key={`grid-${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCatalogues.map((cat, idx) => {
                const isSelected = selectedCatalogues.includes(cat.id);

                return (
                  <motion.div 
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                    className="h-full"
                  >
                    <div className={`h-full rounded-3xl bg-white border transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                      isSelected ? "border-accent ring-2 ring-accent/20" : "border-slate-200/80 hover:border-accent/40"
                    }`}>
                      <div>
                        {/* Cover Image with Action Overlays */}
                        <div className="relative h-60 bg-slate-950 overflow-hidden">
                          <img
                            src={cat.cover}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          
                          {/* Selection Checkbox */}
                          <div className="absolute top-3 left-3 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectCatalogue(cat.id);
                              }}
                              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                isSelected 
                                  ? "bg-accent text-white shadow-md" 
                                  : "bg-black/50 backdrop-blur-md text-white/70 hover:bg-black/80 border border-white/20"
                              }`}
                              title={isSelected ? "Deselect" : "Select for batch request"}
                            >
                              <Check className={`w-4 h-4 ${isSelected ? "opacity-100 stroke-[3]" : "opacity-0 hover:opacity-50"}`} />
                            </button>
                          </div>

                          {/* Edition & Size Badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            {cat.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                                Popular
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-[10px] border border-white/20">
                              {cat.year}
                            </span>
                          </div>

                          {/* Quick Action Eye Button */}
                          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setPreviewCatalogue(cat)}
                              className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-lg text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5">
                          <div className="text-[11px] font-bold text-accent uppercase tracking-wider mb-1">
                            {cat.categoryLabel}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                            {cat.desc}
                          </p>

                          {/* Meta Tags */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                              {cat.size}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                              {cat.modelsCount}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                              {cat.pages}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewCatalogue(cat)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Details</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleOpenRequest(cat)}
                          className="rounded-full bg-slate-900 hover:bg-accent text-white text-xs font-bold gap-1.5 transition-all shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Request PDF</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* LIST VIEW */
            <motion.div 
              key={`list-${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredCatalogues.map((cat, idx) => {
                const isSelected = selectedCatalogues.includes(cat.id);

                return (
                  <motion.div 
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                    className={`p-4 md:p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md ${
                      isSelected ? "border-accent ring-2 ring-accent/20" : "border-slate-200/80 hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <button
                        onClick={() => toggleSelectCatalogue(cat.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isSelected 
                            ? "bg-accent text-white shadow-md" 
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-300"
                        }`}
                      >
                        <Check className={`w-4 h-4 ${isSelected ? "opacity-100 stroke-[3]" : "opacity-0"}`} />
                      </button>

                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 shrink-0">
                        <img src={cat.cover} alt={cat.name} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                            {cat.categoryLabel}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-slate-400">{cat.year} Edition</span>
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-slate-600 text-xs line-clamp-1 max-w-2xl">
                          {cat.desc}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                          <span>{cat.size} PDF</span>
                          <span>•</span>
                          <span>{cat.modelsCount}</span>
                          <span>•</span>
                          <span>{cat.pages}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewCatalogue(cat)}
                        className="rounded-full text-xs font-bold border-slate-300 hover:border-accent"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        <span>Quick Preview</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleOpenRequest(cat)}
                        className="rounded-full bg-slate-900 hover:bg-accent text-white text-xs font-bold gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Request PDF</span>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {filteredCatalogues.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Catalogues Found</h3>
              <p className="text-xs text-slate-500 mb-6">
                No matching catalogues found for "{searchQuery}". Try searching for another equipment category or reset filters.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="rounded-full bg-slate-900 text-white text-xs font-bold"
              >
                Reset All Filters
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* Floating Sticky Batch Request Bar */}
      {selectedCatalogues.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 md:inset-x-auto md:right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl flex items-center justify-between gap-4 max-w-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                {selectedCatalogues.length}
              </div>
              <div>
                <div className="text-xs font-bold">
                  {selectedCatalogues.length} Catalogue{selectedCatalogues.length > 1 ? "s" : ""} Selected
                </div>
                <div className="text-[11px] text-slate-400">Ready for literature package request</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearSelection}
                className="text-xs text-slate-400 hover:text-white px-2"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleOpenBatchRequest}
                className="rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-bold gap-1.5 shadow-lg shadow-accent/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Selected</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewCatalogue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header with Cover */}
            <div className="relative h-48 bg-slate-950 overflow-hidden shrink-0">
              <img src={previewCatalogue.cover} alt={previewCatalogue.name} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setPreviewCatalogue(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-accent text-white font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                  {previewCatalogue.categoryLabel}
                </span>
                <h3 className="text-2xl font-bold font-display">{previewCatalogue.name}</h3>
                <div className="text-xs text-slate-300 mt-1">
                  Edition {previewCatalogue.edition} • {previewCatalogue.year} • {previewCatalogue.size} PDF
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs md:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Overview</h4>
                <p className="text-slate-600 leading-relaxed">{previewCatalogue.desc}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Featured Equipment Lines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewCatalogue.featuredModels.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Technical Scope Covered</h4>
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-medium">
                  {previewCatalogue.specs}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Target Industries</h4>
                <div className="flex flex-wrap gap-1.5">
                  {previewCatalogue.industries.map((ind, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleSelectCatalogue(previewCatalogue.id);
                  setPreviewCatalogue(null);
                }}
                className="rounded-full text-xs font-bold"
              >
                {selectedCatalogues.includes(previewCatalogue.id) ? "Remove from Batch" : "+ Add to Batch"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const cat = previewCatalogue;
                    setPreviewCatalogue(null);
                    handleOpenRequest(cat);
                  }}
                  className="rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-bold gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Catalogue PDF</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REQUEST CATALOGUE LEAD MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Authorized Literature Request</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-1">
                {isSuccess ? "Request Submitted Successfully" : "Request Product Catalogue"}
              </h3>
              
              <div className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-2">
                {targetCataloguesForRequest.length === 1 ? (
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium border border-white/10">
                    📖 {targetCataloguesForRequest[0].name} ({targetCataloguesForRequest[0].size})
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium border border-white/10">
                    📚 {targetCataloguesForRequest.length} Selected Catalogues Bundle
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900">
                    Thank you, {requestForm.name}!
                  </h4>
                  
                  <p className="text-xs md:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your request for <strong>{targetCataloguesForRequest.map(c => c.name).join(", ")}</strong> has been received. Our team will review your requirements and send the official high-resolution literature directly to <strong>{requestForm.email}</strong>.
                  </p>

                  <div className="pt-4 flex justify-center">
                    <Button
                      onClick={() => setRequestModalOpen(false)}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-8"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Please provide your contact details to access full technical specifications, dimension drawings, and high-resolution commercial literature.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={requestForm.name}
                        onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Work / Official Email <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh@hotelgroup.com"
                        value={requestForm.email}
                        onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile / WhatsApp <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={requestForm.phone}
                        onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Facility Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Palace Hotel"
                        value={requestForm.company}
                        onChange={(e) => setRequestForm({...requestForm, company: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Industry Sector / Project Type
                    </label>
                    <select
                      value={requestForm.industry}
                      onChange={(e) => setRequestForm({...requestForm, industry: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    >
                      <option value="Hospitality & Hotels">Hospitality, Hotels &amp; Resorts</option>
                      <option value="Restaurants & Commercial Kitchen">Restaurants, QSR &amp; Cloud Kitchens</option>
                      <option value="Bakery & Confectionery">Bakery, Patisserie &amp; Sweet Shops</option>
                      <option value="Supermarket & Grocery Retail">Supermarket &amp; Modern Food Retail</option>
                      <option value="Healthcare & Pharma">Hospitals, Laboratories &amp; Vaccines</option>
                      <option value="Cold Chain & Warehouse Logistics">Industrial Cold Storage &amp; Food Processing</option>
                      <option value="Architect & Consultant">Architect, MEP &amp; Kitchen Consultant</option>
                      <option value="Dealer & Distributor">Dealer, Distributor &amp; Channel Partner</option>
                      <option value="Other">Other Application</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Specific Requirements / Custom Specs (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need blast chiller dimensions and CAD layout for a new kitchen..."
                      value={requestForm.requirement}
                      onChange={(e) => setRequestForm({...requestForm, requirement: e.target.value})}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setRequestModalOpen(false)}
                      className="text-xs text-slate-500"
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-bold px-7 gap-2 shadow-lg shadow-accent/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Processing..." : "Submit & Access PDF"}</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Engineering Assistance & CAD/BIM Literature Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">
                Technical Planning Support
              </span>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
                Need CAD 2D/3D Drawings, BIM Families, or Custom Branding Specs?
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-2xl">
                Our refrigeration engineering department provides architects, commercial kitchen consultants, and project heads with AutoCAD .DWG files, Revit BIM models, electrical single-line diagrams, and customized brand vinyl wrap templates.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link href="/contact">
                <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-xs gap-2 py-5">
                  <Mail className="w-4 h-4" />
                  <span>Request Engineering CAD / BIM</span>
                </Button>
              </Link>
              <a href="https://tours.view360degrees.com/Elan-aahar/" target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full rounded-full border-white/20 text-white hover:bg-white/10 font-bold text-xs gap-2 py-5">
                  <ExternalLink className="w-4 h-4" />
                  <span>Explore Virtual 360° Showroom</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
