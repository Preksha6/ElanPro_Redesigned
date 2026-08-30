import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Building2, 
  Phone, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw,
  Navigation
} from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

export const NETWORK_HUBS = [
  {
    id: 'gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    role: 'Corporate Headquarters & Experience Center',
    isHQ: true,
    partners: '45+ Partners',
    sla: '< 2 Hours',
    lat: 28.4239,
    lon: 76.9934,
    address: '802, 8th Floor, Tower-2, DLF Corporate Greens, Sector 74A, Gurugram, Haryana - 122004',
    phone: '+91 124 466 7700',
    directionsUrl: 'https://maps.google.com/?q=DLF+Corporate+Greens+Sector+74A+Gurugram'
  },
  {
    id: 'delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    role: 'North Distribution Hub & Parts Depot',
    isHQ: false,
    partners: '55+ Partners',
    sla: '< 2 Hours',
    lat: 28.5355,
    lon: 77.2732,
    address: 'Okhla Industrial Area Phase-III, New Delhi - 110020',
    phone: '+91 11 4100 8800',
    directionsUrl: 'https://maps.google.com/?q=Okhla+Phase+III+New+Delhi'
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    role: 'Western Regional Headquarters',
    isHQ: false,
    partners: '65+ Partners',
    sla: '< 2 Hours',
    lat: 19.1176,
    lon: 72.8681,
    address: 'Unit 401, Technopolis Knowledge Park, Andheri East, Mumbai - 400093',
    phone: '+91 22 6123 4500',
    directionsUrl: 'https://maps.google.com/?q=Technopolis+Knowledge+Park+Andheri+East+Mumbai'
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    role: 'Southern Regional Headquarters',
    isHQ: false,
    partners: '60+ Partners',
    sla: '< 2 Hours',
    lat: 12.9716,
    lon: 77.6080,
    address: 'Brigade Towers, 135 Brigade Road, Bengaluru - 560025',
    phone: '+91 80 4155 9900',
    directionsUrl: 'https://maps.google.com/?q=Brigade+Road+Bengaluru'
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    role: 'Dedicated Experience Centre',
    isHQ: false,
    partners: '48+ Partners',
    sla: '< 2 Hours',
    lat: 17.4483,
    lon: 78.3915,
    address: 'Plot No. 12, VIP Hills, Madhapur, HITEC City Main Road, Hyderabad - 500081',
    phone: '+91 40 4852 3300',
    directionsUrl: 'https://maps.google.com/?q=Madhapur+HITEC+City+Hyderabad'
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    role: 'Eastern Regional Headquarters',
    isHQ: false,
    partners: '45+ Partners',
    sla: '< 2.5 Hours',
    lat: 22.5804,
    lon: 88.4357,
    address: 'Godrej Genesis, Unit 602, Block EP & GP, Sector V, Salt Lake, Kolkata - 700091',
    phone: '+91 33 4008 7700',
    directionsUrl: 'https://maps.google.com/?q=Godrej+Genesis+Sector+V+Kolkata'
  },
  {
    id: 'chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    role: 'Tamil Nadu Regional Hub',
    isHQ: false,
    partners: '50+ Partners',
    sla: '< 2 Hours',
    lat: 13.0878,
    lon: 80.2885,
    address: 'Parry House, 3rd Floor, 43 Moore Street / Anna Salai, Chennai - 600001',
    phone: '+91 44 4211 6600',
    directionsUrl: 'https://maps.google.com/?q=George+Town+Chennai'
  },
  {
    id: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    role: 'Gujarat Regional Hub & Experience Center',
    isHQ: false,
    partners: '42+ Partners',
    sla: '< 2.5 Hours',
    lat: 23.0525,
    lon: 72.5122,
    address: 'Titanium Square, Thaltej Cross Roads, SG Highway, Ahmedabad - 380054',
    phone: '+91 79 4030 5500',
    directionsUrl: 'https://maps.google.com/?q=Titanium+Square+SG+Highway+Ahmedabad'
  },
  {
    id: 'pune',
    city: 'Pune',
    state: 'Maharashtra',
    role: 'Commercial Equipment Center',
    isHQ: false,
    partners: '34+ Partners',
    sla: '< 3 Hours',
    lat: 18.5529,
    lon: 73.9300,
    address: 'Magarpatta City & Viman Nagar Business Hub, Pune - 411028',
    phone: '+91 20 4122 3300',
    directionsUrl: 'https://maps.google.com/?q=Magarpatta+City+Pune'
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    role: 'Rajasthan Regional Hub',
    isHQ: false,
    partners: '32+ Partners',
    sla: '< 3 Hours',
    lat: 26.8289,
    lon: 75.8056,
    address: 'Sitapura Industrial Area, Tonk Road, Jaipur - 302022',
    phone: '+91 141 405 6600',
    directionsUrl: 'https://maps.google.com/?q=Sitapura+Industrial+Area+Jaipur'
  },
  {
    id: 'chandigarh',
    city: 'Chandigarh',
    state: 'Punjab / Haryana',
    role: 'Punjab & Tricity Regional Center',
    isHQ: false,
    partners: '28+ Partners',
    sla: '< 3 Hours',
    lat: 30.7046,
    lon: 76.7985,
    address: 'Plot No. 182, Industrial Area Phase II, Chandigarh - 160002',
    phone: '+91 172 450 8800',
    directionsUrl: 'https://maps.google.com/?q=Industrial+Area+Phase+II+Chandigarh'
  },
  {
    id: 'kochi',
    city: 'Kochi',
    state: 'Kerala',
    role: 'Kerala Central Distribution Hub',
    isHQ: false,
    partners: '30+ Partners',
    sla: '< 3 Hours',
    lat: 9.9312,
    lon: 76.2673,
    address: 'MG Road & Kalamassery Industrial Belt, Kochi, Kerala - 682016',
    phone: '+91 484 402 7700',
    directionsUrl: 'https://maps.google.com/?q=MG+Road+Kochi'
  },
  {
    id: 'guwahati',
    city: 'Guwahati',
    state: 'Assam',
    role: 'North-East 7-States Regional Support Hub',
    isHQ: false,
    partners: '22+ Partners',
    sla: '< 4 Hours',
    lat: 26.1445,
    lon: 91.7362,
    address: 'GS Road & Christian Basti, Guwahati, Assam - 781005',
    phone: '+91 361 246 8800',
    directionsUrl: 'https://maps.google.com/?q=GS+Road+Guwahati'
  },
  {
    id: 'indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    role: 'Central India Commercial Hub',
    isHQ: false,
    partners: '30+ Partners',
    sla: '< 3 Hours',
    lat: 22.7196,
    lon: 75.8577,
    address: 'Vijay Nagar & Sanwer Road, Indore, MP - 452010',
    phone: '+91 731 428 9900',
    directionsUrl: 'https://maps.google.com/?q=Vijay+Nagar+Indore'
  },
  {
    id: 'bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    role: 'Odisha Industrial Depot',
    isHQ: false,
    partners: '25+ Partners',
    sla: '< 3 Hours',
    lat: 20.2961,
    lon: 85.8245,
    address: 'Chandrasekharpur & Rasulgarh, Bhubaneswar - 751024',
    phone: '+91 674 258 7700',
    directionsUrl: 'https://maps.google.com/?q=Chandrasekharpur+Bhubaneswar'
  },
  {
    id: 'goa',
    city: 'Goa',
    state: 'Goa',
    role: 'Hospitality & Resort Support Center',
    isHQ: false,
    partners: '18+ Partners',
    sla: '< 3 Hours',
    lat: 15.4909,
    lon: 73.8278,
    address: 'EDC Complex, Patto Plaza, Panaji, Goa - 403001',
    phone: '+91 832 243 8800',
    directionsUrl: 'https://maps.google.com/?q=Patto+Plaza+Panaji+Goa'
  }
];

export default function CitiesNetwork() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [selectedLocation, setSelectedLocation] = useState(NETWORK_HUBS[0]);

  // Initialize OpenStreetMap via Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on India with clean controls (no attribution banner)
    const map = L.map(mapContainerRef.current, {
      center: [22.0, 79.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      scrollWheelZoom: false,
      attributionControl: false
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Create Custom Markers for ALL locations simultaneously
    NETWORK_HUBS.forEach((hub) => {
      const isHQ = hub.isHQ;
      
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isHQ ? `
              <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            ` : ''}
            <div style="
              width: ${isHQ ? '26px' : '20px'}; 
              height: ${isHQ ? '26px' : '20px'}; 
              border-radius: 50%; 
              background: ${isHQ ? '#f59e0b' : '#0284c7'}; 
              border: 2px solid #ffffff; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: ${isHQ ? '11px' : '9px'};
              font-weight: 800;
            ">
              ${isHQ ? '★' : '•'}
            </div>
            <div style="
              position: absolute;
              bottom: -18px;
              white-space: nowrap;
              font-size: 10px;
              font-weight: 700;
              color: #0f172a;
              background: rgba(255, 255, 255, 0.95);
              padding: 1px 5px;
              border-radius: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              pointer-events: none;
            ">
              ${hub.city}
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([hub.lat, hub.lon], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedLocation(hub);
        map.flyTo([hub.lat, hub.lon], 9, { duration: 1.2 });
      });

      markersRef.current[hub.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectLocation = (hub) => {
    setSelectedLocation(hub);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hub.lat, hub.lon], 9, { duration: 1.2 });
    }
  };

  const handleResetToAllIndia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.0, 79.0], 5, { duration: 1.2 });
    }
  };

  return (
    <section className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-100">
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        
        {/* Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <FadeIn>
            <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
              Nationwide Network
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mt-2 mb-3 tracking-tight">
              Pan-India Sales &amp; Service Reach
            </h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              560+ channel partners and 150+ direct service cities ensuring rapid SLA-backed support across all 31 States &amp; UTs.
            </p>
          </FadeIn>
        </div>

        {/* Minimal Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mb-8 border-y border-slate-100">
          {[
            { value: '560+', label: 'Channel Partners' },
            { value: '150+', label: 'Service Cities' },
            { value: '31', label: 'States & UTs Covered' },
            { value: '< 4 Hrs', label: 'Average Response Time' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <span className="block text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight">
                {item.value}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick City Pills Selector */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={handleResetToAllIndia}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Pan-India View</span>
            </button>

            {NETWORK_HUBS.map(hub => {
              const isSelected = selectedLocation.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => handleSelectLocation(hub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {hub.city} {hub.isHQ ? '★ HQ' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real OpenStreetMap Showing ALL Network Nodes simultaneously */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Real OpenStreetMap Container with ALL Pins (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm aspect-[16/11] relative min-h-[380px] z-0">
            <div 
              ref={mapContainerRef} 
              className="w-full h-full"
              style={{ minHeight: '380px' }}
            />
          </div>

          {/* Selected Hub Detail Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedLocation.city}
                    </h3>
                    {selectedLocation.isHQ ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Corporate HQ
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Regional Hub
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedLocation.role} • {selectedLocation.state}
                  </p>
                </div>
              </div>

              {/* Service Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Service Fleet</span>
                  <span className="text-sm font-bold text-slate-900">{selectedLocation.partners}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Response SLA</span>
                  <span className="text-sm font-bold text-emerald-600">{selectedLocation.sla}</span>
                </div>
              </div>

              {/* Address */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{selectedLocation.address}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <a 
                href={`tel:${selectedLocation.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-slate-700 hover:text-primary font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{selectedLocation.phone}</span>
              </a>

              <a 
                href={selectedLocation.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

        {/* Minimal Helpline Footer Strip */}
        <div className="mt-8 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>24/7 Nationwide Rapid Response Helpline • Direct OEM Warranty &amp; Spare Parts</span>
          </span>
          <a href="/contact" className="text-primary font-bold hover:underline flex items-center gap-1">
            <span>Contact Support</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
}
