import React, { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { BLOG_POSTS } from "@/data/blogData";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  Check, 
  Sparkles, 
  Building2, 
  ChevronRight,
  HelpCircle,
  ExternalLink,
  PhoneCall,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [, mediaParams] = useRoute("/media-blogs/:slug");
  const slug = params?.slug || mediaParams?.slug;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const post = BLOG_POSTS.find((b) => b.slug === slug) || BLOG_POSTS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this commercial refrigeration guide: "${post.title}" - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${post.title} via @ElanproIndia`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const relatedPosts = BLOG_POSTS.filter((b) => b.id !== post.id).slice(0, 3);

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative pt-32 pb-16 md:pb-20 bg-slate-950 text-white overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0284c7]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
          <FadeIn>
            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <Link href="/media-blogs" className="hover:text-white transition-colors">Media &amp; Blogs</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-sky-400 font-medium truncate max-w-xs">{post.title}</span>
            </div>

            {/* Category & Read Time */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.date}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.readTime}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author Strip & Share Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  EP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none mb-1">
                    {post.author}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {post.authorRole}
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share:
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-8 h-8 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <span className="text-xs font-bold">WA</span>
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="w-8 h-8 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <span className="text-xs font-bold">in</span>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Share on X / Twitter"
                >
                  <span className="text-xs font-bold">𝕏</span>
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Body */}
      <div className="py-12 bg-white text-slate-900">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          
          {/* Featured Cover Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 mb-12 -mt-10 md:-mt-14 relative z-20 bg-slate-950 max-h-[460px]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover max-h-[460px]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Article Content (8 Cols) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Key Takeaways Box */}
              {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                <div className="p-6 md:p-8 rounded-3xl bg-sky-50/70 border border-sky-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Executive Summary &amp; Key Takeaways</span>
                  </div>
                  <ul className="space-y-2.5">
                    {post.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Article Content Sections */}
              <div className="space-y-8 text-slate-800">
                {post.sections && post.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 tracking-tight pt-2 border-b border-slate-100 pb-2">
                      {sec.heading}
                    </h2>
                    <div className="text-sm md:text-base text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section if available */}
              {post.faq && post.faq.length > 0 && (
                <div className="pt-8 border-t border-slate-200 space-y-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      Frequently Asked Questions
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {post.faq.map((faqItem, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {faqItem.q}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                          {faqItem.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Biography Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xl shrink-0">
                  EP
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Published by {post.author}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Elanpro is India's premier commercial refrigeration specialist, delivering tailored cooling solutions for hospitality, food retail, healthcare, and cold chain logistics.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-sky-400 font-semibold">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO 9001:2015 Certified</span>
                    <span>•</span>
                    <span>560+ Service Network</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Consultation / Product Action Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
                <span className="text-[11px] font-mono uppercase font-bold text-sky-400 tracking-wider block">
                  Commercial Equipment Solution
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Need customized cooling equipment for your venue?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consult with an Elanpro cooling engineer to size the exact refrigeration capacity, energy rating, and floorplan fit for your project.
                </p>
                <div className="pt-2 space-y-2">
                  <Button asChild className="w-full rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-bold py-5 shadow-lg shadow-accent/25">
                    <Link href="/contact">
                      <PhoneCall className="w-3.5 h-3.5 mr-2" />
                      <span>Request Equipment Consultation</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs font-bold py-5">
                    <Link href="/catalogues">
                      <FileText className="w-3.5 h-3.5 mr-2 text-sky-400" />
                      <span>Explore Product Catalogues</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Related Category Quick Links */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Explore Category
                </span>
                <Link
                  href="/categories"
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-primary flex items-center justify-between text-xs font-bold text-slate-900 transition-colors group"
                >
                  <span>{post.relatedCategory || "Commercial Kitchen Solutions"}</span>
                  <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Back to All Articles */}
              <div>
                <Button asChild variant="ghost" className="w-full justify-start text-xs font-bold text-slate-600 hover:text-primary gap-2">
                  <Link href="/media-blogs">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Media &amp; Blogs</span>
                  </Link>
                </Button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Related Articles Bottom Grid */}
      <div className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Keep Reading</span>
              <h3 className="text-2xl font-display font-bold text-slate-900">
                Related Articles &amp; Buying Guides
              </h3>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold">
              <Link href="/media-blogs">
                <span>View All ({BLOG_POSTS.length})</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((r) => (
              <div 
                key={r.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-slate-950">
                    <img 
                      src={r.coverImage} 
                      alt={r.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-slate-400 block mb-1 font-mono">{r.date} • {r.readTime}</span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {r.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs font-bold text-primary p-0 h-auto hover:bg-transparent">
                    <Link href={`/blog/${r.slug}`}>
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
