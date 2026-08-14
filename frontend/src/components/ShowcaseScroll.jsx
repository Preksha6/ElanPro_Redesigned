import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  {
    num: "01",
    title: "PROFESSIONAL KITCHEN",
    desc: "Kitchens never stop, and neither does Elanpro! Commercial-grade cooling built for demanding kitchens.",
    img: "/hero-products/01-kitchen.png"
  },
  {
    num: "02",
    title: "RETAIL",
    desc: "High-visibility refrigerated product presentation. Reliable refrigeration is critical during peak summer conditions, especially for dairy, desserts, and beverages in high-demand food-service environments.",
    img: "/hero-products/02-retail.png"
  },
  {
    num: "03",
    title: "VENDING",
    desc: "Say hello to next-gen vending with Elanpro vending machines - the smarter way to serve snacks 24x7!",
    img: "/hero-products/03-vending.png"
  },
  {
    num: "04",
    title: "BEVERAGE",
    desc: "Whether it's a café counter or a hotel breakfast spread, it's made to keep juices, mocktails, and cold beverages consistently chilled, without becoming another item on the daily cleaning checklist.",
    img: "/hero-products/04-beverage.png"
  },
  {
    num: "05",
    title: "PHARMA",
    desc: "While doctors dedicate themselves to healing patients, we remain committed to protecting the medicines, vaccines, and critical healthcare products they rely on.",
    img: "/hero-products/05-pharma.png"
  }
];

export default function ShowcaseScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Sync scroll progress to active index state
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 5 items -> 0 to 4
    let index = Math.floor(latest * CATEGORIES.length);
    if (index >= CATEGORIES.length) index = CATEGORIES.length - 1;
    if (index < 0) index = 0;
    
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  return (
    // 500vh container creates the scrolling room
    <section ref={containerRef} className="relative w-full h-[500vh] bg-slate-950">
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-950 flex flex-col md:flex-row">
        
        {/* Left: Text Panel */}
        <div className="w-full md:w-5/12 h-[45vh] md:h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-20 bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="text-slate-500 text-sm md:text-base font-bold tracking-[0.2em]">
                {CATEGORIES[activeIndex].num} — {CATEGORIES[activeIndex].title}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium text-white leading-[1.05] tracking-tight">
                {CATEGORIES[activeIndex].title}
              </h2>
              <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-lg mt-4">
                {CATEGORIES[activeIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Massive Image Showcase Sliding Horizontally */}
        <div className="w-full md:w-7/12 h-[55vh] md:h-full relative overflow-hidden bg-black">
          <AnimatePresence initial={false}>
            <motion.img 
              key={activeIndex}
              src={CATEGORIES[activeIndex].img}
              alt={CATEGORIES[activeIndex].title}
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-30%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 w-full h-full object-cover shadow-2xl"
            />
          </AnimatePresence>

          {/* Seamless edge gradients to blend the image into the dark text panel */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent hidden md:block z-30 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 to-transparent block md:hidden z-30 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
