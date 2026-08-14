import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Real lat/lng coordinates for cities
const CITIES = [
  { id: 'gurugram', name: 'Gurugram', region: 'North India', lat: 28.4595, lng: 77.0266, isOrigin: true },
  { id: 'delhi', name: 'Delhi', region: 'North India', lat: 28.6139, lng: 77.2090 },
  { id: 'chandigarh', name: 'Chandigarh', region: 'North India', lat: 30.7333, lng: 76.7794 },
  { id: 'dehradun', name: 'Dehradun', region: 'North India', lat: 30.3165, lng: 78.0322 },
  { id: 'jaipur', name: 'Jaipur', region: 'West India', lat: 26.9124, lng: 75.7873 },
  { id: 'lucknow', name: 'Lucknow', region: 'North India', lat: 26.8467, lng: 80.9462 },
  { id: 'kolkata', name: 'Kolkata', region: 'East India', lat: 22.5726, lng: 88.3639 },
  { id: 'ahmedabad', name: 'Ahmedabad', region: 'West India', lat: 23.0225, lng: 72.5714 },
  { id: 'bhopal', name: 'Bhopal', region: 'Central India', lat: 23.2599, lng: 77.4126 },
  { id: 'mumbai', name: 'Mumbai', region: 'West India', lat: 19.0760, lng: 72.8777 },
  { id: 'hyderabad', name: 'Hyderabad', region: 'South India', lat: 17.3850, lng: 78.4867 },
  { id: 'bengaluru', name: 'Bengaluru', region: 'South India', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai', name: 'Chennai', region: 'South India', lat: 13.0827, lng: 80.2707 },
  { id: 'kochi', name: 'Kochi', region: 'South India', lat: 9.9312, lng: 76.2673 },
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

  // Helper to find city coordinates for polylines
  const getCityCoords = (cityId) => {
    const city = CITIES.find(c => c.id === cityId);
    return city ? [city.lat, city.lng] : [0, 0];
  };

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

        {/* RIGHT COLUMN: Interactive OpenStreetMap */}
        <div className="lg:col-span-7 relative flex items-center justify-center h-[500px] lg:h-[600px] w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative z-20 bg-slate-50"
          >
            {isInView && (
              <MapContainer 
                center={[22.5937, 78.9629]} 
                zoom={4} 
                scrollWheelZoom={false}
                className="w-full h-full"
                zoomControl={true}
              >
                {/* Clean, light OpenStreetMap theme */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Draw connections (polylines) */}
                {CONNECTIONS.map((conn, i) => (
                  <Polyline 
                    key={i}
                    positions={[getCityCoords(conn.from), getCityCoords(conn.to)]}
                    color="#2563eb"
                    weight={2}
                    opacity={0.5}
                    dashArray="5, 10"
                  />
                ))}

                {/* Draw cities (markers) */}
                {CITIES.map((city) => (
                  <Marker 
                    key={city.id} 
                    position={[city.lat, city.lng]}
                    eventHandlers={{
                      mouseover: () => setHoveredCity(city.id),
                      mouseout: () => setHoveredCity(null),
                    }}
                  >
                    <Popup className="font-sans">
                      <div className="text-sm">
                        <strong className="text-base text-slate-900">{city.name}</strong><br />
                        <span className="text-slate-500">{city.region}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </motion.div>
          
          {/* Decorative Elements around the map */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.05)_0%,_transparent_70%)] pointer-events-none z-0" />
        </div>
      </div>
    </section>
  );
}
