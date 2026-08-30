import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Building2, 
  Scale, 
  Lock, 
  Calendar, 
  ArrowRight, 
  Heart, 
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnnualReturnPolicy() {
  const filings = [
    {
      year: "FY 2023 - 2024",
      form: "Form MGT-7 / Annual Return",
      date: "Filed: September 2024",
      status: "Compliant & Verified",
      desc: "Annual Return of Elan Professional Appliances Pvt. Ltd. pursuant to Section 92(1) of the Companies Act, 2013 and Rule 11(1) of the Companies (Management and Administration) Rules, 2014."
    },
    {
      year: "FY 2022 - 2023",
      form: "Form MGT-7 / Annual Return",
      date: "Filed: September 2023",
      status: "Compliant & Verified",
      desc: "Annual Return containing detailed financial statements, board composition, shareholding pattern, and statutory disclosures for the financial year ended March 31, 2023."
    },
    {
      year: "FY 2021 - 2022",
      form: "Form MGT-7 / Annual Return",
      date: "Filed: September 2022",
      status: "Compliant & Verified",
      desc: "Annual Return and statutory audit report for the financial year ended March 31, 2022."
    },
    {
      year: "FY 2020 - 2021",
      form: "Form MGT-7 / Annual Return",
      date: "Filed: September 2021",
      status: "Compliant & Verified",
      desc: "Statutory filings and annual financial returns for the financial year ended March 31, 2021."
    }
  ];

  const corporateDetails = [
    { label: "Corporate Name", value: "Elan Professional Appliances Private Limited" },
    { label: "CIN (Corporate Identity No.)", value: "U29190DL2009PTC192994" },
    { label: "Date of Incorporation", value: "August 10, 2009" },
    { label: "Company Category / Class", value: "Company limited by shares / Non-govt company" },
    { label: "Registered Office", value: "C-95, KSSIDC Industrial Area, Mahadevapura, Bengaluru – 560048" },
    { label: "Corporate Headquarters", value: "802 Tower 2, DLF Corporate Greens, Sector 74A, Gurugram – 122004" }
  ];

  const governancePolicies = [
    {
      title: "Code of Conduct & Ethics",
      desc: "Sets the benchmark for integrity, anti-bribery, professional conduct, and regulatory compliance across all business units."
    },
    {
      title: "Whistle Blower & Vigil Mechanism",
      desc: "A secure and confidential channel for employees and stakeholders to report genuine concerns or ethical violations."
    },
    {
      title: "Related Party Transactions Policy",
      desc: "Ensures that all commercial transactions with related entities are conducted at arm's length and with board approval."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://elanpro.net/wp-content/uploads/2025/06/CSR-1.jpg"
            alt="Annual Return Policy"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Scale className="w-3.5 h-3.5" />
              <span>Statutory Compliance & Governance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Annual Return Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Corporate disclosures, Form MGT-7 statutory annual returns, and corporate governance transparency as mandated under the Companies Act, 2013.
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              <span>CSR Policy & Initiatives</span>
            </Link>
            <Link
              href="/annual-return-policy"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-accent text-white shadow-md"
            >
              <FileText className="w-4 h-4" />
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

      {/* Statutory Disclosure Mandate */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <FadeIn direction="right">
                <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Statutory Mandate</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
                  Section 92(3) &amp; Section 134(3)(a) Disclosures
                </h2>
                <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                  <p>
                    Pursuant to Section 92(3) of the <strong>Companies Act, 2013</strong> read with Rule 12 of the Companies (Management and Administration) Rules, 2014, a copy of the Annual Return in Form MGT-7 is hosted here for public access and stakeholder transparency.
                  </p>
                  <p>
                    Elan Professional Appliances Private Limited adheres strictly to the highest standards of corporate governance, timely MCA filings, audited balance sheets, and transparent operational reporting across all financial cycles.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>MCA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Form MGT-7 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Audited Financial Statements</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-5">
              <FadeIn direction="left">
                <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold">Corporate Identity</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    {corporateDetails.map((item, idx) => (
                      <div key={idx} className="pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                        <div className="text-slate-400 font-medium mb-1">{item.label}</div>
                        <div className="text-slate-200 font-bold text-sm leading-snug">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Filings Repository */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-2 block">Filings Archive</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Annual Return Records (Form MGT-7)
              </h2>
              <p className="text-slate-600 text-base">
                Official statutory returns filed with the Registrar of Companies (RoC), Ministry of Corporate Affairs, Government of India.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filings.map((f, idx) => (
              <StaggerItem key={idx}>
                <div className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {f.year}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{f.status}</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {f.form}
                        </h3>
                        <div className="text-xs text-slate-400 mt-0.5">{f.date}</div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Official RoC Filing Document</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full gap-1.5 text-xs font-bold border-slate-300 hover:border-accent hover:text-accent"
                      onClick={() => alert(`Annual Return for ${f.year} is filed with MCA under Form MGT-7.`)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Corporate Governance Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Integrity</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Governance &amp; Ethical Policies
            </h2>
            <p className="text-slate-300 text-base font-light">
              We hold ourselves to rigorous standards of corporate governance, business ethics, and transparent financial conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {governancePolicies.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
