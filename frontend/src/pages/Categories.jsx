import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Search, Filter, Box, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Categories() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          supabase.from('categories').select('*').order('id', { ascending: true }),
          supabase.from('products').select('*')
        ]);
        if (catsRes.data) setCategories(catsRes.data);
        if (prodsRes.data) setProducts(prodsRes.data);
      } catch (err) {
        console.error(err);
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
        // Give the router a tiny tick to update the URL
        setTimeout(() => {
          const q = new URLSearchParams(window.location.search).get("search");
          if (q !== null) {
            setSearchTerm(q);
          }
        }, 0);
      }
    };

    // Initial load
    syncSearchFromUrl();

    // Listen to custom event from Header
    if (typeof window !== "undefined") {
      window.addEventListener('navbar-search', syncSearchFromUrl);
      window.addEventListener('popstate', syncSearchFromUrl);
      return () => {
        window.removeEventListener('navbar-search', syncSearchFromUrl);
        window.removeEventListener('popstate', syncSearchFromUrl);
      };
    }
  }, [location]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading categories...</div>;

  return (
    <Layout>
      <div className="pt-32 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Explore by Category</h1>
              <p className="text-lg text-gray-600">Search and filter our comprehensive range of commercial cooling solutions by category.</p>
            </div>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar / Categories Filter */}
            <FadeIn delay={0.1} className="w-full lg:w-1/4 lg:sticky lg:top-32 h-max self-start">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      activeCategory === "all" ? "bg-primary text-white shadow-md" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="font-medium">All Products</span>
                    <span className={`text-xs px-2 py-1 rounded-md ${activeCategory === "all" ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                      {products.length}
                    </span>
                  </button>
                  
                  {categories.map(category => {
                    const productCount = products.filter(p => p.category === category.name).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                          activeCategory === category.name ? "bg-primary text-white shadow-md" : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{category.icon}</span>
                          <span className="font-medium line-clamp-1">{category.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-md ${activeCategory === category.name ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                          {productCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {/* Main Content / Products Grid */}
            <div className="flex-1">
              
              {/* Search Bar */}
              <FadeIn delay={0.2}>
                <div className="mb-8 relative flex items-center bg-white rounded-full px-4 py-3 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search products by name or description..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-primary placeholder:text-gray-400 text-base"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </FadeIn>

              {/* Products Grid */}
              <StaggerContainer key={`${activeCategory}-${searchTerm}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <StaggerItem key={product.id}>
                    <div 
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="h-64 overflow-hidden relative bg-slate-50 flex items-center justify-center p-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded shadow-sm tracking-wide">
                          {product.category}
                        </div>
                        {product.badge && (
                          <div className="absolute top-4 right-4 bg-accent text-primary text-xs font-bold px-3 py-1 rounded shadow-sm tracking-wider uppercase">
                            {product.badge}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow border-t border-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-3">
                          {product.description}
                        </p>
                        
                        <button className="mt-auto w-full py-2.5 rounded border-2 border-primary text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300 uppercase text-sm tracking-wider flex items-center justify-center">
                          View Details
                        </button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
                  <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-600">No products found for "{searchTerm}" in this category.</p>
                  <Button variant="link" onClick={() => {setSearchTerm(''); setActiveCategory('all');}} className="mt-4 text-primary">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-1/2 p-8 bg-slate-50 flex items-center justify-center border-r border-gray-100">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply" />
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="mb-2 flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                  {selectedProduct.category}
                </span>
                {selectedProduct.badge && (
                  <span className="bg-accent/20 text-accent-dark px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{selectedProduct.description}</p>
              
              {selectedProduct.features && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <ChevronRight className="w-5 h-5 text-accent shrink-0 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-auto pt-6 flex gap-4">
                <Button className="flex-1 rounded-full h-12 shadow-md">Request Quote</Button>
                <Button variant="outline" className="flex-1 rounded-full h-12">Download Spec</Button>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </Layout>
  );
}
