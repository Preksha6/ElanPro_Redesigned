import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, Search, Filter, Compass, ChevronDown, 
  PhoneCall, FileText, Wrench, Building2, ExternalLink, ArrowRight, Lock,
  PhoneForwarded, HelpCircle, Users, Layers, ShieldCheck, Sparkles,
  Mail, Phone, MapPin, HeartHandshake, Newspaper, Eye
} from "lucide-react";
import logoWhite from "@/assets/elanpro-logo-white.png";
import logoDark from "@/assets/elanpro-logo-dark.png";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Official CTA Quick Link Dropdown Options matching elanpro.net
const CTA_DROPDOWN_OPTIONS = [
  {
    title: "Get a Quote",
    desc: "Customized commercial pricing & volume estimates",
    path: "/contact?type=quote",
    icon: PhoneCall,
    badge: "Instant",
    isExternal: false
  },
  {
    title: "Request Call Back",
    desc: "Speak directly with an Elanpro cooling engineer",
    path: "/contact?type=callback",
    icon: PhoneForwarded,
    isExternal: false
  },
  {
    title: "Customer Service & Support",
    desc: "24/7 Pan-India maintenance & warranty claims",
    path: "/services",
    icon: Wrench,
    isExternal: false
  },
  {
    title: "Dealership & Partner Inquiries",
    desc: "Join our 560+ authorized dealer network",
    path: "/contact?type=dealership",
    icon: Users,
    isExternal: false
  },
  {
    title: "Download Catalogues",
    desc: "Access official product specs, manuals & brochures",
    path: "/catalogues",
    icon: FileText,
    isExternal: false
  },
  {
    title: "360° Virtual Office Tour",
    desc: "Explore our Gurugram HQ in full 360° VR",
    path: "https://tours.view360degrees.com/Elanpro%20Office/",
    icon: Compass,
    isExternal: true
  },
  {
    title: "Aahar Expo 360° Tour",
    desc: "Walkthrough the flagship Elanpro exhibition pavilion",
    path: "https://tours.view360degrees.com/Elan-aahar/",
    icon: Eye,
    isExternal: true
  }
];

// Official Categories matching elanpro.net
const CATEGORIES_DROPDOWN = [
  { name: "Professional Kitchen", path: "/categories?cat=Professional%20Kitchen" },
  { name: "Confectionery Showcase", path: "/categories?cat=Confectionery%20Showcase" },
  { name: "Retail & Supermarket", path: "/categories?cat=Super%20Market" },
  { name: "Beverage & Bar Refrigeration", path: "/categories?cat=Beverage" },
  { name: "Ice Machine & Flakers", path: "/categories?cat=Ice%20Machine%20/%20Flakers" },
  { name: "Mini Bar & Mini Fridge", path: "/categories?cat=Mini%20Bar%20&%20Mini%20Fridge" },
  { name: "Cold Room Solutions", path: "/categories?cat=Cold%20Room" },
  { name: "Pharma Refrigeration", path: "/categories?cat=Pharma" },
  { name: "Water Coolers & Dispensers", path: "/categories?cat=Water%20Cooler" },
  { name: "Vending Machine Solutions", path: "/categories?cat=Vending%20Solutions" }
];

// Official About Sub-items matching elanpro.net
const ABOUT_DROPDOWN = [
  { name: "Company Overview", path: "/about" },
  { name: "Mission, Vision, and Values", path: "/about" },
  { name: "Our Journey", path: "/about" },
  { name: "Our Strength", path: "/about" },
  { name: "Our Value Proposition", path: "/about" },
  { name: "Our Management", path: "/about" },
];

// Official CSR & Media Dropdown matching elanpro.net
const CSR_MEDIA_DROPDOWN = [
  { name: "CSR Policy", path: "/about" },
  { name: "Annual Return Policy", path: "/about" },
  { name: "Media & Blogs", path: "/about" },
  { name: "Aahar Expo Experience", path: "https://tours.view360degrees.com/Elan-aahar/", isExternal: true },
];

export function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null); // 'cta', 'categories', 'about', 'csrmedia', 'tours'
  const [mobileCtaOpen, setMobileCtaOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileCsrOpen, setMobileCsrOpen] = useState(false);

  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/categories?search=${encodeURIComponent(searchQuery)}`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('navbar-search'));
      }
      setMobileMenuOpen(false);
      setSearchQuery("");
      setActiveDropdown(null);
    }
  };

  const darkNavPages = ["/", "/clients", "/industries", "/services", "/about"];
  const useWhiteText = !isScrolled && darkNavPages.includes(location);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300" ref={headerRef}>
      

      {/* Main Navbar */}
      <div className={`w-full px-6 md:px-12 py-3 flex items-center justify-between transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}>
        
        {/* Logo */}
        <Link href="/">
          <div className="cursor-pointer flex items-center py-0.5 transition-opacity hover:opacity-90">
            <img 
              src={useWhiteText ? logoWhite : logoDark} 
              alt="Elanpro Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              location === '/' 
                ? "text-accent" 
                : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
            }`}
          >
            Home
          </Link>

          {/* About Us Dropdown with Real Site Sub-links */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/about"
              className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 py-1.5 ${
                location === '/about' 
                  ? "text-accent" 
                  : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
              }`}
            >
              <span>About Us</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
            </Link>

            <AnimatePresence>
              {activeDropdown === 'about' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                >
                  <div className="space-y-0.5">
                    {ABOUT_DROPDOWN.map((item, i) => (
                      <Link
                        key={i}
                        href={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Our Products Dropdown with Real Site Categories */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('categories')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/categories"
              className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 py-1.5 ${
                location === '/categories' 
                  ? "text-accent" 
                  : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
              }`}
            >
              <span>Our Products</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
            </Link>

            <AnimatePresence>
              {activeDropdown === 'categories' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 z-50"
                >
                  <div className="px-2 py-1 mb-1 border-b border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase text-gray-400">
                    <span>Commercial Segments</span>
                    <span className="text-primary font-bold">100+ Models</span>
                  </div>
                  <div className="space-y-0.5 max-h-72 overflow-y-auto custom-scrollbar">
                    {CATEGORIES_DROPDOWN.map((cat, idx) => (
                      <Link
                        key={idx}
                        href={cat.path}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 mt-1 border-t border-gray-100">
                    <Link
                      href="/categories"
                      onClick={() => setActiveDropdown(null)}
                      className="block text-center text-xs font-bold text-primary hover:underline py-1"
                    >
                      View All Product Categories →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/catalogues"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              location === '/catalogues' 
                ? "text-accent" 
                : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
            }`}
          >
            Catalogues
          </Link>

          <Link
            href="/industries"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              location === '/industries' 
                ? "text-accent" 
                : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
            }`}
          >
            Industries
          </Link>

          <Link
            href="/services"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              location === '/services' 
                ? "text-accent" 
                : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
            }`}
          >
            Services
          </Link>

          <Link
            href="/clients"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              location === '/clients' 
                ? "text-accent" 
                : useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
            }`}
          >
            Clients
          </Link>

          {/* CSR & Media Dropdown (Matching elanpro.net) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('csrmedia')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 py-1.5 cursor-pointer ${
                useWhiteText ? "text-white/90 hover:text-white" : "text-primary hover:text-accent"
              }`}
            >
              <span>CSR & Media</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'csrmedia' ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'csrmedia' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                >
                  <div className="space-y-0.5">
                    {CSR_MEDIA_DROPDOWN.map((item, i) => {
                      if (item.isExternal) {
                        return (
                          <a
                            key={i}
                            href={item.path}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors"
                          >
                            <span>{item.name}</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={i}
                          href={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors"
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Search & Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <form onSubmit={handleSearch} className="relative group flex items-center">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-24 focus:w-40 transition-all text-primary placeholder:text-gray-400"
              />
              <button type="submit" className="ml-1.5 p-1 text-gray-400 hover:text-primary transition-colors">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* 360 Degree Tour Dropdown Button */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('tours')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Button 
              asChild 
              variant="outline" 
              className={`font-bold rounded-full px-3.5 text-xs gap-1.5 transition-all shadow-sm h-9 cursor-pointer ${
                useWhiteText 
                  ? 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm' 
                  : 'bg-primary/5 text-primary border-primary/25 hover:bg-primary/10 hover:border-primary/50'
              }`}
            >
              <a 
                href="https://tours.view360degrees.com/Elanpro%20Office/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                <span>360° Tours</span>
                <ChevronDown className="w-3 h-3" />
              </a>
            </Button>

            <AnimatePresence>
              {activeDropdown === 'tours' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Interactive Virtual Tours
                  </div>
                  <div className="space-y-1 mt-1">
                    <a
                      href="https://tours.view360degrees.com/Elanpro%20Office/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setActiveDropdown(null)}
                      className="p-2 rounded-xl flex items-center gap-2.5 hover:bg-gray-50 text-gray-800 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-accent" />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          Elanpro HQ Virtual Tour
                          <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                        <div className="text-[10px] text-gray-400">Corporate Greens, Gurugram</div>
                      </div>
                    </a>

                    <a
                      href="https://tours.view360degrees.com/Elan-aahar/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setActiveDropdown(null)}
                      className="p-2 rounded-xl flex items-center gap-2.5 hover:bg-gray-50 text-gray-800 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          Aahar Expo Virtual Tour
                          <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                        <div className="text-[10px] text-gray-400">Flagship Exhibition Pavilion</div>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Quick Links CTA Button with Interactive Dropdown (Get in Touch) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('cta')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'cta' ? null : 'cta')}
              className="font-bold shadow-md rounded-full px-4 h-9 bg-primary text-white hover:bg-primary/90 text-xs flex items-center gap-1.5 transition-all group cursor-pointer"
            >
              <span>Get in Touch</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'cta' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === 'cta' && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Connect with Elanpro
                    </span>
                    <span className="text-[10px] font-bold text-primary">
                      Quick Links
                    </span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {CTA_DROPDOWN_OPTIONS.map((item, idx) => {
                      const Icon = item.icon;
                      if (item.isExternal) {
                        return (
                          <a
                            key={idx}
                            href={item.path}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActiveDropdown(null)}
                            className="p-2.5 rounded-xl flex items-start gap-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-1">
                                  {item.title}
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </h4>
                              </div>
                              <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          href={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="p-2.5 rounded-xl flex items-start gap-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                              {item.badge && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-gray-100 px-2 pb-1">
                    <Link
                      href="/admin/login"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between text-[11px] font-bold text-gray-400 hover:text-primary p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3" />
                        Admin Portal Access
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden p-2 transition-colors ${useWhiteText ? 'text-white' : 'text-primary'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col p-4 gap-2 lg:hidden max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-base w-full text-primary placeholder:text-gray-400"
            />
          </form>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block p-2.5 rounded-xl text-sm font-semibold ${
              location === '/' ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>

          {/* Mobile About Accordion */}
          <div className="border border-gray-100 rounded-xl p-1 bg-gray-50/60">
            <button
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-700"
            >
              <span>About Us</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAboutOpen && (
              <div className="space-y-1 pt-1 border-t border-gray-200/60 pl-2">
                {ABOUT_DROPDOWN.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-1.5 text-xs text-gray-600 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Categories Accordion */}
          <div className="border border-gray-100 rounded-xl p-1 bg-gray-50/60">
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-700"
            >
              <span>Our Products & Segments</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCatOpen && (
              <div className="space-y-1 pt-1 border-t border-gray-200/60 pl-2 max-h-48 overflow-y-auto">
                {CATEGORIES_DROPDOWN.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-1.5 text-xs text-gray-600 hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/catalogues"
            onClick={() => setMobileMenuOpen(false)}
            className={`block p-2.5 rounded-xl text-sm font-semibold ${
              location === '/catalogues' ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Catalogues
          </Link>

          <Link
            href="/industries"
            onClick={() => setMobileMenuOpen(false)}
            className={`block p-2.5 rounded-xl text-sm font-semibold ${
              location === '/industries' ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Industries
          </Link>

          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={`block p-2.5 rounded-xl text-sm font-semibold ${
              location === '/services' ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Services
          </Link>

          <Link
            href="/clients"
            onClick={() => setMobileMenuOpen(false)}
            className={`block p-2.5 rounded-xl text-sm font-semibold ${
              location === '/clients' ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Clients
          </Link>

          {/* Mobile CSR & Media Accordion */}
          <div className="border border-gray-100 rounded-xl p-1 bg-gray-50/60">
            <button
              onClick={() => setMobileCsrOpen(!mobileCsrOpen)}
              className="w-full flex items-center justify-between p-2 text-sm font-semibold text-gray-700"
            >
              <span>CSR, Media & Virtual Tours</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCsrOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCsrOpen && (
              <div className="space-y-1 pt-1 border-t border-gray-200/60 pl-2">
                {CSR_MEDIA_DROPDOWN.map((item, idx) => {
                  if (item.isExternal) {
                    return (
                      <a
                        key={idx}
                        href={item.path}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-1.5 text-xs text-gray-600 hover:text-primary"
                      >
                        <span>{item.name}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-1.5 text-xs text-gray-600 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile CTA Quick Actions Accordion */}
          <div className="border border-primary/20 rounded-2xl p-2 bg-primary/5 mt-1 space-y-1">
            <button
              onClick={() => setMobileCtaOpen(!mobileCtaOpen)}
              className="w-full flex items-center justify-between p-2 text-sm font-bold text-primary"
            >
              <span>Get in Touch & Quick Actions</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCtaOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileCtaOpen && (
              <div className="space-y-1 pt-1 border-t border-primary/10">
                {CTA_DROPDOWN_OPTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  if (item.isExternal) {
                    return (
                      <a
                        key={idx}
                        href={item.path}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white"
                      >
                        <Icon className="w-3.5 h-3.5 text-primary" />
                        <span>{item.title}</span>
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
