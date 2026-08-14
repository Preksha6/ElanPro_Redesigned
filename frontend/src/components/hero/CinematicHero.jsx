import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, MousePointer2 } from 'lucide-react';

export default function CinematicHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Parallax Zoom on Scroll
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 800], [1, 1.25]);

  return (
    <div className="sticky top-0 w-full aspect-video bg-black overflow-hidden z-0">
      {/* Background Video with Fade-in and Scroll Zoom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ scale }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source src="/assets/background_video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Simulated Auto-Click Animation Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          
          {/* Play Button */}
          <motion.div
            animate={{ 
              scale: [0.5, 1, 1, 0.9, 1.3, 0.5],
              opacity: [0, 1, 1, 1, 0, 0]
            }}
            transition={{ 
              duration: 3, 
              times: [0, 0.2, 0.6, 0.7, 0.85, 1],
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl relative"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </motion.div>

          {/* Mouse Pointer */}
          <motion.div
            initial={{ x: 200, y: 200, opacity: 0 }}
            animate={{
              x: [200, 200, 0, 0, 0, 0],
              y: [200, 200, 0, 0, 0, 0],
              scale: [1, 1, 1, 0.8, 1, 1],
              opacity: [0, 0, 1, 1, 0, 0]
            }}
            transition={{
              duration: 3,
              times: [0, 0.1, 0.6, 0.7, 0.85, 1],
              ease: "easeInOut"
            }}
            onAnimationComplete={() => {
              setIsPlaying(true);
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
            className="absolute"
            style={{ marginLeft: '30px', marginTop: '30px' }} // Offset pointer tip to center of button
          >
            <MousePointer2 className="w-10 h-10 text-white drop-shadow-xl" fill="#0f172a" />
          </motion.div>
        </div>
      )}
      
      {/* Subtle overlay gradient so the transparent white navbar links remain readable */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-transparent to-transparent pointer-events-none" 
      />
    </div>
  );
}
