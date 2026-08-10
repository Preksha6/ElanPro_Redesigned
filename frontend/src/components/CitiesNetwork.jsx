import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import mapData from '@svg-maps/india';

const CITIES = [
  { id: 'gurugram', name: 'Gurugram', region: 'North India', x: 186, y: 207, isOrigin: true },
  { id: 'delhi', name: 'Delhi', region: 'North India', x: 189, y: 203 },
  { id: 'chandigarh', name: 'Chandigarh', region: 'North India', x: 180, y: 152 },
  { id: 'dehradun', name: 'Dehradun', region: 'North India', x: 207, y: 162 },
  { id: 'jaipur', name: 'Jaipur', region: 'West India', x: 160, y: 244 },
  { id: 'lucknow', name: 'Lucknow', region: 'North India', x: 268, y: 246 },
  { id: 'kolkata', name: 'Kolkata', region: 'East India', x: 423, y: 348 },
  { id: 'ahmedabad', name: 'Ahmedabad', region: 'West India', x: 92, y: 338 },
  { id: 'bhopal', name: 'Bhopal', region: 'Central India', x: 194, y: 332 },
  { id: 'mumbai', name: 'Mumbai', region: 'West India', x: 99, y: 432 },
  { id: 'hyderabad', name: 'Hyderabad', region: 'South India', x: 216, y: 473 },
  { id: 'bengaluru', name: 'Bengaluru', region: 'South India', x: 197, y: 579 },
  { id: 'chennai', name: 'Chennai', region: 'South India', x: 253, y: 576 },
  { id: 'kochi', name: 'Kochi', region: 'South India', x: 170, y: 652 },
];

const CONNECTIONS = [
  { from: 'gurugram', to: 'mumbai' },
  { from: 'gurugram', to: 'kolkata' },
  { from: 'gurugram', to: 'bengaluru' },
  { from: 'gurugram', to: 'ahmedabad' },
  { from: 'mumbai', to: 'bengaluru' },
  { from: 'kolkata', to: 'hyderabad' },
  { from: 'hyderabad', to: 'chennai' },
  { from: 'bengaluru', to: 'kochi' },
];

function AnimatedCounter({ value, duration = 2, delay = 0, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration, delay, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => setDisplayValue(latest));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, delay, count, rounded]);

  return <span>{displayValue}{suffix}</span>;
}

export default function CitiesNetwork() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const [hoveredCity, setHoveredCity] = useState(null);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden flex flex-col items-center"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(240,244,248,1)_0%,_rgba(255,255,255,1)_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT COLUMN: Content & Metrics */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
          
          <div className="space-y-6">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-sm font-bold tracking-[0.2em] text-blue-600 uppercase"
            >
              Our Network
            </motion.p>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
            >
              150+ CITIES.<br />ONE CONNECTED NETWORK.
            </motion.h2>
            
            {/* Accent Line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="w-24 h-1.5 bg-blue-600 rounded-full"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed"
            >
              From major metros to emerging markets, our growing network supports businesses across India with precision cooling and 24/7 reliability.
            </motion.p>
          </div>

          {/* Metrics Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200"
          >
            <div>
              <div className="text-5xl font-black text-slate-900 mb-2">
                {isInView ? <AnimatedCounter value={150} delay={2.5} suffix="+" /> : "0+"}
              </div>
              <div className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Cities</div>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 mb-2">
                {isInView ? <AnimatedCounter value={31} delay={2.8} /> : "0"}
              </div>
              <div className="text-sm font-semibold text-slate-500 tracking-wider uppercase">States & UTs</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-bold text-blue-600 tracking-widest uppercase">Pan India Network</div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Interactive Map */}
        <div className="lg:col-span-7 relative flex justify-center items-center w-full min-h-[500px] lg:min-h-[700px]">
          
          <div className="relative w-full max-w-[600px] aspect-[612/696]">
            <svg
              viewBox={mapData.viewBox}
              className="w-full h-full drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 20px 40px rgba(15, 23, 42, 0.05))" }}
            >
              
              {/* 1. Map Outline Rendering */}
              <g className="map-states">
                {mapData.locations.map((location, i) => (
                  <motion.path
                    key={location.id}
                    d={location.path}
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0, fill: "#FFFFFF" }}
                    animate={isInView ? { 
                      pathLength: 1, 
                      opacity: 1,
                      fill: "#F1F5F9" 
                    } : {}}
                    transition={{ 
                      pathLength: { duration: 1.5, ease: "easeInOut" },
                      opacity: { duration: 0.5 },
                      fill: { duration: 1, delay: 1 }
                    }}
                  />
                ))}
              </g>

              {/* 2. Network Connections */}
              <g className="network-connections">
                {CONNECTIONS.map((conn, i) => {
                  const fromCity = CITIES.find(c => c.id === conn.from);
                  const toCity = CITIES.find(c => c.id === conn.to);
                  if (!fromCity || !toCity) return null;

                  return (
                    <motion.line
                      key={`${conn.from}-${conn.to}`}
                      x1={fromCity.x}
                      y1={fromCity.y}
                      x2={toCity.x}
                      y2={toCity.y}
                      stroke="#3B82F6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                      transition={{ 
                        duration: 1.5, 
                        delay: 1.5 + (i * 0.1), // Stagger lines after map draws
                        ease: "easeOut"
                      }}
                    />
                  );
                })}
              </g>

              {/* 3. City Markers */}
              {CITIES.map((city, i) => (
                <g 
                  key={city.id} 
                  className="city-marker cursor-pointer"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => setHoveredCity(city)}
                >
                  {/* Subtle Pulse for Origin */}
                  {city.isOrigin && (
                    <motion.circle
                      cx={city.x}
                      cy={city.y}
                      r="12"
                      fill="rgba(37, 99, 235, 0.2)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { 
                        scale: [1, 2.5, 1], 
                        opacity: [0.5, 0, 0.5] 
                      } : {}}
                      transition={{ 
                        duration: 3, 
                        delay: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Marker Dot */}
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={city.isOrigin ? "6" : "4.5"}
                    fill="#1E40AF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    whileHover={{ scale: 1.5 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: city.isOrigin ? 1.2 : 2.5 + (i * 0.05) // Origin first, others stagger later
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* HTML-based Tooltips for easy z-indexing over SVG */}
            {CITIES.map((city) => (
              <motion.div
                key={`tooltip-${city.id}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ 
                  opacity: hoveredCity?.id === city.id ? 1 : 0,
                  y: hoveredCity?.id === city.id ? 0 : 10,
                  scale: hoveredCity?.id === city.id ? 1 : 0.9,
                  pointerEvents: hoveredCity?.id === city.id ? 'auto' : 'none'
                }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 bg-slate-900 text-white py-2 px-4 rounded-xl shadow-xl border border-slate-700/50 backdrop-blur-md"
                // Using percentage coordinates mapping viewBox to absolute
                style={{ 
                  left: `${(city.x / 612) * 100}%`, 
                  top: `${(city.y / 696) * 100}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="font-bold text-sm whitespace-nowrap">{city.name}</div>
                <div className="text-xs text-blue-300 font-medium whitespace-nowrap">{city.region}</div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/50" />
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
