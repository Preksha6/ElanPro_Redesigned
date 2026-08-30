import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Camera, 
  Tv, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  FileText, 
  Maximize2,
  Building2,
  Calendar,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryImages = [
    {
      id: 1,
      title: "Elanpro Pavilion at Aahar International Expo",
      category: "expos",
      categoryLabel: "Expos & Trade Shows",
      location: "Pragati Maidan, New Delhi",
      date: "March 2024",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748400-1.jpg",
      aspect: "landscape"
    },
    {
      id: 2,
      title: "Smart Inverter & Blast Chiller Showcase",
      category: "expos",
      categoryLabel: "Expos & Trade Shows",
      location: "Aahar Expo Arena",
      date: "March 2024",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748950.jpg",
      aspect: "landscape"
    },
    {
      id: 3,
      title: "Confectionery Display & Cake Counters Experience",
      category: "showrooms",
      categoryLabel: "Experience Centers",
      location: "Gurugram Experience Hub",
      date: "January 2024",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748337.jpg",
      aspect: "landscape"
    },
    {
      id: 4,
      title: "Live Culinary Masterclass & Chef Demonstrations",
      category: "expos",
      categoryLabel: "Expos & Trade Shows",
      location: "Aahar Master Stage",
      date: "March 2024",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748511.jpg",
      aspect: "landscape"
    },
    {
      id: 5,
      title: "Executive Leadership & Partner Meet",
      category: "events",
      categoryLabel: "Corporate Events",
      location: "DLF Corporate Greens, Gurugram",
      date: "December 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748669.jpg",
      aspect: "landscape"
    },
    {
      id: 6,
      title: "Commercial Kitchen Lineup & Chef Consultations",
      category: "showrooms",
      categoryLabel: "Experience Centers",
      location: "Mumbai Flagship Center",
      date: "November 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748152.jpg",
      aspect: "landscape"
    },
    {
      id: 7,
      title: "Beverage Coolers & Draft Dispenser Walkthrough",
      category: "expos",
      categoryLabel: "Expos & Trade Shows",
      location: "Hospitality Biz Summit",
      date: "October 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748611.jpg",
      aspect: "landscape"
    },
    {
      id: 8,
      title: "Industry Excellence & Technical Leadership Award",
      category: "events",
      categoryLabel: "Corporate Events",
      location: "National Cold Chain Conclave",
      date: "September 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748894.jpg",
      aspect: "landscape"
    },
    {
      id: 9,
      title: "Biomedical & Lab Cold Storage Unveiling",
      category: "showrooms",
      categoryLabel: "Experience Centers",
      location: "Bengaluru Tech Park",
      date: "August 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748121.jpg",
      aspect: "landscape"
    },
    {
      id: 10,
      title: "Cold Chain Logistics & Green Refrigeration Milestone",
      category: "events",
      categoryLabel: "Corporate Events",
      location: "Corporate Headquarters",
      date: "July 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/A748719.jpg",
      aspect: "portrait"
    },
    {
      id: 11,
      title: "Assam Skill Development Centre – Commercial Refrigeration Training",
      category: "csr",
      categoryLabel: "CSR & Community",
      location: "Guwahati, Assam",
      date: "November 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-01-at-9.55.23-AM.jpeg",
      aspect: "landscape"
    },
    {
      id: 12,
      title: "Digital IT Lab Inauguration at Jabalpur Girls College",
      category: "csr",
      categoryLabel: "CSR & Community",
      location: "Jabalpur, Madhya Pradesh",
      date: "June 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/Girls-College.jpg",
      aspect: "landscape"
    },
    {
      id: 13,
      title: "Emergency Ambulance Support for Earth Savior Foundation",
      category: "csr",
      categoryLabel: "CSR & Community",
      location: "Gurugram, Haryana",
      date: "June 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/Earth-Saviour-Foundation.jpeg",
      aspect: "landscape"
    },
    {
      id: 14,
      title: "Children's Digital Learning Support at Rainbow Homes",
      category: "csr",
      categoryLabel: "CSR & Community",
      location: "New Delhi",
      date: "May 2023",
      src: "https://elanpro.net/wp-content/uploads/2025/06/Rainbow_Homes_give.jpg",
      aspect: "landscape"
    }
  ];

  const videoTours = [
    {
      title: "Aahar International Expo – Official Elanpro Pavilion Walkthrough",
      embedId: "b37yMR9czws",
      desc: "Immersive tour of our massive multi-zone exhibition showcase featuring live blast chillers, smart glass retail multidecks, and commercial prep counters."
    },
    {
      title: "Commercial Refrigeration Innovation & Product Demos",
      embedId: "Of-Tb9fGKcs",
      desc: "Hands-on walkaround highlighting our anti-fog glass technology, digital controller diagnostics, and whisper-quiet BLDC inverter compressors."
    },
    {
      title: "Cold Chain Masterclass & Technical Engineering",
      embedId: "A95dz9D250s",
      desc: "Comprehensive masterclass on optimal temperature preservation, food safety compliance (HACCP), and eco-friendly R290 refrigerants."
    },
    {
      title: "Pan-India Customer Support & Service Infrastructure",
      embedId: "80-edJz2gSw",
      desc: "Behind-the-scenes look at our 300+ nationwide authorized service centers and rapid AMC response fleet."
    },
    {
      title: "Executive Vision: Pioneering Commercial Refrigeration in India",
      embedId: "32NN5osRVOw",
      desc: "Leadership interview discussing Elanpro’s expansion across Tier 1, 2, and 3 hospitality hubs and emerging food retail corridors."
    },
    {
      title: "Eco-Friendly Future: Variable Speed Inverter Tech",
      embedId: "K8ku8TVIhbg",
      desc: "Deep-dive into reducing operational power bills by up to 40% with next-generation intelligent inverter cooling systems."
    }
  ];

  const filteredImages = galleryImages.filter((img) => {
    if (activeFilter === "all") return true;
    return img.category === activeFilter;
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://elanpro.net/wp-content/uploads/2025/06/Gallery.jpg"
            alt="Elanpro Gallery"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
              <Camera className="w-3.5 h-3.5" />
              <span>Media &amp; Events Showcase</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Event &amp; Media Gallery
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Glimpses from international trade expos, experience center launches, culinary masterclasses, and community impact initiatives across India.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* CSR & Media Secondary Tab Nav */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-[56px] md:top-[64px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center overflow-x-auto py-2.5 scrollbar-none gap-2">
            <Link
              href="/csr-policy"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              <span>CSR Policy</span>
            </Link>
            <Link
              href="/annual-return-policy"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Annual Returns</span>
            </Link>
            <Link
              href="/media-blogs"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>Media &amp; Blogs</span>
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-accent text-white shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Highlights ({galleryImages.length})
            </button>
            <button
              onClick={() => setActiveFilter("expos")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "expos"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Expos &amp; Trade Shows
            </button>
            <button
              onClick={() => setActiveFilter("showrooms")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "showrooms"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Experience Centers
            </button>
            <button
              onClick={() => setActiveFilter("events")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "events"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Corporate &amp; Awards
            </button>
            <button
              onClick={() => setActiveFilter("csr")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "csr"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              CSR &amp; Community
            </button>
          </div>
        </div>
      </section>

      {/* Photography Masonry Grid */}
      <section className="py-16 bg-slate-50/60">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            key={`gallery-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
              >
                <div 
                  onClick={() => openLightbox(idx)}
                  className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer h-72"
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      {img.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-base font-bold leading-snug group-hover:text-accent transition-colors">
                      {img.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-accent" />
                        <span>{img.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{img.date}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Keynotes & Expo Walkthroughs */}
      <section className="py-20 bg-background border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">
                Video Documentaries
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                Featured Expo Highlights &amp; Keynotes
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@elanprogroup/videos"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-primary transition-colors"
            >
              <span>Explore YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTours.map((vid, idx) => (
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
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {vid.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual 360° Tours Banner */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Experience Elanpro in Virtual 360°</h2>
          <p className="text-slate-300 text-xs md:text-sm mb-8 leading-relaxed">
            Can't make it in person? Take an interactive 3D virtual walkthrough of our flagship Aahar Expo exhibition pavilion and our corporate headquarters experience center.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://tours.view360degrees.com/Elan-aahar/" target="_blank" rel="noreferrer">
              <Button size="lg" className="rounded-full px-8 font-bold bg-accent hover:bg-accent/90 text-white gap-2">
                <span>Aahar Expo 360° Tour</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <a href="https://tours.view360degrees.com/Elanpro%20Office/" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-white/30 text-white hover:bg-white/10 gap-2">
                <span>Corporate Office 360° Tour</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
              className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-4 text-white">
              <span className="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                {filteredImages[lightboxIndex].categoryLabel}
              </span>
              <h3 className="text-lg md:text-xl font-bold font-display">
                {filteredImages[lightboxIndex].title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {filteredImages[lightboxIndex].location} • {filteredImages[lightboxIndex].date} ({lightboxIndex + 1} of {filteredImages.length})
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
