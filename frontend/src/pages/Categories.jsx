import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Search, Filter, Box, X, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Fallback high-quality images mapped by category name.
// These can easily be replaced by Elanpro's proprietary photography from the DB later.
const categoryImages = {
  "Commercial Refrigeration": "https://images.unsplash.com/photo-1588722421062-8f9f6e695d66?q=80&w=1200&auto=format&fit=crop",
  "Food Service & Beverage Equipment": "https://images.unsplash.com/photo-1556910103-1c02745a805f?q=80&w=1200&auto=format&fit=crop",
  "Specialized Solutions": "https://images.unsplash.com/photo-1579207436696-2be5d8dcaf99?q=80&w=1200&auto=format&fit=crop"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop";

// Helper component for animated product backgrounds
const CategoryBackgroundSlideshow = ({ categoryName, products, fallbackImage }) => {
  const categoryProducts = products.filter(p => p.category === categoryName);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (categoryProducts.length <= 1) return;
    
    // Cycle every 3-4 seconds, randomized slightly to avoid perfect synchronization across all cards
    const intervalTime = 3000 + Math.random() * 2000; 
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categoryProducts.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [categoryProducts.length]);

  if (categoryProducts.length === 0) {
    return (
      <img 
        src={fallbackImage} 
        alt={categoryName} 
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={categoryProducts[currentIndex].image}
          alt={categoryProducts[currentIndex].name}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply bg-slate-50"
        />
      </AnimatePresence>
    </div>
  );
};

// DeckScroller component for smooth auto-scrolling with manual override
const DeckScroller = ({ categories, renderCard }) => {
  const scrollRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouching, setIsTouching] = React.useState(false);
  const accumulateRef = React.useRef(0);

  React.useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    
    const scroll = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Only auto-scroll if user is not interacting
      if (scrollRef.current && !isHovered && !isTouching) {
        // Accumulate fractional pixels to avoid rounding issues
        accumulateRef.current += (deltaTime * 0.05); // roughly 50px per second
        
        if (accumulateRef.current >= 1) {
          const pixelsToScroll = Math.floor(accumulateRef.current);
          scrollRef.current.scrollLeft += pixelsToScroll;
          accumulateRef.current -= pixelsToScroll;
          
          // Check for seamless loop
          const halfWidth = scrollRef.current.scrollWidth / 2;
          if (scrollRef.current.scrollLeft >= halfWidth) {
            scrollRef.current.scrollLeft -= halfWidth;
          } else if (scrollRef.current.scrollLeft <= 0) {
            scrollRef.current.scrollLeft += halfWidth;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isTouching]);

  return (
    <div 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
      className={`flex w-full overflow-x-auto pb-8 custom-scrollbar ${isHovered || isTouching ? 'snap-x snap-proximity' : ''}`}
    >
      <div className="flex gap-6 w-max px-4 md:px-8">
        {categories.map((cat, idx) => (
          <div key={`orig-${cat.id}-${idx}`} className="snap-center shrink-0">
            {renderCard(cat, false)}
          </div>
        ))}
        {/* Duplicate for seamless infinite scrolling */}
        {categories.map((cat, idx) => (
          <div key={`dup-${cat.id}-${idx}`} className="snap-center shrink-0">
            {renderCard(cat, true)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Categories() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("deck"); // 'deck' | 'products'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deck interaction state
  const [isDeckHovered, setIsDeckHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodsData, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        if (prodsData) {
          setProducts(prodsData);
          
          // Dynamically extract and normalize unique categories from products
          const categoryMap = new Map();
          
          prodsData.forEach(p => {
            if (!p.category) return;
            // Normalize: trim whitespace and make consistent
            const rawCat = p.category;
            const normCat = rawCat.trim().replace(/\s+/g, ' '); // remove double spaces
            
            if (normCat === "") return;
            
            // Map the normalized category name to an array of its products
            // We use the uppercase version as the key for case-insensitive deduplication,
            // but preserve the original casing for display.
            const key = normCat.toUpperCase();
            if (!categoryMap.has(key)) {
              categoryMap.set(key, { displayTitle: normCat, products: [] });
            }
            // Update the product's category to the normalized one so filtering works
            p.category = categoryMap.get(key).displayTitle; 
            categoryMap.get(key).products.push(p);
          });
          
          let idx = 0;
          const dynamicCategories = [];
          for (const [key, value] of categoryMap.entries()) {
            const firstProductWithImage = value.products.find(p => p.image);
            dynamicCategories.push({
              id: ++idx,
              name: value.displayTitle,
              image: categoryImages[value.displayTitle] || (firstProductWithImage ? firstProductWithImage.image : DEFAULT_IMAGE),
              count: value.products.length
            });
          }
          
          // Sort categories alphabetically
          dynamicCategories.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(dynamicCategories);
          // Update products state with normalized categories
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

  // Sync search term from navbar
  useEffect(() => {
    const syncSearchFromUrl = () => {
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const q = new URLSearchParams(window.location.search).get("search");
          if (q !== null && q.trim() !== "") {
            setSearchTerm(q);
            setViewMode("products"); // Auto-switch when searching from navbar
          }
        }, 0);
      }
    };
    syncSearchFromUrl();

    if (typeof window !== "undefined") {
      window.addEventListener('navbar-search', syncSearchFromUrl);
      window.addEventListener('popstate', syncSearchFromUrl);
      return () => {
        window.removeEventListener('navbar-search', syncSearchFromUrl);
        window.removeEventListener('popstate', syncSearchFromUrl);
      };
    }
  }, [location]);

  // Handle manual typing in search bar
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim() !== "") {
      setViewMode("products");
    }
  };

  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
    setViewMode("products");
    setSearchTerm("");
  };

  const resetToDeck = () => {
    setActiveCategory("all");
    setSearchTerm("");
    setViewMode("deck");
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Deck logic: Show all available categories in the deck
  const deckCategories = categories;

  const renderCategoryCard = (category, isClone = false) => (
    <motion.div
      key={`deck-card-${category.id}${isClone ? '-clone' : ''}`}
      layoutId={isClone ? undefined : `category-hero-${category.id}`}
      onClick={() => handleCategoryClick(category.name)}
      whileHover={{
        scale: 1.03,
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="relative shrink-0 w-[260px] h-[360px] md:w-[320px] md:h-[440px] rounded-3xl overflow-hidden cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-slate-200 group bg-slate-50"
    >
      {/* Animated Product Slideshow */}
      <CategoryBackgroundSlideshow 
        categoryName={category.name} 
        products={products} 
        fallbackImage={categoryImages[category.name] || category.image || DEFAULT_IMAGE}
      />
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent transition-opacity duration-300 group-hover:via-slate-900/70" />
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight drop-shadow-md">
          {category.name}
        </h3>
        <div className="flex items-center text-xs md:text-sm font-medium text-white/80 uppercase tracking-widest group-hover:text-white transition-colors">
          {category.count} Product{category.count !== 1 ? 's' : ''}
          <motion.span 
            className="ml-2 inline-block"
            animate={{ x: 0 }}
            whileHover={{ x: 6 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-slate-50/50 overflow-hidden">
        
        {/* HEADER & SEARCH (Constrained Width) */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 tracking-tight uppercase">
                Product Categories
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Explore our complete range of commercial refrigeration and food-service solutions.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col md:flex-row gap-4 mb-16 max-w-4xl mx-auto relative z-30">
              <div className="flex-1 relative flex items-center bg-white rounded-2xl px-6 py-4 border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-4" />
                <input 
                  type="text" 
                  placeholder="Search products or categories..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400 text-lg"
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); if (activeCategory==='all') setViewMode('deck'); }} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                )}
              </div>
              
              <div className="flex shrink-0">
                <div className="relative w-full md:w-auto">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="h-full w-full md:w-auto bg-white border border-slate-200 rounded-2xl px-8 py-4 flex items-center justify-between gap-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Filter className="w-5 h-5 text-slate-400" />
                    <span>{activeCategory === 'all' ? 'All Categories' : activeCategory}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute top-full mt-2 right-0 left-0 md:left-auto w-full md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-200 z-50 overflow-hidden ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <button 
                        onClick={() => { setActiveCategory("all"); setIsDropdownOpen(false); if(searchTerm) setViewMode("products"); else setViewMode("deck"); }}
                        className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors ${activeCategory === "all" ? "text-primary font-bold bg-primary/5" : "text-slate-700"}`}
                      >
                        All Categories
                      </button>
                      {categories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => { handleCategoryClick(cat.name); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-6 py-3 hover:bg-slate-50 transition-colors border-t border-slate-50 ${activeCategory === cat.name ? "text-primary font-bold bg-primary/5" : "text-slate-700"}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            
            {/* === VIEW MODE: DECK (Auto-Scrolling + Manual Scroll) === */}
            {viewMode === "deck" && (
              <motion.div
                key="deck-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full py-4 lg:py-8"
              >
                {deckCategories.length > 0 && (
                  <DeckScroller categories={deckCategories} renderCard={renderCategoryCard} />
                )}
              </motion.div>
            )}

            {/* === VIEW MODE: PRODUCTS (Constrained Width) === */}
            {viewMode === "products" && (
              <motion.div
                key="products-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full container mx-auto px-4 md:px-8 max-w-7xl"
              >
                  {/* Category Header Transition */}
                  {activeCategory !== "all" && (
                    <div className="mb-12 flex flex-col lg:flex-row gap-8 items-center lg:items-end border-b border-slate-200 pb-8">
                      {/* The animating hero card */}
                      <motion.div 
                        layoutId={`category-hero-${categories.find(c => c.name === activeCategory)?.id || 'unknown'}`}
                        className="relative w-full lg:w-[400px] h-[250px] rounded-3xl overflow-hidden shadow-xl shrink-0"
                      >
                        {categories.find(c => c.name === activeCategory) && (
                          <>
                            <CategoryBackgroundSlideshow 
                              categoryName={activeCategory} 
                              products={products} 
                              fallbackImage={categoryImages[activeCategory] || categories.find(c => c.name === activeCategory)?.image || DEFAULT_IMAGE}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                              <h2 className="text-3xl font-display font-bold text-white leading-tight">
                                {activeCategory}
                              </h2>
                            </div>
                          </>
                        )}
                      </motion.div>
                      
                      <div className="flex-1 flex flex-col items-start lg:items-end w-full">
                        <button 
                          onClick={resetToDeck}
                          className="mb-6 flex items-center text-slate-500 hover:text-primary transition-colors font-semibold uppercase tracking-wider text-sm"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          All Categories
                        </button>
                        <p className="text-slate-600 text-lg lg:text-right max-w-xl">
                          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in this category. Use the search bar above to narrow down your selection.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show "All Categories" button even if searching from "All" */}
                  {activeCategory === "all" && searchTerm && (
                    <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-slate-900">Search Results</h2>
                      <button 
                        onClick={resetToDeck}
                        className="flex items-center text-slate-500 hover:text-primary transition-colors font-semibold uppercase tracking-wider text-sm"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Deck
                      </button>
                    </div>
                  )}

                  {/* Products Grid */}
                  <StaggerContainer key={`${activeCategory}-${searchTerm}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <StaggerItem key={product.id}>
                        <div 
                          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="h-64 overflow-hidden relative bg-slate-50/80 flex items-center justify-center p-6">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-2 pointer-events-none">
                              <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded shadow-sm tracking-wide truncate max-w-[65%]">
                                {product.category}
                              </div>
                              {product.badge && (
                                <div className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded shadow-sm tracking-wider uppercase shrink-0">
                                  {product.badge}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-6 flex flex-col flex-grow border-t border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed line-clamp-3">
                              {product.description}
                            </p>
                            
                            <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-wider uppercase group-hover:gap-2 transition-all">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {filteredProducts.length === 0 && (
                    <FadeIn>
                      <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm mt-6">
                        <Box className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
                        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                          We couldn't find any products matching "{searchTerm}" in this category.
                        </p>
                        <Button onClick={resetToDeck} className="h-12 px-8 rounded-full">
                          Back to Categories
                        </Button>
                      </div>
                    </FadeIn>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>

      {/* Product Details Modal (Unchanged structurally, just styling tweaks for consistency) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-1/2 p-8 lg:p-12 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply drop-shadow-xl" />
              </div>

              <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
                <div className="mb-4 flex items-center gap-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.badge && (
                    <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>
                
                {selectedProduct.features && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {selectedProduct.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-slate-600">
                          <ChevronRight className="w-5 h-5 text-accent shrink-0 mr-3 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-auto pt-8 flex gap-4 border-t border-slate-100">
                  <Button 
                    onClick={() => setLocation(`/contact?product=${encodeURIComponent(selectedProduct.name)}`)}
                    className="flex-1 rounded-full h-14 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                    Request Quote
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Downloading Specifications",
                        description: `The technical specifications for ${selectedProduct.name} are being prepared...`,
                      });
                      // Normally this would trigger a window.open(pdfUrl) or similar
                    }}
                    variant="outline" className="flex-1 rounded-full h-14 text-base font-bold border-2 hover:bg-slate-50">
                    Download Spec
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
