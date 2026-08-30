import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  ShieldCheck, 
  MapPin, 
  Wrench, 
  Flame, 
  Boxes, 
  Award, 
  CheckCircle2, 
  Zap, 
  Truck, 
  Headphones, 
  ArrowRight,
  Sparkles,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OurStrength() {
  const strengths = [
    {
      title: "Pan-India Service Infrastructure",
      desc: "With 300+ authorized service hubs and over 500 factory-trained refrigeration technicians nationwide, we guarantee unmatched 24 to 48 hour resolution SLAs across Tier 1, 2, and 3 cities.",
      icon: Headphones,
      stats: "300+ Service Centers",
      features: ["Trained refrigeration engineers", "Guaranteed genuine OEM spares", "24/7 dedicated service helpline"]
    },
    {
      title: "Tropicalized R&D & Engineering",
      desc: "Our products are engineered in state-of-the-art testing labs to perform relentlessly in ambient temperatures up to 45°C and withstand Indian power fluctuations (160V - 260V) without compressor burnout.",
      icon: Flame,
      stats: "Tested up to 45°C Ambient",
      features: ["Heavy-duty copper condensers", "Sub-tropicalized compressor units", "Anti-sweat heated door glass"]
    },
    {
      title: "Extensive 350+ SKU Portfolio",
      desc: "India's most diverse commercial refrigeration line-up spanning visicoolers, chest freezers, confectionery glass showcases, blast chillers, ice machines, minibars, and certified biomedical refrigerators.",
      icon: Boxes,
      stats: "350+ Specialized SKUs",
      features: ["One-stop solution for B2B", "Custom sizing & bespoke finishes", "Flexible temperature ranges (-40°C to +15°C)"]
    },
    {
      title: "Trusted by Global & Domestic Titans",
      desc: "The chosen cooling partner for India's largest food chains, retail hypermarkets, luxury hotel groups, and pharmaceutical leaders who depend on zero-downtime refrigeration.",
      icon: Award,
      stats: "100,000+ Installations",
      features: ["Preferred vendor for top QSRs", "National retail chain rollouts", "Healthcare cold chain contracts"]
    },
    {
      title: "Centralized Warehousing & Fast Spares",
      desc: "Strategic regional distribution centers in Gurugram, Bengaluru, Mumbai, and Kolkata maintain ready inventories of critical spares and equipment for same-day dispatch.",
      icon: Truck,
      stats: "99.2% Spares Availability",
      features: ["4 Mega regional warehouses", "Express courier logistics", "Direct OEM components"]
    },
    {
      title: "Stringent Multi-Stage Quality Audits",
      desc: "Every single unit undergoes rigorous multi-point electrical safety tests, thermodynamic efficiency verification, helium leak detection, and sound level audits before dispatch.",
      icon: ShieldCheck,
      stats: "100% Pre-Dispatch Audits",
      features: ["ISO 9001:2015 certified processes", "CE, BEE & RoHS compliance", "HACCP food safety alignment"]
    }
  ];

  const clientLogos = [
    "Haldiram's", "Amul", "Starbucks", "Subway", "ITC Hotels", 
    "Mother Dairy", "Apollo Hospitals", "Dr. Reddy's", "Barbeque Nation", 
    "Costa Coffee", "Baskin Robbins", "Chaayos"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=2000&q=80"
            alt="Engineering Strength"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Competitive Advantages</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Our Strength
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Built on engineering resilience, an unrivaled pan-India service network, deep product versatility, and the enduring trust of India's leading enterprises.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="our-strength" />

      {/* Strengths Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Pillars of Excellence</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Why Industry Leaders Choose Elanpro
              </h2>
              <p className="text-slate-600 text-base">
                Discover the foundational strengths that make Elanpro the undisputed market leader in commercial refrigeration.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strengths.map((str, idx) => {
              const Icon = str.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          {str.stats}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {str.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm mb-6">
                        {str.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      {str.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Network Numbers Banner */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Nationwide Reach</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Never Far From an Elanpro Service Touchpoint
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-8 font-light">
                Refrigeration downtime can mean lost inventory and interrupted business. That's why Elanpro has built India's most responsive B2B service network, ensuring our certified technicians reach you whenever and wherever needed.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-3xl font-extrabold text-accent mb-1">300+</div>
                  <div className="text-xs text-slate-400">Authorized Service Centers</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-3xl font-extrabold text-white mb-1">500+</div>
                  <div className="text-xs text-slate-400">Certified Technicians</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>The Elanpro Reliability Standard</span>
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Express Spare Parts Dispatch:</strong> Guaranteed genuine OEM parts stocked across central warehouses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Comprehensive AMC Contracts:</strong> Preventative checkups and priority turnaround for commercial kitchens.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Key Account Support:</strong> Single point of contact for multi-outlet retail & restaurant chains.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Our Clients</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Trusted by India's Most Iconic Brands
            </h2>
            <p className="text-slate-600 text-sm">
              Powering cold chains for hospitality giants, QSR leaders, retail superchains, and top healthcare institutes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clientLogos.map((client, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-accent/40 text-center flex items-center justify-center h-20 transition-all hover:shadow-md">
                <span className="font-bold text-slate-700 text-sm">{client}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/clients">
              <Button variant="outline" className="rounded-full gap-2 border-slate-300 hover:border-accent hover:text-accent">
                <span>View Full Client Roster</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="our-strength" />
    </Layout>
  );
}
