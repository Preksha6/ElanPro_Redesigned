import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, ABOUT_PAGES } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  Building2, 
  Target, 
  Milestone, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const sections = [
    {
      id: "company-overview",
      title: "Company Overview",
      subtitle: "India's Premier Commercial Refrigeration Leader",
      desc: "Founded in 2009, Elanpro has evolved into the definitive cold-chain partner for 100,000+ hospitality, retail, food service, and healthcare businesses across India.",
      path: "/company-overview",
      icon: Building2,
      badge: "Heritage & Scale",
      metrics: "15+ Years • 100,000+ Installations • 500+ Dealers",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    },
    {
      id: "mission-vision-values",
      title: "Mission, Vision, and Values",
      subtitle: "Guiding Ethos & Strategic Purpose",
      desc: "Discover the fundamental principles powering our technology innovation, commitment to green refrigeration, customer centricity, and ethical governance.",
      path: "/mission-vision-values",
      icon: Target,
      badge: "Core DNA",
      metrics: "Customer First • Green Tech • Uncompromising QA",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
    },
    {
      id: "our-journey",
      title: "Our Journey",
      subtitle: "15-Year Timeline of Continuous Breakthroughs",
      desc: "Trace our chronicle of milestones from our founding in 2009 to pan-India distribution, medical cooling wings, IoT telemetry, and global export expansion.",
      path: "/our-journey",
      icon: Milestone,
      badge: "Milestones",
      metrics: "2009 Genesis → IoT Inverter Era → Global Expansion",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
    },
    {
      id: "our-strength",
      title: "Our Strength",
      subtitle: "Pan-India Service, Tropical R&D, & 350+ SKUs",
      desc: "Explore the competitive moats that set Elanpro apart: 300+ service centers, products tested in 45°C ambient, and trusted by top brands like Haldiram's, Amul, & Starbucks.",
      path: "/our-strength",
      icon: ShieldCheck,
      badge: "Engineering Might",
      metrics: "300+ Service Centers • 500+ Techs • 350+ SKUs",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
    },
    {
      id: "our-value-proposition",
      title: "Our Value Proposition",
      subtitle: "Lower TCO, Up to 40% Energy Savings, & SLAs",
      desc: "Delivering measurable ROI through ultra-low power consumption, customized dimensions & branding, turnkey consulting, and 24-48 hr resolution SLAs.",
      path: "/our-value-proposition",
      icon: Zap,
      badge: "Measurable ROI",
      metrics: "Up to 40% Energy Savings • Turnkey Cold Chain Consulting",
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
    },
    {
      id: "our-management",
      title: "Our Management",
      subtitle: "Visionary Industry Pioneers",
      desc: "Meet our executive leadership team and board of directors whose collective industry experience and customer-first philosophy drive Elanpro forward.",
      path: "/our-management",
      icon: Users,
      badge: "Executive Leadership",
      metrics: "30+ Years Industry Expertise • Visionary Founders",
      img: "https://elanpro.net/wp-content/uploads/2025/07/RANJAN-JAIN.png"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=2000&q=80"
            alt="Elanpro Corporate"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover Elanpro</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Built on Precision.<br />Driven by Trust.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              For over a decade and a half, Elanpro has been the backbone of India's commercial cold chain, engineering mission-critical refrigeration solutions for the country's most demanding enterprises.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav />

      {/* Overview Hub Grid of 6 Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Comprehensive Overview</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Explore the Dimensions of Elanpro
              </h2>
              <p className="text-slate-600 text-base">
                Click on any section below to explore our story, capabilities, values, timeline, and leadership.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <StaggerItem key={idx}>
                  <Link href={sec.path} className="group block h-full">
                    <div className="h-full rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
                      
                      <div>
                        {/* Image Header */}
                        <div className="relative h-48 overflow-hidden bg-slate-900">
                          <img
                            src={sec.img}
                            alt={sec.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                              {sec.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-lg">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-300">Section 0{idx + 1}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-accent transition-colors flex items-center justify-between">
                            <span>{sec.title}</span>
                            <ArrowRight className="w-4 h-4 text-accent transform group-hover:translate-x-1 transition-transform" />
                          </h3>
                          <div className="text-xs font-semibold text-slate-400 mb-3">
                            {sec.subtitle}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            {sec.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:bg-accent/5 transition-colors">
                        <span className="text-accent">{sec.metrics}</span>
                      </div>

                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Fast CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-display font-bold mb-4">Need a Commercial Refrigeration Solution?</h2>
          <p className="text-slate-300 text-base mb-8">
            Speak directly with our commercial cooling consultants or request a customized proposal for your kitchen, store, or cold chain project.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-8 font-bold bg-accent hover:bg-accent/90 text-white">
                Contact Our Team
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-white/30 text-white hover:bg-white/10">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}