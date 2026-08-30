import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  Target, 
  Eye, 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Award,
  Zap
} from "lucide-react";

export default function MissionVisionValues() {
  const coreValues = [
    {
      title: "Customer Centricity",
      desc: "We put our customers at the center of everything we build. From customized product dimensions to 24/7 emergency response protocols, our priority is guaranteeing continuous uptime for our partners.",
      icon: HeartHandshake,
      accentColor: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-cyan-500",
      bulletPoints: ["24-48 hr service SLAs nationwide", "Tailored commercial customization", "Dedicated key account managers"]
    },
    {
      title: "Innovation & Technology",
      desc: "We pioneer advanced thermodynamic engineering, intelligent IoT temperature telemetry, and next-generation inverter drive cooling to deliver precision control.",
      icon: Lightbulb,
      accentColor: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
      bulletPoints: ["Cloud-connected telemetry sensors", "Smart auto-defrost algorithms", "Sub-zero precision stability"]
    },
    {
      title: "Uncompromising Quality",
      desc: "Every Elanpro unit undergoes stringent multi-stage testing in simulated tropical chambers up to 45°C ambient temperature to ensure bulletproof durability.",
      icon: ShieldCheck,
      accentColor: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
      bulletPoints: ["100% pre-dispatch quality audits", "ISO 9001:2015 quality processes", "Heavy-gauge food grade SS 304"]
    },
    {
      title: "Sustainability & Green Pledge",
      desc: "Committed to eco-friendly refrigeration using natural refrigerants (R290, R600a), low Global Warming Potential (GWP), and zero Ozone Depletion Potential (ODP).",
      icon: Leaf,
      accentColor: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
      bulletPoints: ["Up to 40% power reduction", "Zero-ODP hydrocarbon coolants", "Cyclopentane high-density insulation"]
    },
    {
      title: "Integrity & Ethical Governance",
      desc: "We foster transparent relationships with our channel dealers, suppliers, clients, and team members, anchored in honesty and respect.",
      icon: Users,
      accentColor: "from-purple-500/20 to-indigo-500/20",
      iconColor: "text-purple-500",
      bulletPoints: ["Honest warranty fulfillment", "Long-standing dealer partnerships", "Fair corporate governance"]
    }
  ];

  const strategicGoals = [
    { title: "Zero Food & Medicine Wastage", desc: "Equipping India's cold chain with dependable temperature retention to prevent spoilage of critical food and vaccine batches.", icon: Clock },
    { title: "Energy-Efficient Cold Chain", desc: "Setting national benchmarks in low power consumption through BLDC inverter compressors and eco-refrigerants.", icon: Zap },
    { title: "Global Benchmark Service", desc: "Providing 300+ touchpoint coverage with instant spare parts deployment and trained refrigeration specialists.", icon: Award }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000&q=80"
            alt="Team Collaboration"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Target className="w-3.5 h-3.5" />
              <span>Purpose & Guiding Ethos</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Mission, Vision, and Values
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              The fundamental principles and forward-looking vision that drive every product we engineer, every service we deliver, and every relationship we nurture.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="mission-vision-values" />

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <FadeIn direction="right">
              <div className="h-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mb-8">
                    <Target className="w-8 h-8" />
                  </div>
                  <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Our Core Mission</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                    Pioneering Dependable Cooling for Every Business
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                    To empower commercial enterprises across hospitality, food service, retail, healthcare, and research with reliable, energy-efficient, and technologically superior refrigeration solutions that safeguard their valuable assets, enhance operational efficiency, and elevate their brand experience.
                  </p>
                </div>

                <div className="pt-8 border-t border-slate-800 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                      <div className="text-2xl font-bold text-white mb-1">100%</div>
                      <div className="text-xs text-slate-400">Commitment to Reliability</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                      <div className="text-2xl font-bold text-white mb-1">24/7</div>
                      <div className="text-xs text-slate-400">Technical Service Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Vision Card */}
            <FadeIn direction="left">
              <div className="h-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary to-slate-900 text-white border border-primary/40 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mb-8">
                    <Eye className="w-8 h-8 text-accent" />
                  </div>
                  <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Our Strategic Vision</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                    The Global Benchmark in Commercial Refrigeration
                  </h2>
                  <p className="text-slate-200 text-lg leading-relaxed mb-6 font-light">
                    To be India's most trusted and globally admired commercial cooling enterprise, celebrated for pioneering sustainable green refrigeration technologies, setting new milestones in energy efficiency, and delivering gold-standard after-sales support that turns customers into lifelong advocates.
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-white mb-1">Global</div>
                      <div className="text-xs text-slate-300">Engineering Benchmarks</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-white mb-1">Eco-Cool</div>
                      <div className="text-xs text-slate-300">Sustainable Lifecycle Focus</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our DNA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Our 5 Core Values
              </h2>
              <p className="text-slate-600 text-base">
                These core pillars guide our daily decisions, product innovations, customer service, and long-term organizational strategy.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${val.accentColor} flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 ${val.iconColor}`} />
                        </div>
                        <span className="text-xs font-black text-slate-400">0{idx + 1}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {val.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm mb-6">
                        {val.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      {val.bulletPoints.map((bp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{bp}</span>
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

      {/* Strategic Vision Commitments */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="p-8 md:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
            <div className="max-w-3xl mb-12">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Our Pledge</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                The Elanpro Commitment to India's Cold Chain
              </h2>
              <p className="text-slate-300 text-base font-light">
                We believe that reliable commercial refrigeration is not just an appliance—it is the lifeline that protects fresh food, prevents medicine wastage, and powers entrepreneurial livelihoods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {strategicGoals.map((g, idx) => {
                const Icon = g.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{g.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="mission-vision-values" />
    </Layout>
  );
}
