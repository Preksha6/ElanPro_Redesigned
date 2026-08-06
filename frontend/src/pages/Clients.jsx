import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";

import { motion } from "framer-motion";

const BRAND_LOGOS = [
  { name: "Amul", url: "https://elanpro.net/wp-content/uploads/2025/06/amul.png" },
  { name: "Baskin Robbins", url: "https://elanpro.net/wp-content/uploads/2025/06/baskin_robbins.png" },
  { name: "Coca-Cola", url: "https://elanpro.net/wp-content/uploads/2025/06/coca_cola.png" },
  { name: "Pepsi", url: "https://elanpro.net/wp-content/uploads/2025/06/pepsie.png" },
  { name: "Domino's", url: "https://elanpro.net/wp-content/uploads/2025/06/dominos.png" },
  { name: "McDonald's", url: "https://elanpro.net/wp-content/uploads/2025/06/mcdonalds.png" },
  { name: "Pizza Hut", url: "https://elanpro.net/wp-content/uploads/2025/06/pizza_hut.png" },
  { name: "Taco Bell", url: "https://elanpro.net/wp-content/uploads/2025/06/taco_bell.png" },
  { name: "Costa Coffee", url: "https://elanpro.net/wp-content/uploads/2025/06/costa_coffee.png" },
  { name: "Haldiram's", url: "https://elanpro.net/wp-content/uploads/2025/06/haldiram.png" },
  { name: "Blinkit", url: "https://elanpro.net/wp-content/uploads/2025/06/blinkit.png" },
  { name: "Zepto", url: "https://elanpro.net/wp-content/uploads/2025/06/zepto.png" },
  { name: "Cadbury", url: "https://elanpro.net/wp-content/uploads/2025/06/cadbury.png" },
  { name: "Lipton", url: "https://elanpro.net/wp-content/uploads/2025/06/lipton.png" },
  { name: "Taj", url: "https://elanpro.net/wp-content/uploads/2025/06/taj.png" },
  { name: "Hyatt", url: "https://elanpro.net/wp-content/uploads/2025/06/hyatt.png" },
  { name: "Hilton", url: "https://elanpro.net/wp-content/uploads/2025/06/hillon.png" },
  { name: "Bacardi", url: "https://elanpro.net/wp-content/uploads/2025/06/bacardi.png" },
  { name: "Carlsberg", url: "https://elanpro.net/wp-content/uploads/2025/06/carlsberg.png" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 } 
  }
};

export default function Clients() {
  return (
    <Layout>
      <div className="pt-32 pb-20 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80')] opacity-20 mix-blend-overlay object-cover" />
        <FadeIn className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Our Clients</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/80">
            Trusted by the industry's leading brands across hospitality, healthcare, retail, and more.
          </p>
        </FadeIn>
      </div>

      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">Brands That Trust Us</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        {/* Staggered Grid Fade-In with Circular Pop */}
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {BRAND_LOGOS.map((brand, idx) => (
              <motion.div 
                key={`brand-${idx}`} 
                variants={fadeUpVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-32 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer"
              >
                <img 
                  src={brand.url} 
                  alt={brand.name} 
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
          <FadeIn>
            <h3 className="text-3xl font-display font-bold text-primary mb-6">Partner With Excellence</h3>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Join hundreds of enterprises that rely on ElanPro's cutting-edge refrigeration and cooling solutions to power their daily operations seamlessly. 
            </p>
            <a href="/contact" className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300">
              Get in Touch
            </a>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
