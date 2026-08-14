import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, ShieldCheck, Shield, Zap, ThermometerSnowflake, Clock, Leaf, Truck, Headset, Snowflake } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import InteractiveFeatureDeck from "@/components/InteractiveFeatureDeck";
import CitiesNetwork from "@/components/CitiesNetwork";
import CinematicHero from "@/components/hero/CinematicHero";
import AboutReveal from "@/components/AboutReveal";
import ShowcaseScroll from "@/components/ShowcaseScroll";


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
      {/* Wrapper to contain the sticky video */}
      <section className="relative w-full">
        {/* Cinematic Hero Section */}
        <CinematicHero />

        {/* About Section - Wavebird Style */}
        <AboutReveal />
      </section>



      {/* Wavebird-Style 3D Product Showcase */}
      <ShowcaseScroll />

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