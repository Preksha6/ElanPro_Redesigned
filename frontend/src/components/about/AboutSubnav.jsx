import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  Target, 
  Milestone, 
  ShieldCheck, 
  Zap, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from "lucide-react";

export const ABOUT_PAGES = [
  {
    id: "company-overview",
    name: "Company Overview",
    path: "/company-overview",
    altPaths: ["/about/company-overview", "/about"],
    icon: Building2,
    shortDesc: "India's premier commercial refrigeration brand heritage"
  },
  {
    id: "mission-vision-values",
    name: "Mission, Vision, & Values",
    path: "/mission-vision-values",
    altPaths: ["/about/mission-vision-values"],
    icon: Target,
    shortDesc: "Our core principles, vision, and operational ethos"
  },
  {
    id: "our-journey",
    name: "Our Journey",
    path: "/our-journey",
    altPaths: ["/about/journey", "/about/our-journey"],
    icon: Milestone,
    shortDesc: "Milestones from foundation to nationwide leadership"
  },
  {
    id: "our-strength",
    name: "Our Strength",
    path: "/our-strength",
    altPaths: ["/about/strength", "/about/our-strength"],
    icon: ShieldCheck,
    shortDesc: "PAN-India service network, R&D, and engineering"
  },
  {
    id: "our-value-proposition",
    name: "Our Value Proposition",
    path: "/our-value-proposition",
    altPaths: ["/about/value-proposition", "/about/our-value-proposition"],
    icon: Zap,
    shortDesc: "TCO savings, customization, and certified reliability"
  },
  {
    id: "our-management",
    name: "Our Management",
    path: "/our-management",
    altPaths: ["/about/management", "/about/our-management"],
    icon: Users,
    shortDesc: "Visionary leadership driving Elanpro's global vision"
  }
];

export function AboutSubnav({ currentId }) {
  const [location] = useLocation();

  const isCurrent = (item) => {
    if (currentId) return item.id === currentId;
    return location === item.path || (item.altPaths && item.altPaths.includes(location));
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-[56px] md:top-[64px] z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center overflow-x-auto py-2.5 scrollbar-none gap-1.5 md:gap-2">
          {ABOUT_PAGES.map((page) => {
            const active = isCurrent(page);
            const Icon = page.icon;
            return (
              <Link
                key={page.id}
                href={page.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{page.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AboutPagination({ currentId }) {
  const currentIndex = ABOUT_PAGES.findIndex((p) => p.id === currentId);
  const prevPage = currentIndex > 0 ? ABOUT_PAGES[currentIndex - 1] : null;
  const nextPage = currentIndex < ABOUT_PAGES.length - 1 ? ABOUT_PAGES[currentIndex + 1] : null;

  return (
    <div className="py-16 bg-slate-900 border-t border-slate-800 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <span className="text-accent font-bold tracking-wider uppercase text-xs">Explore About Elanpro</span>
          <h3 className="text-2xl font-display font-bold text-white mt-1">Continue Learning Our Story</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {prevPage ? (
            <Link
              href={prevPage.path}
              className="group p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-accent/50 hover:bg-slate-800 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Previous Section</span>
                  <span className="text-base font-bold text-white group-hover:text-accent transition-colors">{prevPage.name}</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextPage ? (
            <Link
              href={nextPage.path}
              className="group p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-accent/50 hover:bg-slate-800 transition-all flex items-center justify-between text-right"
            >
              <div className="flex-1 mr-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Next Section</span>
                <span className="text-base font-bold text-white group-hover:text-accent transition-colors">{nextPage.name}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <Link
              href="/categories"
              className="group p-6 rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 hover:border-accent hover:bg-accent/30 transition-all flex items-center justify-between text-right"
            >
              <div className="flex-1 mr-4">
                <span className="text-xs text-slate-300 uppercase tracking-wider block">Ready to explore cooling?</span>
                <span className="text-base font-bold text-white">Browse Product Catalog</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
