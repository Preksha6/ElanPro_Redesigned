import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  Zap, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  CircleDollarSign,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OurValueProposition() {
  const valuePillars = [
    {
      title: "Lowest Total Cost of Ownership (TCO)",
      desc: "By pairing variable-speed BLDC inverter compressors with high-density cyclopentane insulation and low-GWP natural refrigerants, Elanpro refrigeration cuts electricity consumption by up to 40%, yielding significant ROI over equipment lifespans.",
      icon: CircleDollarSign,
      stat: "Up to 40% Energy Savings",
      points: ["Lower lifetime utility bills", "Heavy-gauge copper coils prevent costly leaks", "Substantially longer compressor service life"]
    },
    {
      title: "End-to-End Cold Chain Consulting",
      desc: "We don't just sell boxes; we engineer complete cooling ecosystems. Our technical specialists collaborate with restaurant consultants, architects, and franchise owners from initial layout drafting to turnkey handover.",
      icon: Layers,
      stat: "Turnkey Project Execution",
      points: ["Kitchen CAD layout planning", "Heat-load calculation & equipment sizing", "Dedicated on-site commissioning & testing"]
    },
    {
      title: "Bespoke Customization & Branding",
      desc: "Tailor your commercial display coolers with high-impact custom vinyl wraps, bespoke LED illumination colors, adjustable shelving racks, and personalized brand headers that convert shoppers at the point of sale.",
      icon: Sliders,
      stat: "Customized to Your Brand",
      points: ["Factory-applied durable brand wraps", "Customizable digital thermostat settings", "Specialized display shelf configurations"]
    },
    {
      title: "Guaranteed SLA Response & Peace of Mind",
      desc: "We back every installation with strict 24-48 hour service SLAs, an expansive network of 300+ service touchpoints, preventative AMC maintenance schedules, and ready access to genuine OEM spare parts.",
      icon: Clock,
      stat: "24-48 Hr Service SLA",
      points: ["Trained technicians across Tier 1, 2, 3 cities", "Preventative maintenance AMC agreements", "Fast-track emergency support hotline"]
    },
    {
      title: "Precision Food Safety & HACCP Compliance",
      desc: "Engineered with intelligent forced-air ducting and digital Carel/Dixell temperature controllers that maintain ultra-precise temperatures with minimal fluctuation—ensuring strict food safety and zero wastage.",
      icon: ShieldCheck,
      stat: "HACCP Safety Standard",
      points: ["Uniform temperature across every shelf", "Anti-fog heated double/triple pane glass", "Food-grade stainless steel 304 construction"]
    },
    {
      title: "Connected IoT Cloud Telemetry",
      desc: "Gain real-time visibility into your entire refrigeration fleet with cloud-enabled IoT telemetry. Receive instant automated alerts for temperature deviations, door-open alerts, and compressor health diagnostics.",
      icon: Cpu,
      stat: "Smart Cloud Connected",
      points: ["Real-time temperature logging on mobile/web", "Instant SMS/Email excursion warnings", "Predictive compressor health diagnostics"]
    }
  ];

  const comparisonData = [
    {
      feature: "Energy Efficiency & Power Bills",
      elanpro: "Up to 40% lower power consumption (Inverter BLDC + R290)",
      standard: "High energy consumption, conventional fixed-speed motors"
    },
    {
      feature: "Ambient Heat Performance",
      elanpro: "Tropicalized: Flawless performance in up to 45°C ambient",
      standard: "Struggles above 35°C, prone to compressor overheating"
    },
    {
      feature: "Service Network & Spares",
      elanpro: "300+ Pan-India service centers, 24-48 hr resolution SLA",
      standard: "Fragmented third-party repairs, long delays for spares"
    },
    {
      feature: "Build Quality & Materials",
      elanpro: "Heavy-gauge SS 304, pure copper tubing, cyclopentane foam",
      standard: "Lower grade steel, aluminum tubing susceptible to pinhole leaks"
    },
    {
      feature: "Smart Monitoring & IoT",
      elanpro: "Integrated IoT telemetry, automated HACCP logging & alerts",
      standard: "Manual logging only, zero remote fault alerts"
    },
    {
      feature: "Eco-Friendly Compliance",
      elanpro: "100% natural eco-refrigerants, zero ODP, ultra-low GWP",
      standard: "High-GWP synthetic refrigerants facing regulatory phase-outs"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=2000&q=80"
            alt="Value Proposition"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Measurable ROI & Advantage</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Our Value Proposition
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Delivering high financial ROI through ultra-low energy consumption, bulletproof operational reliability, customized engineering, and unmatched lifecycle support.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="our-value-proposition" />

      {/* Value Pillars Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Why Invest in Elanpro</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Engineered for Long-Term Business Value
              </h2>
              <p className="text-slate-600 text-base">
                Discover the tangible advantages that transform Elanpro refrigeration from an equipment expense into a profitable business asset.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuePillars.map((vp, idx) => {
              const Icon = vp.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent">
                          {vp.stat}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {vp.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm mb-6">
                        {vp.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      {vp.points.map((pt, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{pt}</span>
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

      {/* Comparison Matrix Table */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Direct Comparison</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Elanpro vs Conventional Refrigeration
              </h2>
              <p className="text-slate-600 text-base">
                See how Elanpro’s advanced engineering and pan-India support structure outclasses standard commercial coolers.
              </p>
            </FadeIn>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-900 text-white">
                    <th className="p-5 font-bold text-sm w-1/3">Key Evaluation Criteria</th>
                    <th className="p-5 font-bold text-sm bg-accent text-white w-1/3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Elanpro Standard</span>
                      </div>
                    </th>
                    <th className="p-5 font-bold text-sm text-slate-300 w-1/3">Standard Market Equipment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5 font-bold text-slate-900 text-sm">
                        {row.feature}
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-800 bg-accent/5">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{row.elanpro}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-500">
                        <div className="flex items-start gap-2.5">
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{row.standard}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="our-value-proposition" />
    </Layout>
  );
}
