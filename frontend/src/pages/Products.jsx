import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" ?
  MOCK_PRODUCTS :
  MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <div className="pt-32 pb-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Our Products</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Explore our comprehensive range of commercial refrigeration, food service equipment, and specialized cooling solutions designed for ultimate performance and reliability.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Tabs */}
          <FadeIn delay={0.1} className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === "All" ?
              "bg-primary text-white shadow-md" :
              "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"}`
              }>
              
              All Products
            </button>
            {CATEGORIES.map((cat) =>
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat ?
              "bg-primary text-white shadow-md" :
              "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"}`
              }>
              
                {cat}
              </button>
            )}
          </FadeIn>

          {/* Grid — key forces remount on filter change so framer-motion re-animates */}
          <StaggerContainer key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) =>
            <StaggerItem key={product.id}>
                <div className="group flex flex-col h-full rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 shimmer">
                  <div className="relative h-56 overflow-hidden bg-gray-50 shrink-0">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  
                    {product.badge &&
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </div>
                  }
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{product.subcategory}</div>
                    <h3 className="text-lg font-display font-bold text-gray-900 mb-2 leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{product.description}</p>
                    
                    <ul className="mb-6 space-y-1">
                      {product.features.slice(0, 2).map((feat, i) =>
                    <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-accent" /> {feat}
                        </li>
                    )}
                    </ul>

                    <Button variant="outline" className="w-full rounded-full border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                      View Details
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>

          {filteredProducts.length === 0 &&
          <div className="text-center py-16 text-gray-500">
              No products found in this category.
            </div>
          }

        </div>
      </div>
    </Layout>);

}