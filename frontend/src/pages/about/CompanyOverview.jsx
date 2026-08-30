import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  Building2, 
  Award, 
  Users2, 
  MapPin, 
  Boxes, 
  ShieldCheck, 
  Leaf, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Flame,
  Snowflake,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompanyOverview() {
  const stats = [
    { value: "15+", label: "Years of Industry Leadership", icon: Award },
    { value: "100,000+", label: "Commercial Installations", icon: Boxes },
    { value: "500+", label: "Channel & Dealer Partners", icon: Users2 },
    { value: "300+", label: "Authorized Service Centers", icon: MapPin },
    { value: "350+", label: "Specialized Cooling SKUs", icon: Snowflake },
    { value: "99.8%", label: "Operational Reliability Rate", icon: ShieldCheck },
  ];

  const corePillars = [
    {
      title: "Commercial Refrigeration Pioneer",
      desc: "Since 2009, Elan Professional Appliances Pvt. Ltd. (Elanpro) has stood at the forefront of India's commercial cooling ecosystem, delivering mission-critical refrigeration and food service machinery to world-class enterprises.",
      icon: Building2,
      tag: "Heritage"
    },
    {
      title: "Tropicalized Engineering",
      desc: "Engineered specifically for extreme Indian environmental conditions, our products run smoothly in ambient temperatures up to 43°C-45°C and handle severe electrical fluctuations with ease.",
      icon: Flame,
      tag: "Performance"
    },
    {
      title: "Green & Sustainable Cooling",
      desc: "Pioneering the shift towards low-GWP, zero-ODP natural refrigerants (R290, R600a), cycloisopentane insulation, and high-efficiency BLDC inverter compressors to cut energy costs by up to 40%.",
      icon: Leaf,
      tag: "Sustainability"
    },
    {
      title: "IoT & Smart Telemetry",
      desc: "Modern refrigeration enabled with real-time temperature tracking, automated HACCP logging, predictive maintenance diagnostics, and instant mobile alerts.",
      icon: Cpu,
      tag: "Technology"
    }
  ];

  const marketSectors = [
    { name: "Hospitality & Fine Dining", desc: "Luxury hotels, banquet kitchens, quick service restaurants, and bars", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" },
    { name: "Bakery & Confectionery", desc: "Premium temperature & humidity controlled pastry cases and blast chillers", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" },
    { name: "Retail & Supermarkets", desc: "Multideck open chillers, island freezers, and glass door visicoolers", img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80" },
    { name: "Healthcare & Life Sciences", desc: "Certified biomedical freezers, blood bank refrigerators, and vaccine chillers", img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=80"
            alt="Corporate skyscraper"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>About Elanpro</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Company Overview
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              India's premier commercial refrigeration brand, empowering over 100,000 hospitality, retail, food service, and healthcare businesses with advanced cooling technology.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="company-overview" />

      {/* Stats Counter Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-accent/40 hover:shadow-lg transition-all">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">{item.value}</div>
                    <div className="text-xs font-medium text-slate-600 leading-tight">{item.label}</div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Corporate Narrative & Heritage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <FadeIn direction="right">
                <span className="text-accent font-bold tracking-wider uppercase text-xs mb-3 block">Who We Are</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 leading-snug">
                  Transforming India's Commercial Cold Chain Since 2009
                </h2>
                <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                  <p>
                    <strong>Elan Professional Appliances Pvt. Ltd. (Elanpro)</strong> is an Indian commercial refrigeration powerhouse headquartered in Gurugram, NCR. Over the past 15+ years, we have evolved from a visionary cold-chain startup into the definitive market leader for food, beverage, hospitality, and life sciences refrigeration.
                  </p>
                  <p>
                    We specialize in delivering robust, high-performance equipment that meets global standards while being meticulously customized for Indian operating conditions. From neighborhood bakeries and supermarket chains to luxury five-star hotels and national pharmaceutical cold chains, Elanpro provides cooling that never fails.
                  </p>
                  <p>
                    With an expansive network of over <strong>500 dealer partners</strong> and <strong>300+ authorized service centers</strong> spanning all 28 states and union territories, we ensure instant response times, reliable spare parts availability, and maximum operational uptime for our clients.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>ISO 9001:2015 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>CE & RoHS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>BEE Star Rated Efficiency</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn direction="left">
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1000&q=80"
                      alt="Elanpro Engineering Facility"
                      className="w-full h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-accent uppercase tracking-wider">Corporate Hub</div>
                          <div className="text-base font-bold text-slate-900">DLF Corporate Greens, Gurugram</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                          EP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Our Foundations</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                What Sets Elanpro Apart
              </h2>
              <p className="text-slate-600 text-base">
                Engineering excellence, deep Indian market expertise, and an unwavering commitment to quality.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          {pillar.tag}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Market Sectors & Industries */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Market Reach</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                Industries We Power Every Day
              </h2>
            </div>
            <Link href="/industries">
              <Button variant="outline" className="rounded-full gap-2 border-slate-300 hover:border-accent hover:text-accent">
                <span>View All Industries</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketSectors.map((sector, idx) => (
              <StaggerItem key={idx}>
                <div className="group rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={sector.img}
                      alt={sector.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">
                        {sector.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {sector.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="company-overview" />
    </Layout>
  );
}
