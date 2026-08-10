import React, { useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Download, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const CATALOGUES = [
  {
    id: 1,
    name: "Vending Machine",
    desc: "Smart vending solutions for automated retail and product dispensing.",
    size: "2.2 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg",
    gradient: "from-blue-700 to-slate-900"
  },
  {
    id: 2,
    name: "Cold Room",
    desc: "Comprehensive catalogue for modular cold room solutions and industrial storage.",
    size: "4.2 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg",
    gradient: "from-teal-600 to-slate-900"
  },
  {
    id: 3,
    name: "Pharma",
    desc: "Specialized cooling solutions for vaccines, blood banks, and critical medical supplies.",
    size: "2.1 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg",
    gradient: "from-primary to-blue-900"
  },
  {
    id: 4,
    name: "Special",
    desc: "Specialized and bespoke refrigeration solutions for unique industry requirements.",
    size: "3.5 MB",
    year: 2023,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Special-1.jpg",
    gradient: "from-indigo-600 to-slate-900"
  },
  {
    id: 5,
    name: "Bar",
    desc: "Premium back-bar coolers, wine dispensers, and professional bar refrigeration.",
    size: "5.1 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg",
    gradient: "from-sky-600 to-slate-900"
  },
  {
    id: 6,
    name: "Mini Bar",
    desc: "Compact, silent, and efficient mini-bars for hospitality and premium hotel rooms.",
    size: "1.8 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/MINI-BAR.jpg",
    gradient: "from-blue-700 to-slate-900"
  },
  {
    id: 7,
    name: "Ice Machine",
    desc: "High-capacity commercial ice makers for restaurants, bars, and healthcare.",
    size: "2.5 MB",
    year: 2023,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/ice.jpg",
    gradient: "from-teal-600 to-slate-900"
  },
  {
    id: 8,
    name: "Supermarket",
    desc: "Large-scale display freezers and multideck chillers for modern retail supermarkets.",
    size: "6.4 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg",
    gradient: "from-primary to-blue-900"
  },
  {
    id: 9,
    name: "Confectionery",
    desc: "Elegant pastry and bakery showcases with optimal humidity control.",
    size: "3.2 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg",
    gradient: "from-indigo-600 to-slate-900"
  },
  {
    id: 10,
    name: "Professional Kitchen",
    desc: "Heavy-duty stainless steel reach-in chillers and prep counters for commercial kitchens.",
    size: "4.8 MB",
    year: 2023,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg",
    gradient: "from-sky-600 to-slate-900"
  },
  {
    id: 11,
    name: "Retail",
    desc: "Versatile glass-top freezers and visi-coolers for retail convenience stores.",
    size: "2.9 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg",
    gradient: "from-blue-700 to-slate-900"
  },
  {
    id: 12,
    name: "Life Style",
    desc: "Premium consumer refrigeration products designed for modern lifestyles.",
    size: "3.7 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Life-Style-1.jpg",
    gradient: "from-teal-600 to-slate-900"
  },
  {
    id: 13,
    name: "Range",
    desc: "A wide assortment of versatile refrigeration ranges for varied storage applications.",
    size: "5.5 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Range.jpg",
    gradient: "from-primary to-blue-900"
  },
  {
    id: 14,
    name: "Vending Machine 2.0",
    desc: "Next-generation automated retail solutions with advanced touchscreen interfaces.",
    size: "2.8 MB",
    year: 2024,
    cover: "https://elanpro.net/wp-content/uploads/2025/06/Vending-Machine.jpg",
    gradient: "from-indigo-600 to-slate-900"
  }
];

const Catalogue3DBook = ({ cat }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  // Mouse tracking for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation (-15 to 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsHovered(!isHovered)}
      className="relative w-full h-[450px] lg:h-[500px] flex items-center justify-center [perspective:1500px] cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[280px] h-[380px] lg:w-[320px] lg:h-[420px] rounded-r-2xl rounded-l-md shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-shadow duration-500 hover:shadow-[0_25px_50px_rgba(0,100,255,0.2)] bg-white"
      >
        {/* Book Spine (3D depth) */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-b ${cat.gradient} origin-right border-l border-white/20 z-0`}
          style={{ transform: "translateX(-100%) rotateY(90deg)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center origin-center -rotate-90 text-white/50 text-xs tracking-[0.3em] font-bold whitespace-nowrap">
            ELANPRO CATALOGUE
          </div>
        </div>

        {/* Back Cover / Inside Content */}
        <div className="absolute inset-0 bg-white rounded-r-2xl rounded-l-md border border-slate-200 p-8 flex flex-col items-center text-center z-0">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-6 shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-blue-100">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{cat.name}</h4>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-4 w-full">
            PDF • {cat.size} • {cat.year}
          </div>
          <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
            {cat.desc}
          </p>
          <Button asChild className="w-full rounded-full bg-primary hover:bg-primary-dark transition-all group shadow-md hover:shadow-lg" onClick={(e) => e.stopPropagation()}>
            <Link href="/contact">
              Download PDF
              <Download className="w-4 h-4 ml-2 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Front Cover (Opens like a book) */}
        <motion.div 
          initial={false}
          animate={{ rotateY: isHovered ? -120 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformOrigin: "left", transformStyle: "preserve-3d" }}
          className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} rounded-r-2xl rounded-l-md z-20 border border-slate-200 shadow-[-5px_0_15px_rgba(0,0,0,0.1)]`}
        >
          {/* Back side of the front cover (seen when open) */}
          <div 
            className="absolute inset-0 bg-slate-50 rounded-l-2xl rounded-r-md border border-slate-200"
            style={{ transform: "rotateY(180deg) translateZ(1px)", backfaceVisibility: "hidden" }}
          >
            {/* Inner flap design */}
            <div className="absolute inset-y-4 right-4 w-px bg-slate-200 shadow-[1px_0_0_white]" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-24 h-24 border border-slate-200 rounded-full flex items-center justify-center opacity-30">
                  <div className="w-16 h-16 border border-slate-300 rounded-full" />
               </div>
            </div>
          </div>

          {/* Front side of the cover */}
          <div className="absolute inset-0 bg-slate-900 rounded-r-2xl rounded-l-md overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "translateZ(1px)" }}>
            <img src={cat.cover} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            
            {/* Better gradient overlay so text is highly readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/60" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="self-end bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold tracking-widest shadow-lg">
                {cat.year}
              </div>
              
              <div>
                <div className="text-white/90 text-xs font-bold tracking-[0.2em] mb-2 uppercase drop-shadow-md">Official Catalogue</div>
                <h3 className="text-3xl font-display font-black text-white leading-[1.15] drop-shadow-lg">
                  {cat.name}
                </h3>
              </div>
            </div>
            
            {/* Book crease/hinge effect on the left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default function Catalogues() {
  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen bg-slate-50 overflow-hidden relative">
        
        {/* Abstract 3D Background Elements */}
        <div className="absolute top-20 right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-semibold text-sm mb-6">
                <FileText className="w-4 h-4" />
                Product Literature
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight uppercase">
                Catalogues
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Explore our comprehensive range of commercial refrigeration solutions. Hover over a catalogue to open it.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {CATALOGUES.map((cat) => (
              <StaggerItem key={cat.id}>
                <Catalogue3DBook cat={cat} />
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </div>
    </Layout>
  );
}
