import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  BookOpen, 
  Newspaper, 
  Tv, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Play, 
  Search,
  Filter,
  Heart,
  FileText,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/blogData";

export default function MediaBlogs() {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'blogs', 'news', 'videos'
  const [searchQuery, setSearchQuery] = useState("");

  const blogs = BLOG_POSTS;

  const newsClippings = [
    { title: "Elanpro Recognized for Cold Chain Innovation", img: "https://elanpro.net/wp-content/uploads/2025/06/news2.jpg", source: "Industry National Press" },
    { title: "Commercial Refrigeration Leader Expands Footprint", img: "https://elanpro.net/wp-content/uploads/2025/06/news8.jpg", source: "Business Standard" },
    { title: "Green Refrigeration & Inverter Launch Coverage", img: "https://elanpro.net/wp-content/uploads/2025/06/news8-1.jpg", source: "Hospitality Biz India" },
    { title: "Hospitality & QSR Vendor Leadership Award", img: "https://elanpro.net/wp-content/uploads/2025/06/news6.jpg", source: "Food Service India" },
    { title: "Biomedical & Life Sciences Cold Storage Rollout", img: "https://elanpro.net/wp-content/uploads/2025/06/news7.jpg", source: "Healthcare World" },
    { title: "Experience Center Inauguration in Key Metros", img: "https://elanpro.net/wp-content/uploads/2025/06/news11-min.jpg", source: "Retail Times" },
    { title: "Transforming Indian Food Retail with Smart Coolers", img: "https://elanpro.net/wp-content/uploads/2025/06/news3.jpg", source: "Economic Times" },
    { title: "Corporate Social Responsibility & Zero Food Waste", img: "https://elanpro.net/wp-content/uploads/2025/06/last.jpg", source: "CSR Chronicle" }
  ];

  const videoSpotlights = [
    {
      title: "Elanpro Aahar Expo Pavilion & Innovation Lineup",
      url: "https://youtu.be/bvbH_hqGbIg?si=HdQo7zfkwOzuJtz2",
      embedId: "bvbH_hqGbIg",
      desc: "Walkthrough of our flagship exhibition showcasing blast chillers, convection showcases, and IoT smart cooling."
    },
    {
      title: "Executive Leadership & Cold Chain Vision",
      url: "https://youtu.be/32NN5osRVOw?si=taojqxVvGAJFwBxL",
      embedId: "32NN5osRVOw",
      desc: "Interview on transforming commercial refrigeration efficiency across Tier 1, 2, and 3 Indian markets."
    },
    {
      title: "Smart Inverter & Eco-Refrigerant Technology",
      url: "https://youtu.be/K8ku8TVIhbg?si=yZGEAuD0WINupCLw",
      embedId: "K8ku8TVIhbg",
      desc: "Deep-dive into energy optimization with BLDC variable-speed inverter compressors and R290 coolants."
    },
    {
      title: "Customer Support, AMC, and Service Network",
      url: "https://youtu.be/80-edJz2gSw?si=Pd44jpmIGa22NkbW",
      embedId: "80-edJz2gSw",
      desc: "How Elanpro's 300+ service touchpoints maintain 99.8% operational uptime for commercial kitchens."
    }
  ];

  const filteredBlogs = blogs.filter((b) => {
    if (!searchQuery.trim()) return true;
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://elanpro.net/wp-content/uploads/2025/07/Media-Blogs-min.jpg"
            alt="Elanpro Media and Blogs"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insights & Press Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Media &amp; Blogs
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Explore the latest refrigeration industry insights, technical buying guides, national press features, and executive video spotlights.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Subnavigation Bar */}
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Annual Return Policy</span>
            </Link>
            <Link
              href="/media-blogs"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-accent text-white shadow-md"
            >
              <Sparkles className="w-4 h-4" />
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

      {/* Filter & Search Bar */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Updates
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "blogs"
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Articles & Blogs ({blogs.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("news")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "news"
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Press & News ({newsClippings.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "videos"
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Video Spotlights ({videoSpotlights.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="py-16 bg-background space-y-24">
        {/* Section 1: Articles & Blogs */}
        {(activeTab === "all" || activeTab === "blogs") && (
          <section className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-accent font-bold tracking-wider uppercase text-xs mb-1 block">Expert Insights</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                  Latest Articles &amp; Buying Guides
                </h2>
              </div>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((b) => (
                <StaggerItem key={b.id}>
                  <div className="h-full rounded-3xl bg-white border border-slate-200/80 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                    <div>
                      {/* Image */}
                      <Link href={`/blog/${b.slug}`} className="block relative h-48 overflow-hidden bg-slate-950">
                        <img
                          src={b.coverImage || b.image}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                            {b.category}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{b.date}</span>
                          </span>
                          <span>•</span>
                          <span>{b.readTime}</span>
                        </div>

                        <Link href={`/blog/${b.slug}`}>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">
                            {b.title}
                          </h3>
                        </Link>

                        <p className="text-slate-600 text-xs leading-relaxed">
                          {b.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* Section 2: Press & Media Clippings */}
        {(activeTab === "all" || activeTab === "news") && (
          <section className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-accent font-bold tracking-wider uppercase text-xs mb-1 block">In The News</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                Press Coverage &amp; Media Highlights
              </h2>
              <p className="text-slate-600 text-xs md:text-sm">
                Featured coverage in India's leading business publications, retail journals, and hospitality media.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newsClippings.map((item, idx) => (
                <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-bold text-accent uppercase tracking-wider">{item.source}</div>
                      <div className="text-xs font-bold leading-tight mt-0.5 line-clamp-2">{item.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Video Spotlights */}
        {(activeTab === "all" || activeTab === "videos") && (
          <section className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-accent font-bold tracking-wider uppercase text-xs mb-1 block">Video Spotlights</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                  Featured Keynotes &amp; Exhibition Tours
                </h2>
              </div>
              <a
                href="https://www.youtube.com/@elanprogroup/videos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-primary transition-colors"
              >
                <span>View YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoSpotlights.map((vid, idx) => (
                <div key={idx} className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid.embedId}`}
                      title={vid.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {vid.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {vid.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Box */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-display font-bold mb-4">Stay Connected with Elanpro</h2>
          <p className="text-slate-300 text-sm mb-8">
            Follow our official social media channels for real-time announcements, product releases, and hospitality industry masterclasses.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://www.youtube.com/@elanprogroup" target="_blank" rel="noreferrer">
              <Button size="lg" className="rounded-full px-8 font-bold bg-accent hover:bg-accent/90 text-white">
                Visit YouTube Channel
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-white/30 text-white hover:bg-white/10">
                Media Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
