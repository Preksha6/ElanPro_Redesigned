import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  {
    num: "01",
    title: "PROFESSIONAL KITCHEN",
    tagline: "Commercial-Grade Culinary Cooling",
    desc: "Kitchens never stop, and neither does Elanpro! Heavy-duty under-counter chillers, reach-in upright freezers, and prep tables engineered for demanding 43°C tropical ambient kitchens.",
    specs: ["Tropicalized Climate Class T", "100% Copper Evaporator Tubes", "HACCP Food Safety Compliant"],
    img: "/hero-products/01-kitchen.png",
    accentColor: "rgba(2, 132, 199, 0.15)",
    pillColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    link: "/categories"
  },
  {
    num: "02",
    title: "RETAIL & SUPERMARKET",
    tagline: "High-Visibility Refrigerated Merchandising",
    desc: "Reliable refrigeration is critical during peak summer conditions, especially for dairy, desserts, and beverages. Anti-fog Low-E double glazing and vertical LED light pillars ensure every SKU stands out.",
    specs: ["Anti-Fog Low-E Glass", "Vertical LED Product Lighting", "Argon-Filled Multi-Glazing"],
    img: "/hero-products/02-retail.png",
    accentColor: "rgba(16, 185, 129, 0.15)",
    pillColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    link: "/categories"
  },
  {
    num: "03",
    title: "INTELLIGENT VENDING",
    tagline: "Smart 24/7 Automated Touchless Dispensing",
    desc: "Say hello to next-gen vending with Elanpro vending machines - the smarter way to serve cold beverages, dairy, snacks, and chilled fresh foods 24x7 with cloud telemetry.",
    specs: ["Real-Time Cloud Telemetry", "Cashless UPI / QR Integration", "Dual-Zone Precision Climate"],
    img: "/hero-products/03-vending.png",
    accentColor: "rgba(168, 85, 247, 0.15)",
    pillColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    link: "/categories"
  },
  {
    num: "04",
    title: "BEVERAGE & BAR SOLUTIONS",
    tagline: "Ultra-Fast Pull-Down & Draft Perfection",
    desc: "Whether it's a café counter, craft brewery, or hotel breakfast buffet, Elanpro beverage dispensers keep juices, draft beers, and mocktails consistently ice-chilled without daily cleaning headaches.",
    specs: ["Rapid Pull-Down Cooling", "Food-Grade 304 Stainless Steel", "Zero-Foam Flow Control"],
    img: "/hero-products/04-beverage.png",
    accentColor: "rgba(245, 158, 11, 0.15)",
    pillColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    link: "/categories"
  },
  {
    num: "05",
    title: "PHARMA & LIFE SCIENCES",
    tagline: "Ultra-Low Temperature Biomedical Stability",
    desc: "While doctors dedicate themselves to healing patients, we remain committed to protecting the life-saving vaccines, biological reagents, and insulin products they rely on under strict ±1°C accuracy.",
    specs: ["Microprocessor ±1°C PID Control", "Automatic Battery Alarm Backup", "WHO-PQS & ISO Certified"],
    img: "/hero-products/05-pharma.png",
    accentColor: "rgba(6, 182, 212, 0.15)",
    pillColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    link: "/categories"
  }
];

export default function ShowcaseScroll() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Preload all images into browser memory immediately
  useEffect(() => {
    CATEGORIES.forEach(cat => {
      const img = new Image();
      img.src = cat.img;
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // High-performance direct scroll progress listener
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(
      CATEGORIES.length - 1,
      Math.max(0, Math.floor(latest * CATEGORIES.length))
    );
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  });

  const current = CATEGORIES[activeIndex];

  return (
    <section ref={containerRef} className="relative w-full h-[360vh] bg-slate-950 text-white">
      
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-950 flex flex-col justify-between py-6 md:py-8 px-4 md:px-12 lg:px-20 z-10">
        
        {/* Dynamic Background Glow using smooth CSS transition */}
        <div 
          className="absolute inset-0 transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${current.accentColor} 0%, rgba(2,6,23,0) 70%)`
          }}
        />

        {/* Top Header Bar */}
        <div className="relative z-30 flex items-center justify-between border-b border-white/10 pb-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs md:text-sm font-mono font-bold tracking-widest text-slate-300 uppercase">
              Commercial Equipment Showcase • {current.num} / 05
            </span>
          </div>

          {/* Quick Step Indicators */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat.num}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  idx === activeIndex 
                    ? 'w-8 md:w-10 bg-accent shadow-sm shadow-accent/50' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={cat.title}
              />
            ))}
          </div>
        </div>

        {/* Main Stage: Hardware-Accelerated Stacked Slides (Zero lag, zero AnimatePresence wait locks) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full flex-1 flex items-center justify-center my-auto overflow-hidden min-h-[380px]">
          
          {CATEGORIES.map((cat, idx) => {
            const isCurrent = idx === activeIndex;
            const isPast = idx < activeIndex;
            const isEven = idx % 2 === 0;

            // Alternating entry motion offset:
            // Even (0: Kitchen, 2: Vending, 4: Pharma) enters from LEFT (-120px)
            // Odd (1: Retail, 3: Beverage) enters from RIGHT (+120px)
            const enterOffset = isEven ? -140 : 140;

            // Hardware translate calculations (runs on GPU compositor thread)
            let slideTransform = 'translate3d(0, 0, 0)';
            if (!isCurrent) {
              slideTransform = isPast 
                ? `translate3d(${-enterOffset}px, 0, 0)` 
                : `translate3d(${enterOffset}px, 0, 0)`;
            }

            return (
              <div
                key={cat.num}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCurrent 
                    ? 'opacity-100 pointer-events-auto z-20' 
                    : 'opacity-0 pointer-events-none z-10'
                }`}
                style={{
                  transform: slideTransform,
                  willChange: 'transform, opacity'
                }}
              >
                <div className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
                }`}>
                  
                  {/* Text Column (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                    
                    {/* Category Pill */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cat.pillColor}`}>
                        {cat.num} • {cat.tagline}
                      </span>
                    </div>

                    {/* Big Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[1.08] tracking-tight">
                      {cat.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light">
                      {cat.desc}
                    </p>

                    {/* Quick Specs */}
                    <div className="space-y-2 pt-1">
                      {cat.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-3 flex items-center gap-3">
                      <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-xs px-6 py-4 shadow-lg shadow-accent/30 transition-all group cursor-pointer">
                        <Link href={cat.link}>
                          <span>Explore Equipment</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="rounded-full text-slate-400 hover:text-white text-xs font-semibold">
                        <Link href="/catalogues">
                          <span>Download Specs</span>
                        </Link>
                      </Button>
                    </div>

                  </div>

                  {/* Product Image Column (7 Cols) */}
                  <div className="lg:col-span-7 relative flex items-center justify-center">
                    <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-6 flex items-center justify-center group">
                      
                      {/* Product Image with Pure GPU Acceleration */}
                      <img
                        src={cat.img}
                        alt={cat.title}
                        className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        style={{ transform: 'translateZ(0)' }}
                        loading="eager"
                      />

                      {/* Subtle Watermark */}
                      <div className="absolute bottom-4 right-5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-bold pointer-events-none">
                        ELANPRO® COOLING TECH
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom Status Bar */}
        <div className="relative z-30 flex items-center justify-between text-xs text-slate-500 border-t border-white/10 pt-3 max-w-7xl mx-auto w-full">
          <span className="text-slate-400 font-medium">
            Active: <strong className="text-white">{current.title}</strong>
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Scroll progress:</span>
            <span className="font-mono text-accent font-bold">
              {Math.round(((activeIndex + 1) / CATEGORIES.length) * 100)}%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
