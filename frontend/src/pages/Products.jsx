import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Link } from "wouter";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[250px] md:min-h-[400px] bg-slate-50 relative shrink-0 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-6 md:p-12 drop-shadow-lg mix-blend-multiply"
            />
            {product.badge && (
              <div className="absolute top-6 left-6 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                {product.badge}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 overflow-y-auto">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mb-4 leading-tight">
              {product.name}
            </h2>
            
            <div className="w-12 h-1 bg-accent rounded-full mb-6" />
            
            <div className="prose prose-slate prose-sm sm:prose-base mb-8">
              {product.description && product.description.split(/\\n|\n/).map((para, i) => (
                para.trim() ? (
                  <p key={i} className="text-slate-600 leading-relaxed mb-2">
                    {para.trim()}
                  </p>
                ) : null
              ))}
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Key Features</h4>
              <ul className="space-y-3">
                {(Array.isArray(product.features) 
                  ? product.features.flatMap(f => typeof f === 'string' ? f.split(/\\n|\n/) : f) 
                  : typeof product.features === 'string' 
                    ? product.features.split(/\\n|\n/) 
                    : []
                ).map(f => typeof f === 'string' ? f.trim() : f).filter(Boolean).map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 mt-auto">
              <Button asChild className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary-dark transition-all py-6">
                <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
                  Request a Quote
                </Link>
              </Button>
              <Button onClick={onClose} variant="outline" className="w-full sm:w-auto rounded-full py-6 border-slate-200 hover:bg-slate-50 text-slate-600">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('name').order('id', { ascending: true })
        ]);
        
        if (productsRes.data) {
          setProducts(productsRes.data);
          // Dynamically get unique categories from actual products to ensure no missing tabs
          const uniqueCategories = [...new Set(productsRes.data.map(p => p.category))].filter(Boolean);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = activeCategory === "All" ?
  products :
  products.filter((p) => p.category === activeCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;

  return (
    <Layout>
      <div className="pt-32 pb-12 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-6 tracking-tight uppercase">Our Products</h1>
            <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
              Explore our comprehensive range of commercial refrigeration, food service equipment, and specialized cooling solutions designed for ultimate performance and reliability.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="py-12 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Tabs */}
          <FadeIn delay={0.1} className="flex overflow-x-auto gap-3 pb-4 mb-8 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`shrink-0 snap-start px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
              activeCategory === "All" ?
              "bg-primary text-white shadow-lg shadow-primary/20 scale-105" :
              "bg-slate-50 text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"}`
              }>
              
              All Products
            </button>
            {categories.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                activeCategory === cat ?
                "bg-primary text-white shadow-lg shadow-primary/20 scale-105" :
                "bg-slate-50 text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"}`
                }>
                
                  {cat}
                </button>
              )}
          </FadeIn>

          {/* Grid — key forces remount on filter change so framer-motion re-animates */}
          <StaggerContainer key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) =>
            <StaggerItem key={product.id}>
                <div className="group flex flex-col h-full rounded-3xl bg-white border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,50,150,0.1)] transition-all duration-300">
                  <div className="relative h-64 overflow-hidden bg-slate-50 shrink-0">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  
                    {product.badge &&
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm border border-white">
                        {product.badge}
                      </div>
                  }
                  </div>
                  <div className="p-6 flex flex-col flex-1 relative">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{product.subcategory || product.category}</div>
                    <h3 className="text-xl font-display font-black text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 leading-relaxed">
                      {product.description && product.description.split(/\\n|\n/).join(' ')}
                    </div>
                    
                    <ul className="mb-8 space-y-2">
                      {(Array.isArray(product.features) 
                        ? product.features.flatMap(f => typeof f === 'string' ? f.split(/\\n|\n/) : f) 
                        : typeof product.features === 'string' 
                          ? product.features.split(/\\n|\n/) 
                          : []
                      ).map(f => typeof f === 'string' ? f.trim() : f).filter(Boolean).slice(0, 2).map((feat, i) =>
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1" /> 
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      )}
                    </ul>

                    <Button 
                      onClick={() => setSelectedProduct(product)}
                      variant="outline" 
                      className="w-full rounded-full border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all py-5 font-semibold tracking-wide uppercase text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>

          {filteredProducts.length === 0 &&
          <div className="text-center py-20 bg-slate-50 rounded-3xl mt-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">We couldn't find any products in this category.</p>
            </div>
          }

        </div>
      </div>
      
      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </Layout>
  );
}