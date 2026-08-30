import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import YouTubeVideoShowcase from "@/components/YouTubeVideoShowcase";
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
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
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
        const [statsRes, productsRes] = await Promise.all([
          supabase.from('stats').select('*').order('id', { ascending: true }),
          supabase.from('products').select('*').limit(4)
        ]);
        
        if (statsRes.data) setStats(statsRes.data);
        if (productsRes.data) setTopProducts(productsRes.data);
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

      {/* Why Choose Us: Official YouTube Video Showcase with Autoplay */}
      <YouTubeVideoShowcase />

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
    </Layout>
  );
}