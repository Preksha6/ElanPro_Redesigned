import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  Heart, 
  HandHeart, 
  GraduationCap, 
  Truck, 
  Utensils, 
  Laptop, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Play,
  Sparkles,
  CheckCircle2,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CsrPolicy() {
  const initiatives = [
    {
      title: "Cooling Solutions, Warming Hearts",
      subtitle: "Eradicating Hunger & Minimizing Food Wastage",
      desc: "Aligned with Elanpro’s core CSR mission, we combat hunger by redistributing surplus nutritious food from hotels, banquet parties, and events to underprivileged children and adults before it spoils. Using advanced mobile cold chain logistics, we ensure food safety and timely delivery.",
      tag: "Zero Hunger",
      icon: Utensils,
      image: "https://elanpro.net/wp-content/uploads/2025/06/04a4e9711b23c83a781baa360752a322a329acbf.jpg"
    },
    {
      title: "Skill Chill – Shaping Futures in Cooling",
      subtitle: "Youth Refrigeration Technical Training",
      desc: "A 45-day Skill Development Programme on Commercial Refrigeration conducted at the Assam Skill Development Training Centre, in collaboration with Assam Engineering Institute and Care U 365. Graced by Dr. Ranoj Pegu, Hon’ble Education Minister of Assam, this initiative equips youth with hands-on technical certifications for sustainable careers.",
      tag: "Skill Development",
      icon: GraduationCap,
      image: "https://elanpro.net/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-01-at-9.55.23-AM.jpeg"
    },
    {
      title: "Magic Wheels – ‘Dilli Ki Jaan’",
      subtitle: "Electric Mobile Cold-Chain Food Bank",
      desc: "Launched on World Hunger Day, this custom electric vehicle is equipped with a 9,000-litre temperature-controlled refrigerated storage box. It preserves and delivers over 800 free nutritious meals daily to shelter homes across Delhi NCR, significantly expanding service reach.",
      tag: "Food Rescue",
      icon: Truck,
      videoUrl: "https://youtu.be/j8qnthTY_Uc?si=Je8zw0Qqv8DrQpqD"
    },
    {
      title: "Happy Fridges (Community Refrigerators)",
      subtitle: "Grassroots Neighborhood Food Sharing",
      desc: "Installed in high-density urban public areas across India, these community refrigerators enable restaurants and citizens to donate fresh excess food safely. Needy community members can access nutritious food with dignity, zero cost, and zero stigma.",
      tag: "Community Action",
      icon: Heart,
      videoUrl: "https://youtu.be/zJFDzOtpV9s?si=xByKaSswRzBPuRHD"
    },
    {
      title: "Computer Center – Jabalpur Girls College",
      subtitle: "Empowering Women Through Digital Literacy",
      desc: "Recognizing the vital role of digital access, Elanpro established an advanced computer laboratory for hostel students in Jabalpur. The center provides modern IT infrastructure, internet connectivity, and computing software for academic research and tech skills.",
      tag: "Education",
      icon: Laptop,
      image: "https://elanpro.net/wp-content/uploads/2025/06/Girls-College.jpg"
    },
    {
      title: "Supporting Rainbow Homes",
      subtitle: "Care & Education for Street Children",
      desc: "In partnership with Rainbow Homes, which shelters and nurtures vulnerable street children, Elanpro established a fully functional computer education lab to unlock digital learning, coding, and vocational opportunities for every child.",
      tag: "Child Welfare",
      icon: HandHeart,
      image: "https://elanpro.net/wp-content/uploads/2025/06/Rainbow_Homes_give.jpg"
    },
    {
      title: "Earth Savior Foundation Partnership",
      subtitle: "Dedicated Ambulance & Healthcare Transport",
      desc: "Supporting the Earth Savior Foundation’s humanitarian mission, Elanpro donated a fully equipped ambulance to serve over 400 sick, elderly, and abandoned individuals, ensuring urgent access to medical centers and hospitals.",
      tag: "Healthcare",
      icon: ShieldCheck,
      image: "https://elanpro.net/wp-content/uploads/2025/06/Earth-Saviour-Foundation.jpeg"
    }
  ];

  const policyPillars = [
    {
      title: "Social Accountability",
      desc: "Complying with Section 135 of the Companies Act, 2013, our Board-level CSR Committee oversees resource allocation with full transparency."
    },
    {
      title: "Environmental Stewardship",
      desc: "Championing eco-friendly natural refrigerants (R290, R600a), energy efficiency, and certified E-waste recycling management."
    },
    {
      title: "Community Upliftment",
      desc: "Direct investments into healthcare access, technical skill development, digital education, and zero food wastage initiatives."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://elanpro.net/wp-content/uploads/2025/06/CSR-1.jpg"
            alt="Elanpro CSR"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5" />
              <span>Elanpro Cares</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Corporate Social Responsibility
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Cooling solutions, warming hearts. Using our engineering and cold chain capabilities to eradicate hunger, foster youth technical skills, and uplift communities.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* CSR Secondary Tab Nav */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-[56px] md:top-[64px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center overflow-x-auto py-2.5 scrollbar-none gap-2">
            <Link
              href="/csr-policy"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-accent text-white shadow-md"
            >
              <Heart className="w-4 h-4" />
              <span>CSR Policy & Initiatives</span>
            </Link>
            <Link
              href="/annual-return-policy"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Annual Return Policy</span>
            </Link>
            <Link
              href="/media-blogs"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>Media & Blogs</span>
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Camera className="w-4 h-4 text-slate-400" />
              <span>Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Initiatives Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Our Impact</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Flagship CSR Programs & Initiatives
              </h2>
              <p className="text-slate-600 text-base">
                Discover how Elanpro deploys resources, technology, and passionate partnerships to make a tangible difference.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                    <div>
                      {/* Media Header */}
                      <div className="relative h-52 overflow-hidden bg-slate-950 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
                            <Icon className="w-12 h-12 text-accent mb-2" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Video Initiative</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="text-xs font-semibold text-accent mb-3">
                          {item.subtitle}
                        </div>
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {item.videoUrl && (
                      <div className="px-6 pb-6 pt-2">
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-primary transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Initiative Video</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Policy Governance Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Governance</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              CSR Policy Framework & Objectives
            </h2>
            <p className="text-slate-300 text-base font-light">
              Guided by statutory mandates and a deep-rooted corporate ethos of empathy, sustainable growth, and societal value creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {policyPillars.map((pillar, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-accent font-extrabold text-2xl mb-2">0{idx + 1}</div>
                <h4 className="text-lg font-bold text-white mb-2">{pillar.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-slate-800/40 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Annual Statutory Disclosures</h4>
                <p className="text-xs text-slate-400">View detailed Annual Return filings, MGT-7, and compliance reports.</p>
              </div>
            </div>
            <Link href="/annual-return-policy">
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white font-bold gap-2">
                <span>View Annual Returns</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
