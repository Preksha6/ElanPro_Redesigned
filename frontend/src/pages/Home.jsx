import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, ShieldCheck, Shield, Zap, ThermometerSnowflake, Clock, Leaf, Truck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import InteractiveFeatureDeck from "@/components/InteractiveFeatureDeck";
import CitiesNetwork from "@/components/CitiesNetwork";

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
import { supabase } from "@/lib/supabase";
// Simple counter hook
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return { count, nodeRef };
}

function StatCard({ stat, index }) {
  const { count, nodeRef } = useCounter(stat.numeric);

  return (
    <StaggerItem>
      <div className="flex flex-col items-center justify-center p-4 text-center group">
        <span ref={nodeRef} className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-2 tracking-tight group-hover:scale-110 transition-transform duration-500">
          {count.toLocaleString()}<span className="text-primary">{stat.suffix}</span>
        </span>
        <span className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
      </div>
    </StaggerItem>
  );
}

const HERO_BACKGROUNDS = [
  '/premium_hero_bg.jpg',
  '/premium_hero_bg_2.jpg',
  '/premium_hero_bg_3.jpg'
];

export default function Home() {
  const [activeSector, setActiveSector] = useState(null);
  const [hoveredSector, setHoveredSector] = useState(null);
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 6000); // 6 second crossfade
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, productsRes, industriesRes] = await Promise.all([
          supabase.from('stats').select('*').order('id', { ascending: true }),
          supabase.from('products').select('*').limit(4),
          supabase.from('industries').select('*')
        ]);
        
        if (statsRes.data) setStats(statsRes.data);
        if (productsRes.data) setTopProducts(productsRes.data);
        if (industriesRes.data) setIndustries(industriesRes.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;

  return (
    <Layout>
      {/* Editorial Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 pb-20 lg:pb-32 overflow-hidden bg-white text-slate-900">
        
        {/* Atmospheric Background Images with Crossfade */}
        {HERO_BACKGROUNDS.map((bg, index) => (
          <motion.div 
            key={bg}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentBg ? 0.5 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('${bg}')` }}
          />
        ))}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/30 via-transparent to-white pointer-events-none" />
        
        {/* Background Wordmark (Hidden on mobile to reduce clutter) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0 hidden md:flex items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          <span className="text-[10vw] font-black text-[#F7FAFF] leading-none tracking-tighter whitespace-nowrap">ELANPRO</span>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-center">
            
            {/* Left Column: Typography */}
            <div className="col-span-1 md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left pt-6 md:pt-0 z-20">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#1554A0]/20 text-[#08132B] font-bold text-[9px] md:text-xs uppercase tracking-widest shadow-sm mb-4 md:mb-8"
              >
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3BA7FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-[#1554A0]"></span>
                </span>
                India's Commercial Cooling Leader
              </motion.div>
              
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-black leading-[1.1] tracking-tight mb-4 md:mb-8">
                <motion.span 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[#08132B]"
                >
                  Precision <span className="text-[#1554A0]">Cooling.</span>
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[#08132B] mt-1 md:mt-2"
                >
                  Engineered for <br className="hidden md:block" /> Global Standards.
                </motion.span>
              </h1>
              
              {/* Copy */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.60, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[500px]"
              >
                <p className="text-lg md:text-xl text-[#08132B] font-semibold mb-3 md:mb-4 leading-snug">
                  Engineered where temperature can't be left to chance.
                </p>
                <p className="text-sm md:text-base text-slate-600 mb-8 md:mb-10 leading-relaxed px-4 md:px-0">
                  From luxury hospitality to critical medical storage, Elanpro delivers precision refrigeration built for demanding environments.
                </p>
              </motion.div>
              
              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto"
              >
                <Button asChild size="lg" className="group h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold bg-[#1554A0] text-white rounded-full hover:bg-[#08132B] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_20px_rgba(21,84,160,0.2)] hover:shadow-[0_15px_30px_rgba(21,84,160,0.4)]">
                  <Link href="/products">
                    Explore the Collection <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold border-2 border-[#1554A0] text-[#08132B] bg-white rounded-full hover:bg-[#F2F7FF] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Link href="/contact">
                    Request a Quote
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Product Presentation */}
            <div className="hidden md:flex col-span-1 md:col-span-6 relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[750px] items-center justify-center lg:justify-end z-10 mt-8 md:mt-0">
              
              {/* Soft glow behind product */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[350px] md:w-[300px] md:h-[400px] lg:w-[450px] lg:h-[700px] bg-[#087CF5]/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"
              />

              {/* Main Product */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.90, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full max-w-[220px] sm:max-w-[280px] md:max-w-md lg:max-w-[550px] z-20 flex items-center justify-center lg:-mr-12"
              >
                {/* Infinite Float Animation Wrapper */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full flex items-center justify-center relative"
                >
                  <img 
                    src="https://elanpro.net/wp-content/uploads/2025/07/EWG-130-D-7-Photoroom-1.png" 
                    alt="Elanpro Commercial Refrigerator" 
                    className="w-full h-full object-contain filter drop-shadow-[0_30px_50px_rgba(8,19,43,0.15)]"
                  />
                  
                  {/* Technical Annotation 1 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[20%] -left-4 md:-left-20 hidden sm:flex items-center gap-3 pointer-events-none"
                  >
                    <div className="text-[10px] md:text-xs font-bold text-[#1554A0] tracking-[0.2em] whitespace-nowrap">
                      PRECISION COOLING
                    </div>
                    <div className="w-12 md:w-24 h-[1px] bg-[#1554A0]/30" />
                  </motion.div>

                  {/* Technical Annotation 2 (Temperature) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[35%] -right-2 md:-right-8 lg:-right-16 hidden sm:flex items-center gap-2 pointer-events-none"
                  >
                    <div className="w-8 md:w-16 h-[1px] bg-[#1554A0]/40" />
                    <div className="flex flex-col items-start gap-1 bg-white/60 backdrop-blur-md px-2 md:px-3 py-1.5 rounded-md border border-white/50 shadow-sm">
                      <div className="flex items-center gap-2 text-[9px] md:text-xs font-bold text-[#08132B] tracking-wider whitespace-nowrap">
                        −2°C <div className="w-8 md:w-16 h-[1px] bg-[#1554A0]/20 relative"><div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#087CF5]" /></div> +8°C
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Information Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-10 -right-4 md:-right-16 bg-white/95 backdrop-blur-xl border border-[#1554A0]/10 rounded-2xl p-5 shadow-[0_20px_40px_rgba(8,19,43,0.08)] max-w-[220px]"
                  >
                    <div className="text-[#1554A0] text-[10px] font-black tracking-[0.15em] mb-2">PRECISION ENGINEERING</div>
                    <div className="text-[#08132B] text-xs font-semibold leading-relaxed">Built for demanding commercial environments</div>
                  </motion.div>
                  
                </motion.div>
              </motion.div>

            </div>
          </div>

          {/* Bottom Proof Points */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center gap-16 mt-12 mb-8"
          >
            {[
              { num: "01", text: "PRECISION" },
              { num: "02", text: "RELIABILITY" },
              { num: "03", text: "GLOBAL STANDARDS" }
            ].map((point, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xl font-black text-[#1554A0]/30">{point.num}</span>
                <span className="text-xs font-bold text-[#08132B] tracking-[0.2em]">{point.text}</span>
              </div>
            ))}
          </motion.div>
          
        </div>

        {/* Scroll Cue */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[9px] font-black text-[#1554A0] tracking-[0.3em]">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#1554A0]/0 via-[#1554A0]/30 to-[#1554A0]/0 relative overflow-hidden">
             <motion.div 
                animate={{ y: [-20, 48] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-1/2 bg-[#1554A0]"
             />
          </div>
        </motion.div>
        
      </section>

      {/* Glassmorphism Stats Section */}
      <section className="relative z-20 -mt-16 pb-8">
        <div className="w-full">
          <div className="bg-white/70 backdrop-blur-xl border-y border-white shadow-2xl shadow-gray-200/50 py-6 md:py-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <StaggerContainer className="grid grid-cols-3 gap-2 md:gap-8 container mx-auto">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 mb-8">
          <FadeIn>
            <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
              Trusted by industry leaders worldwide
            </p>
          </FadeIn>
        </div>
        
        {/* Infinite Scrolling Marquee */}
        <div className="w-full flex overflow-hidden relative group py-4 bg-gray-50/50">
          {/* Left/Right Fade Gradients */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max shrink-0 animate-marquee items-center transition-all duration-700">
            {BRAND_LOGOS.map((logo, i) => (
              <img key={i} src={logo.url} alt={logo.name} className="h-16 md:h-24 lg:h-28 object-contain mx-12 md:mx-20 drop-shadow-sm hover:scale-110 transition-transform duration-300" />
            ))}
          </div>
          <div className="flex w-max shrink-0 animate-marquee items-center transition-all duration-700" aria-hidden="true">
            {BRAND_LOGOS.map((logo, i) => (
              <img key={`dup-${i}`} src={logo.url} alt={logo.name} className="h-16 md:h-24 lg:h-28 object-contain mx-12 md:mx-20 drop-shadow-sm hover:scale-110 transition-transform duration-300" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row flex-wrap md:items-end justify-between mb-12 gap-4 md:gap-8">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Featured Excellence</h2>
              <p className="text-gray-600 text-base md:text-lg max-w-xl">Discover our top-tier refrigeration solutions trusted by industry leaders.</p>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <Button asChild variant="ghost" className="mt-4 md:mt-0 font-semibold group">
                <Link href="/products">
                  View All Catalog <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topProducts.map((product) =>
            <StaggerItem key={product.id}>
                <div className="group rounded-3xl bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 shimmer">
                  <div className="relative h-64 overflow-hidden bg-gray-50">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  
                    {product.badge &&
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm">
                        {product.badge}
                      </div>
                  }
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{product.category}</div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-6">{product.description}</p>
                    <Button asChild variant="outline" className="w-full rounded-full border-gray-200 hover:border-primary hover:text-primary transition-colors">
                      <Link href={`/products`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* Industry Solutions (Sectors) */}
      <section className="pt-16 pb-12 relative overflow-hidden bg-slate-950 text-white">
        
        {/* Background glow lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-light text-sm font-semibold mb-4 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Industry Solutions
              </div>
              <h2 className="text-3xl font-display font-bold leading-tight">
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent">Every Sector.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2} className="max-w-md">
              <p className="text-gray-400 text-lg leading-relaxed">
                Tailored commercial refrigeration engineered to meet the stringent demands of India's fastest-growing industries.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="flex flex-col lg:flex-row h-[650px] sm:h-[750px] lg:h-[400px] gap-4 w-full">
              {industries.map((ind, i) => {
                const isExpanded = activeSector === i || hoveredSector === i;
                return (
                  <div 
                    key={ind.id} 
                    onClick={() => {
                      if (activeSector === i || hoveredSector === i) {
                        setActiveSector(null);
                        setHoveredSector(null);
                      } else {
                        setActiveSector(i);
                      }
                    }}
                    onMouseEnter={() => setHoveredSector(i)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl border border-white/5 bg-gray-900 transition-all duration-[600ms] ease-out will-change-[flex]
                      ${isExpanded ? 'flex-[2.5] lg:flex-[3.5]' : 'flex-1'}`}
                  >
                    <img 
                      src={ind.image} 
                      alt={ind.name} 
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out will-change-transform
                        ${isExpanded ? 'scale-[1.10] opacity-100' : 'scale-[1.25] opacity-60'}`} 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent transition-opacity duration-700
                      ${isExpanded ? 'opacity-80 lg:opacity-40' : 'opacity-80'}`} />
                    
                    {/* Highlight Glow */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none
                      ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                      <div className={`transform transition-transform duration-700 ease-out flex flex-col h-full justify-end will-change-transform
                        ${isExpanded ? 'translate-y-0' : 'translate-y-4 lg:translate-y-12'}`}>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center text-white shrink-0 transition-colors duration-500
                            ${isExpanded ? 'bg-primary border-primary' : 'bg-white/10 border-white/20'}`}>
                            <span className="font-bold text-lg">{i + 1}</span>
                          </div>
                          <h3 className="text-2xl font-display font-bold text-white tracking-wide whitespace-nowrap drop-shadow-lg">
                            {ind.name}
                          </h3>
                        </div>

                        <div className={`grid transition-[grid-template-rows] duration-700 ease-out
                          ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <p className={`text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-4 transition-all duration-700
                              ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 lg:-translate-y-4'}`}>
                              {ind.description}
                            </p>
                            <div className={`flex items-center text-accent text-sm md:text-base font-bold transition-all duration-700 delay-100 pb-2
                              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                              {ind.stat} <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Core Values / The Elanpro Advantage (BENTO BOX LAYOUT) */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-[20%] -mt-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-[20%] -mb-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                <Shield className="w-4 h-4" /> Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-gray-900 mb-6 tracking-tight">
                The Elanpro <span className="text-primary relative inline-block">Advantage
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We don't just build refrigerators. We engineer mission-critical cooling ecosystems that industry leaders trust with their most valuable assets.
              </p>
            </FadeIn>
          </div>

          {/* Stacked Feature Deck */}
          <InteractiveFeatureDeck />
        </div>
      </section>

      {/* Cities Network Map Section */}
      <CitiesNetwork />

      {/* CTA Band */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=2000&q=80')] opacity-10 mix-blend-multiply object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to upgrade your cooling?</h2>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Consult with our experts today to design the perfect refrigeration setup for your specific needs.
            </p>
            <Button asChild size="lg" className="h-12 px-8 bg-accent text-white hover:bg-accent/90 text-base font-bold rounded-full shadow-[0_0_40px_rgba(0,102,255,0.4)] transition-all">
              <Link href="/contact">
                Request a Consultation
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </Layout>);

}