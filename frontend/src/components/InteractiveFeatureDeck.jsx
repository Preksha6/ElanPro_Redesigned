import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, ThermometerSnowflake, Clock, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    id: '01',
    title: 'Unmatched Reliability',
    desc: 'Engineered for harsh environments, erratic power supplies, and peak-hour stresses. We minimize your downtime so you can maximize your revenue.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1000&q=80',
    hasCta: true
  },
  {
    id: '02',
    title: 'Energy Efficient',
    desc: 'Advanced compressors and thick-wall insulation technologies that drastically cut down your operational utility costs.',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1000&q=80',
    hasCta: false
  },
  {
    id: '03',
    title: 'Precision Cooling',
    desc: 'Microprocessor-controlled thermostats guarantee exact temperature maintenance without harmful fluctuations.',
    icon: ThermometerSnowflake,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&q=80',
    hasCta: false
  },
  {
    id: '04',
    title: '24/7 Pan-India Support',
    desc: 'Our massive, highly-trained service network ensures that expert help is always just a phone call away, anywhere in India.',
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1000&q=80',
    hasCta: false
  }
];

// Card Animation Variants
const cardVariants = {
  // The custom parameter will be { state, sideDirection }
  // state can be 'active', 'stacked-1', 'stacked-2', 'stacked-3', 'side'
  animate: ({ state, sideDirection, index }) => {
    // Determine responsive slide distance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const sideX = isMobile ? 180 : 500; // X offset for side cards
    const sideScale = isMobile ? 0.3 : 0.45; // Scale down so they are fully visible
    
    if (state === 'side') {
      const sign = sideDirection === 'left' ? -1 : 1;
      // Stagger the Y position slightly if there are multiple cards on the same side
      const yOffset = index > 1 ? 40 : 0; 
      return {
        x: sign * sideX,
        y: yOffset,
        scale: sideScale,
        rotate: sign * -4,
        zIndex: 10,
        opacity: 0.9,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } // Smooth Apple-like easing
      };
    }

    if (state === 'active') {
      return {
        x: 0, y: 0, scale: 1, zIndex: 40, opacity: 1, rotate: 0,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      };
    }
    
    // Stacked positions
    if (state === 'stacked-1') {
      return {
        x: 0, y: 18, scale: 0.96, zIndex: 30, opacity: 0.85, rotate: 0,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      };
    }
    if (state === 'stacked-2') {
      return {
        x: 0, y: 36, scale: 0.92, zIndex: 20, opacity: 0.7, rotate: 0,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      };
    }
    if (state === 'stacked-3') {
      return {
        x: 0, y: 54, scale: 0.88, zIndex: 10, opacity: 0.5, rotate: 0,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
      };
    }
  }
};

export default function InteractiveFeatureDeck() {
  const [activeCard, setActiveCard] = useState(0);

  const advanceCard = (targetIndex) => {
    if (targetIndex === activeCard) {
      // If clicking the front card, advance to next
      setActiveCard((prev) => (prev + 1) % FEATURES.length);
    } else {
      // If clicking a side/back card, bring it to front
      setActiveCard(targetIndex);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 overflow-hidden">
      
      {/* Deck Container */}
      <div className="relative w-full max-w-[1000px] h-[550px] md:h-[600px] flex justify-center perspective-1000">
        
        {FEATURES.map((feature, index) => {
          let state = 'stacked-3';
          let sideDirection = 'left';
          
          if (index === activeCard) {
            state = 'active';
          } else if (index < activeCard) {
            state = 'side';
            // Even indexes go left, odd go right
            sideDirection = index % 2 === 0 ? 'left' : 'right';
          } else {
            // index > activeCard (Stacked behind)
            const stackDepth = index - activeCard;
            state = `stacked-${stackDepth}`;
          }

          // But what if activeCard wraps around to 0? 
          // If activeCard is 0, ALL other cards are > activeCard, so they all snap to the stack.
          // This perfectly resets the deck.

          return (
            <motion.div
              key={feature.id}
              custom={{ state, sideDirection, index }}
              variants={cardVariants}
              initial={false} // Don't animate on initial mount
              animate="animate"
              onClick={() => advanceCard(index)}
              className="absolute top-0 w-[90%] md:w-[85%] h-[450px] md:h-[500px] rounded-3xl shadow-2xl cursor-pointer overflow-hidden border border-white/10 group"
              style={{ originX: 0.5, originY: 0.5, willChange: "transform, opacity" }}
            >
              
              {/* Background Image */}
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                draggable="false"
              />
              
              {/* Dark Gradient Overlay for readability (Navy/Blue theme) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-900/80 to-slate-800/40" />
              
              {/* Performant Blue Accent (Replaced expensive blur-[100px] and mix-blend-mode) */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-[radial-gradient(circle,_rgba(59,130,246,0.15)_0%,_transparent_70%)] rounded-full pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col text-white">
                
                {/* Header (Icon + Number) */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-500">
                    <feature.icon className="w-7 h-7 text-blue-300" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-white/30 tracking-widest">{feature.id}</span>
                </div>

                {/* Typography */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 drop-shadow-md">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mb-8 flex-grow">
                  {feature.desc}
                </p>

                {/* Optional CTA */}
                {feature.hasCta && (
                  <div className="inline-flex items-center text-blue-300 font-bold text-lg md:text-xl mt-auto">
                    Explore our technology <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center gap-6 mt-8">
        <div className="flex gap-2">
          {FEATURES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${idx === activeCard ? 'w-8 bg-blue-500' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>
        <span className="text-slate-500 font-bold tracking-widest text-sm">
          0{activeCard + 1} / 0{FEATURES.length}
        </span>
      </div>

    </div>
  );
}
