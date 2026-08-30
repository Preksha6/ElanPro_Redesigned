import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  Milestone, 
  Rocket, 
  MapPin, 
  UtensilsCrossed, 
  FlaskConical, 
  Leaf, 
  Cpu, 
  Globe2, 
  Award,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function OurJourney() {
  const milestones = [
    {
      year: "2009",
      title: "Inception & Foundation",
      tagline: "The Genesis of Elanpro",
      desc: "Founded by commercial refrigeration veterans Sanjay Jain, Ranjan Jain, and Ashwani Goel with a bold mission: to introduce world-class, energy-efficient commercial cooling customized specifically for the Indian climate.",
      icon: Rocket,
      badge: "Foundation Year",
      stats: "Operations began in NCR"
    },
    {
      year: "2011",
      title: "Pan-India Dealer Expansion",
      tagline: "Building National Distribution",
      desc: "Rapidly built a nationwide channel footprint covering North, South, West, and East India. Established regional service hubs across Delhi, Mumbai, Bengaluru, and Chennai to ensure rapid turnaround times.",
      icon: MapPin,
      badge: "Distribution",
      stats: "50+ Active Dealer Hubs"
    },
    {
      year: "2014",
      title: "Food Service & Hospitality Boom",
      tagline: "Preferred Brand for QSR & Cafes",
      desc: "Secured enterprise vendor status with leading quick-service restaurant (QSR) chains, specialty bakery brands, boutique coffee shops, and premium luxury hotel properties across the subcontinent.",
      icon: UtensilsCrossed,
      badge: "Hospitality Lead",
      stats: "15,000+ Active Units"
    },
    {
      year: "2016",
      title: "Display & Confectionery Evolution",
      tagline: "Setting Benchmarks in Visual Merchandising",
      desc: "Launched a state-of-the-art confectionery showcase and blast chilling lineup featuring heated double-glazed anti-fog glass, digital humidity management, and European aesthetics.",
      icon: Sparkles,
      badge: "Design Innovation",
      stats: "100+ Product Models"
    },
    {
      year: "2018",
      title: "Pharma & Life Sciences Division",
      tagline: "Mission-Critical Biomedical Cooling",
      desc: "Introduced specialized biomedical refrigerators, ultra-low temperature freezers (-86°C), and blood bank storage units compliant with WHO and stringent national health guidelines.",
      icon: FlaskConical,
      badge: "Medical Cold Chain",
      stats: "ISO 13485 Standards"
    },
    {
      year: "2020",
      title: "Green Cooling & Inverter Revolution",
      tagline: "Pioneering Eco-Refrigeration in India",
      desc: "Proactively transitioned the product catalog to zero-ODP, low-GWP natural refrigerants (R290, R600a) and introduced BLDC inverter compressors to lower enterprise electricity bills by up to 40%.",
      icon: Leaf,
      badge: "Sustainability First",
      stats: "40% Energy Reduction"
    },
    {
      year: "2022",
      title: "Experience Centers & IoT Telemetry",
      tagline: "Connecting Hardware to the Cloud",
      desc: "Inaugurated flagship Customer Experience Centers in Gurugram and Bengaluru. Integrated smart cloud-connected IoT sensors into commercial refrigerators for real-time monitoring and predictive maintenance.",
      icon: Cpu,
      badge: "Smart Tech Era",
      stats: "Connected IoT Fleet"
    },
    {
      year: "Present",
      title: "Premier B2B Cooling Powerhouse",
      tagline: "100,000+ Installations & Export Growth",
      desc: "Today, Elanpro is India's premier B2B commercial refrigeration brand with 300+ service centers, 500+ dealer partners, and expanding international footprints across South Asia and the Middle East.",
      icon: Globe2,
      badge: "Industry Benchmark",
      stats: "100,000+ Happy Clients"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=2000&q=80"
            alt="Elanpro Journey"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Milestone className="w-3.5 h-3.5" />
              <span>Milestones & Heritage</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Our Journey
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              From a visionary startup in 2009 to India's most trusted commercial refrigeration brand—explore the key milestones that define our fifteen-year trajectory of innovation.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="our-journey" />

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-y-1/2" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Chronicle of Growth</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                15+ Years of Pioneering Cooling
              </h2>
              <p className="text-slate-600 text-base">
                Every chapter in our history represents a breakthrough in engineering, customer trust, and industry leadership.
              </p>
            </FadeIn>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Center Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary/10 via-accent/40 to-primary/10 -translate-x-1/2 rounded-full" />

            <StaggerContainer className="space-y-16 relative">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                const Icon = m.icon;
                return (
                  <StaggerItem key={i}>
                    <div className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                      
                      {/* Timeline Node Icon */}
                      <div className="absolute left-6 md:left-1/2 w-10 h-10 bg-white border-4 border-accent rounded-full transform md:-translate-x-1/2 z-20 group-hover:scale-125 group-hover:border-primary transition-all duration-300 shadow-md flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent group-hover:bg-primary transition-colors" />
                      </div>

                      {/* Mobile Line segment */}
                      {i !== milestones.length - 1 && (
                        <div className="md:hidden absolute left-[1.95rem] top-10 bottom-[-5rem] w-0.5 bg-accent/30 z-0" />
                      )}

                      {/* Content Card */}
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 hover:border-accent/40 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
                          
                          {/* Year Watermark */}
                          <div className={`absolute -bottom-4 ${isEven ? 'md:-left-4 right-4 md:right-auto' : 'right-4'} text-8xl font-black text-slate-900/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-accent/5`}>
                            {m.year}
                          </div>

                          {/* Card Content */}
                          <div className="relative z-10">
                            <div className={`flex items-center gap-2 mb-4 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                {m.year}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs">
                                {m.badge}
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                              {m.title}
                            </h3>
                            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-4">
                              {m.tagline}
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
                              {m.desc}
                            </p>

                            <div className={`pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                              <Icon className="w-4 h-4 text-accent shrink-0" />
                              <span>{m.stats}</span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="our-journey" />
    </Layout>
  );
}
