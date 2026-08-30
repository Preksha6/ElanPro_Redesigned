import React from "react";
import { Layout } from "@/components/layout/Layout";
import { AboutSubnav, AboutPagination } from "@/components/about/AboutSubnav";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  Users, 
  Award, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles,
  Wrench,
  Truck,
  Calculator,
  UtensilsCrossed,
  Layers
} from "lucide-react";

export default function OurManagement() {
  const directors = [
    {
      name: "Sanjay Jain",
      designation: "Director",
      bio: "A veteran of the Indian commercial refrigeration and HVAC ecosystem with over three decades of executive leadership. Sanjay has been the cornerstone of Elanpro's strategic corporate vision, institutional partnerships, and governance since foundation.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Sanjay-jain.png",
      expertise: "Strategic Direction • Institutional Governance • Corporate Vision"
    },
    {
      name: "Ranjan Jain",
      designation: "Managing Director",
      bio: "A visionary entrepreneur leading Elanpro's technology transformation, green cooling product innovation, brand evolution, and pan-India market expansion. Under his stewardship, Elanpro has evolved into India's premier B2B refrigeration brand.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/RANJAN-JAIN.png",
      expertise: "Product Innovation • Green Cooling Strategy • Brand Leadership"
    },
    {
      name: "Shashank Joshi",
      designation: "Director",
      bio: "Steering strategic operations, organizational expansion, and commercial excellence. Shashank plays a pivotal role in strengthening enterprise partnerships, business scalability, and long-term customer satisfaction across national accounts.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Shashank-jhosi.png",
      expertise: "Business Strategy • Operations Excellence • Market Development"
    }
  ];

  const leadershipTeam = [
    {
      name: "Anupam Kumar Mishra",
      designation: "AVP – Service, Tech and Training",
      bio: "Spearheading India's largest commercial refrigeration service network across 300+ touchpoints, ensuring 24-48 hr SLAs and gold-standard technical training.",
      image: "https://elanpro.net/wp-content/uploads/2026/07/Anupam-Kumar-Mishra.png",
      icon: Wrench
    },
    {
      name: "Vipin Sethi",
      designation: "National Business Head Horeca, Icold & KAM",
      bio: "Driving nationwide business growth across HoReCa, supermarket retail chains, Key Account Management (KAM), and customized food service refrigeration solutions.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Vipin-sethi.png",
      icon: UtensilsCrossed
    },
    {
      name: "Rahul Anand",
      designation: "Director – Icold",
      bio: "Leading the specialized Icold cold-room and industrial temperature-controlled warehousing wing with bespoke engineering and turnkey project execution.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Rahul-anand.png",
      icon: Layers
    },
    {
      name: "Ashok Pandey",
      designation: "Associate Vice President – Logistics & Projects",
      bio: "Overseeing seamless regional fulfillment centers, supply chain distribution, project execution, and express spare parts availability across India.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Ashok-Pandey.png",
      icon: Truck
    },
    {
      name: "Hariom Bansal",
      designation: "Head of Accounts & Commercial",
      bio: "Directing financial planning, commercial operations, fiscal governance, and audit compliance to ensure solid operational resilience.",
      image: "https://elanpro.net/wp-content/uploads/2025/07/Hariom-sir.png",
      icon: Calculator
    }
  ];

  const leadershipPrinciples = [
    { 
      title: "Empowerment & Agility", 
      desc: "Decentralized decision-making enabling on-ground engineering teams to solve customer challenges swiftly and effectively." 
    },
    { 
      title: "Customer-First DNA", 
      desc: "Every executive decision is calibrated against customer uptime, product reliability, and long-term partnership trust." 
    },
    { 
      title: "Sustainable Stewardship", 
      desc: "Championing natural eco-refrigerants and responsible corporate citizenship across India's growing cold chain." 
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2000&q=80"
            alt="Leadership Team"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Executive Leadership</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Our Management
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Meet the visionary leadership and executive team driving Elanpro's technological transformation, customer-first culture, and market excellence.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <AboutSubnav currentId="our-management" />

      {/* Board of Directors Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Executive Board</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Board of Directors
              </h2>
              <p className="text-slate-600 text-base">
                Bringing together decades of specialized commercial refrigeration engineering, brand building, and enterprise leadership.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {directors.map((director, idx) => (
              <StaggerItem key={idx}>
                <div className="h-full rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Picture Container with Gradient Background */}
                    <div className="relative h-80 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 flex items-end justify-center pt-6">
                      <img
                        src={director.image}
                        alt={director.name}
                        className="h-full w-auto object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-6 right-6 text-white">
                        <div className="text-2xl font-bold uppercase tracking-wide">{director.name}</div>
                        <div className="text-xs font-semibold text-accent uppercase tracking-wider">{director.designation}</div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {director.bio}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500">
                      {director.expertise}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Core Leadership Team Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Operational Leadership</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Our Core Leadership Team
              </h2>
              <p className="text-slate-600 text-base">
                Specialized leaders managing nationwide customer support, HoReCa business, cold chain warehousing, logistics, and commercial operations.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {leadershipTeam.map((leader, idx) => {
              const Icon = leader.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                    <div>
                      {/* Photo Container */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 flex items-end justify-center pt-4">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="h-full w-auto object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <div className="text-base font-bold uppercase leading-snug">{leader.name}</div>
                          <div className="text-[11px] font-semibold text-accent leading-tight mt-0.5">{leader.designation}</div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="p-5">
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {leader.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Leadership Culture & Values Banner */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Our Culture</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Leadership Philosophy
            </h2>
            <p className="text-slate-300 text-base font-light">
              Guided by principles of integrity, employee empowerment, and relentless customer advocacy across every refrigeration touchpoint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipPrinciples.map((lp, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-accent font-extrabold text-2xl mb-2">0{idx + 1}</div>
                <h4 className="text-lg font-bold text-white mb-2">{lp.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{lp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination to Next Page */}
      <AboutPagination currentId="our-management" />
    </Layout>
  );
}
