import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, ExternalLink } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

export const OFFICIAL_ELANPRO_VIDEOS = [
  {
    id: 'VVkrKwisi1o',
    title: 'Why Professionals Trust Elanpro for Commercial Kitchens',
    desc: 'Heavy-duty performance and 24/7 cooling reliability for high-demand kitchens.',
    category: 'Kitchens',
    tag: 'Why Choose Us'
  },
  {
    id: 'K8ku8TVIhbg',
    title: 'Refrigeration, Reimagined: The New Elanpro Experience',
    desc: 'Next-gen cooling architectures and eco-friendly R290 green refrigeration.',
    category: 'Innovation',
    tag: 'Brand Story'
  },
  {
    id: 'DQgiARBKRfM',
    title: 'Commercial Refrigeration Equipment Range | Chill with Elan',
    desc: 'Complete portfolio of reach-in chillers, blast freezers, and display cases.',
    category: 'Products',
    tag: 'Equipment'
  },
  {
    id: 'fRxrRTcYfIo',
    title: 'Modern Retail & Supermarket Refrigeration Makeover',
    desc: 'High-visibility island freezers and visi-coolers maximizing retail sales.',
    category: 'Retail',
    tag: 'Supermarket'
  },
  {
    id: 'pUQoZ5lOo_w',
    title: 'Elanpro Back Bars: Precision Cooling for Every Serve',
    desc: 'Sleek under-counter bottle coolers and draft systems for bars and cafes.',
    category: 'Beverage',
    tag: 'Bar Cooling'
  },
  {
    id: 'p7_19dU7iXc',
    title: 'Customer Testimonials & Trusted Partnerships Nationwide',
    desc: 'Direct feedback from master chefs and restaurateurs who rely on Elanpro.',
    category: 'Trust',
    tag: 'Testimonials'
  }
];

export default function YouTubeVideoShowcase() {
  return (
    <section className="py-14 bg-white text-gray-900 relative overflow-hidden border-t border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-gray-900 mb-2.5">
              Why Industry Leaders <span className="text-primary">Choose Elanpro</span>
            </h2>
            
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Watch our commercial refrigeration technology in action across real commercial kitchens, supermarkets, and hospitality venues.
            </p>
          </FadeIn>
        </div>

        {/* Small 3x2 Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OFFICIAL_ELANPRO_VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group flex flex-col bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
            >
              {/* Compact Video Player Container */}
              <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover border-0"
                />


              </div>

              {/* Compact Card Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 bg-white">
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {video.tag}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {video.category}
                    </span>
                  </div>

                  <h3 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-1" title={video.title}>
                    {video.title}
                  </h3>

                  <p className="text-[11px] text-gray-500 leading-normal mt-1 line-clamp-2">
                    {video.desc}
                  </p>
                </div>

                {/* Compact Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-gray-400 font-medium">
                    @elanprogroup
                  </span>
                  
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-600" />
                    <span>Watch Audio</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
