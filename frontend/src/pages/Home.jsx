import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, ShieldCheck, Shield, Zap, ThermometerSnowflake, Clock, Leaf, Truck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

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

export default function Home() {
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-32 overflow-hidden text-white text-center">
        
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000"
            alt="Commercial Kitchen Refrigeration"
            className="w-full h-full object-cover"
          />
          {/* Brand-colored Overlay for Text Readability */}
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center max-w-4xl">
          
          <FadeIn>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              India's Commercial Cooling Leader
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight">
              Precision <span className="text-accent">Cooling</span> <br className="hidden md:block" />
              for Global Standards.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light opacity-90">
              From luxury hospitality to life-saving medical storage, Elanpro delivers world-class refrigeration engineered for absolute reliability.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
            <Button asChild size="lg" className="h-14 px-8 text-base font-bold bg-accent text-accent-dark hover:bg-accent-light rounded-sm transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)] border-none">
              <Link href="/products">
                Explore Products <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-bold border-2 border-white/30 text-white hover:bg-white hover:text-primary rounded-sm transition-all backdrop-blur-sm">
              <Link href="/contact">
                Request a Quote
              </Link>
            </Button>
          </FadeIn>
          
        </div>
      </section>

      {/* Glassmorphism Stats Section */}
      <section className="relative z-20 -mt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-4 md:p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <StaggerContainer className="grid grid-cols-3 gap-2 md:gap-8">
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
              <img key={i} src={logo.url} alt={logo.name} className="h-10 md:h-14 object-contain mx-10 md:mx-14 drop-shadow-sm hover:scale-125 transition-transform duration-300" />
            ))}
          </div>
          <div className="flex w-max shrink-0 animate-marquee items-center transition-all duration-700" aria-hidden="true">
            {BRAND_LOGOS.map((logo, i) => (
              <img key={`dup-${i}`} src={logo.url} alt={logo.name} className="h-10 md:h-14 object-contain mx-10 md:mx-14 drop-shadow-sm hover:scale-125 transition-transform duration-300" />
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
            <div className="flex flex-col lg:flex-row h-[600px] sm:h-[700px] lg:h-[400px] gap-4 w-full">
              {industries.map((ind, i) => (
                <div 
                  key={ind.id} 
                  className="group relative flex-1 hover:flex-[2] lg:hover:flex-[3.5] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden rounded-3xl cursor-pointer shadow-2xl border border-white/5 bg-gray-900"
                >
                  <img 
                    src={ind.image} 
                    alt={ind.name} 
                    className="absolute inset-0 w-full h-full object-cover object-center scale-[1.25] lg:group-hover:scale-[1.10] transition-transform duration-[1200ms] ease-out opacity-60 lg:group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent lg:opacity-80 lg:group-hover:opacity-40 transition-opacity duration-700" />
                  
                  {/* Highlight Glow on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 lg:translate-y-12 lg:group-hover:translate-y-0 transition-transform duration-[800ms] ease-out flex flex-col h-full justify-end">
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors duration-500">
                          <span className="font-bold text-lg">{i + 1}</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white tracking-wide whitespace-nowrap drop-shadow-lg">
                          {ind.name}
                        </h3>
                      </div>

                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
                        <div className="overflow-hidden">
                          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 -translate-y-2 group-hover:translate-y-0 lg:-translate-y-4">
                            {ind.description}
                          </p>
                          <div className="flex items-center text-accent text-sm md:text-base font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 pb-2">
                            {ind.stat} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
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

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            
            {/* Card 1: Large Feature (Span 2x2) */}
            <FadeIn delay={0.1} className="md:col-span-2 lg:col-span-2 row-span-2 group">
              <div className="h-full p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-2xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-2">
                <div className="absolute -right-20 -top-20 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                  <Shield className="w-96 h-96" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Unmatched Reliability</h3>
                  <p className="text-primary-light text-base md:text-lg leading-relaxed max-w-lg mb-8 flex-grow">
                    Engineered for harsh environments, erratic power supplies, and peak hour stresses. We minimize your downtime so you can maximize your revenue.
                  </p>
                  <div className="inline-flex items-center text-white font-bold text-lg cursor-pointer group/link">
                    Explore our technology <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Card 2: Standard Square */}
            <FadeIn delay={0.2} className="col-span-1 group">
              <div className="h-full p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100 relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none group-hover:bg-accent/10 transition-colors" />
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                  <Zap className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Energy Efficient</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Advanced compressors and thick-wall insulation technologies that drastically cut down your operational utility costs.
                </p>
              </div>
            </FadeIn>

            {/* Card 3: Standard Square */}
            <FadeIn delay={0.3} className="col-span-1 group">
              <div className="h-full p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100 relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                  <ThermometerSnowflake className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Precision Cooling</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Microprocessor-controlled thermostats guarantee exact temperature maintenance without harmful fluctuations.
                </p>
              </div>
            </FadeIn>

            {/* Card 4: Wide Horizontal (Span 3) */}
            <FadeIn delay={0.4} className="md:col-span-2 lg:col-span-3 group">
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-gray-900 to-slate-800 text-white shadow-2xl relative overflow-hidden transition-transform duration-500 hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6 border border-gray-700">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center relative z-10">
                  <Clock className="w-7 h-7 text-accent group-hover:animate-pulse" />
                </div>
                <div className="relative z-10 text-center md:text-left flex-grow">
                  <h3 className="text-2xl font-display font-bold mb-2">24/7 Pan-India Support</h3>
                  <p className="text-gray-400 text-lg">
                    Our massive, highly-trained service network ensures that expert help is always just a phone call away, anywhere in India.
                  </p>
                </div>
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-accent/50 flex items-center justify-center text-accent group-hover:border-solid group-hover:bg-accent group-hover:text-gray-900 transition-all duration-500 cursor-pointer">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=2000&q=80')] opacity-10 mix-blend-multiply object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to upgrade your cooling?</h2>
            <p className="text-primary-light text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Consult with our experts today to design the perfect refrigeration setup for your specific needs.
            </p>
            <Button asChild size="lg" className="h-12 px-8 bg-accent text-gray-900 hover:bg-accent/90 text-base font-bold rounded-full shadow-[0_0_40px_rgba(255,185,0,0.4)] transition-all">
              <Link href="/contact">
                Request a Consultation
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </Layout>);

}