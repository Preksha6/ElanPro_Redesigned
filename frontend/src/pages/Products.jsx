import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Ruler, Layers, ThermometerSnowflake, Sparkles, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { getProductsFromDB } from "@/lib/productService";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProductsFromDB();
        setProducts(data);
        const uniqueCategories = [...new Set(data.map(p => p.category))].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error loading products from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();

    const handleCatalogueUpdated = () => {
      loadProducts();
    };
    window.addEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
    return () => window.removeEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
  }, []);

  const filteredProducts = activeCategory === "All" ?
    products :
    products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <div className="pt-32 pb-12 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-6 bg-primary font-bold inline-block" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
                COMMERCIAL COOLING SOLUTIONS
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight uppercase">
              Our Products
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Explore our complete range of 170+ commercial refrigeration systems — engineered for heavy-duty reliability, precise temperature control, and optimal energy efficiency.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="py-12 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-500">Loading equipment catalogue...</p>
            </div>
          ) : (
            <>
              {/* Category Tabs */}
              <FadeIn delay={0.1} className="flex overflow-x-auto gap-2.5 pb-4 mb-8 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                  activeCategory === "All" ?
                  "bg-primary text-white shadow-md shadow-primary/20 scale-105" :
                  "bg-slate-50 text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"}`
                  }>
                  All Products ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                      activeCategory === cat ?
                      "bg-primary text-white shadow-md shadow-primary/20 scale-105" :
                      "bg-slate-50 text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"}`
                      }>
                      {cat} ({count})
                    </button>
                  );
                })}
              </FadeIn>

              {/* Products Grid */}
              <StaggerContainer key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const specs = product.specifications || {};
                  const dim = product.dimensions || specs["Dimensions (WxDxH mm)"] || specs["Dimension WxDxH (mm)"] || specs["Product Dimensions(mm)(wxdxh)"] || specs["Dimensions WxDxH (mm)"] || specs["Dimension (WxDxH) mm"] || "";
                  const cap = specs["Capacity (Liters)"] || specs["Capacity (L)"] || specs["Storage Capacity (Items)"] || specs["Ice Bin Capacity (Kg)"] || specs["Total Storage Volume(L )"] || specs["Capacity Ltrs."] || "";
                  const temp = specs["Temperature Range (°C)"] || specs["Temperature range (°C)"] || specs["Temperature Range"] || specs["Temperature (°C)"] || "";

                  return (
                    <StaggerItem key={product.id}>
                      <Link 
                        href={`/products/${product.id}`}
                        className="group flex flex-col h-full rounded-3xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                      >
                        {/* Image Area */}
                        <div className="relative h-60 overflow-hidden bg-[#f8fafc] shrink-0 p-6 flex items-center justify-center border-b border-slate-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out" 
                          />
                        
                          {product.badge && (
                            <div className="absolute top-4 left-4 bg-primary text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {product.badge}
                            </div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex flex-col flex-1 relative">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
                              {product.subcategory || product.category}
                            </span>
                            {product.model && (
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {product.model}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-display font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Dimensions / Capacity Pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
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

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary tracking-wider uppercase group-hover:text-primary-dark transition-colors">
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
                <div className="text-center py-20 bg-slate-50 rounded-3xl mt-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500">We couldn't find any products in this category.</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </Layout>
  );
}
