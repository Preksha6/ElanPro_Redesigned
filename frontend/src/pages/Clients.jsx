import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";
import { getLocalClients, getClientsFromDB } from "@/lib/clientService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 } 
  }
};

export default function Clients() {
  // Initialize immediately from local persistent store with zero lag
  const [clients, setClients] = useState(() => getLocalClients());
  const [loading, setLoading] = useState(false);

  function syncClients() {
    const list = getLocalClients();
    setClients(list);
  }

  useEffect(() => {
    // 1. Initial load
    syncClients();

    // 2. Query latest from DB in background
    getClientsFromDB().then(data => {
      if (data && data.length > 0) {
        setClients(data);
      }
    });

    // 3. Listen for live events dispatched by Admin Dashboard
    const handleUpdate = () => syncClients();
    window.addEventListener('elanpro-clients-updated', handleUpdate);
    window.addEventListener('clients-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('elanpro-clients-updated', handleUpdate);
      window.removeEventListener('clients-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

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

        {/* Dynamic Staggered Grid with live synced clients */}
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={clients.length}
          >
            {clients.map((brand, idx) => (
              <motion.div 
                key={brand.id || `brand-${idx}`} 
                variants={fadeUpVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 flex flex-col items-center justify-between min-h-[165px] hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
              >
                {/* Brand Logo Container */}
                <div className="w-full h-20 flex items-center justify-center px-2 py-1">
                  <img 
                    src={brand.url} 
                    alt={brand.name} 
                    className="max-w-[90%] max-h-16 object-contain group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x80?text=' + encodeURIComponent(brand.name);
                    }}
                  />
                </div>

                {/* Brand Name & Sector Label */}
                <div className="w-full pt-3 border-t border-gray-100/90 flex flex-col items-center text-center">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate max-w-full leading-tight">
                    {brand.name}
                  </h4>
                  {brand.industry && (
                    <span className="text-[10px] font-medium text-gray-500 mt-0.5 truncate max-w-full">
                      {brand.industry}
                    </span>
                  )}
                </div>
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
