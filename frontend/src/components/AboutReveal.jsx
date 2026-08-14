import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutReveal() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end start"]
  });

  const cardY = useTransform(scrollYProgress, [0, 0.4], [150, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-slate-950 z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="relative z-20 container mx-auto px-6 md:px-12 pt-32 md:pt-48 pb-32 md:pb-48">
        
        {/* Massive Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl mb-24 md:mb-40"
        >
          <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-display font-medium text-white leading-[1.05] tracking-tight">
            Defining the global standard for precision commercial cooling.
          </h2>
        </motion.div>

        {/* The Reveal Card */}
        <motion.div 
          style={{ y: cardY }}
          className="w-full ml-auto md:w-11/12 lg:w-9/12 bg-[#0a0f1a] rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative z-10"
        >
          {/* Card Image (Product) Reveal */}
          <div className="md:w-5/12 h-72 md:h-auto relative overflow-hidden bg-slate-900 shrink-0">
             <motion.img 
               initial={{ scale: 1.3, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               viewport={{ once: false, margin: "-100px" }}
               transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
               src="/assets/display_talking.png" 
               alt="Let your Display Do The Talking!" 
               className="absolute inset-0 w-full h-full object-cover" 
             />
          </div>

          {/* Card Content Text Reveal */}
          <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
            <motion.h3 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-display font-medium text-white mb-6 tracking-tight"
            >
              Engineering the Invisible.
            </motion.h3>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-8"
            >
              Behind every seamless kitchen operation and perfectly preserved product is a cooling system that refuses to fail. We engineer the silent backbone of the world's most demanding environments—from high-volume hospitality to critical medical storage.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest font-semibold"
            >
              Performance • Efficiency • Durability
            </motion.p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
