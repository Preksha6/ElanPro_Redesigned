import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Search, Phone, ExternalLink, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

// Verified Regional Branches & Experience Hubs with Exact Spot Marker Embeds
export const ELANPRO_LOCATIONS = [
  {
    id: 'gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    role: 'Corporate Headquarters & Experience Hub',
    isHQ: true,
    address: '802, 8th Floor, Tower-2, DLF Corporate Greens, Sector 74A, Gurugram, Haryana - 122004',
    phone: '+91 124 466 7700',
    email: 'info@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=DLF+Corporate+Greens,+Sector+74A,+Southern+Peripheral+Road,+Gurugram,+Haryana+122004&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=DLF+Corporate+Greens+Sector+74A+Gurugram'
  },
  {
    id: 'delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    role: 'North Distribution Hub & Parts Depot',
    isHQ: false,
    address: 'Okhla Industrial Area Phase-III, New Delhi - 110020',
    phone: '+91 11 4100 8800',
    email: 'delhi@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Okhla+Industrial+Area+Phase+III,+New+Delhi,+Delhi+110020&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Okhla+Phase+III+New+Delhi'
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    role: 'Western Regional Headquarters',
    isHQ: false,
    address: 'Unit 401, Technopolis Knowledge Park, Mahakali Caves Road, Andheri East, Mumbai - 400093',
    phone: '+91 22 6123 4500',
    email: 'mumbai@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Technopolis+Knowledge+Park,+Mahakali+Caves+Road,+Andheri+East,+Mumbai,+Maharashtra+400093&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Technopolis+Knowledge+Park+Andheri+East+Mumbai'
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    role: 'Southern Regional Headquarters',
    isHQ: false,
    address: 'Brigade Towers, 135 Brigade Road, Central Business District, Bengaluru - 560025',
    phone: '+91 80 4155 9900',
    email: 'bangalore@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Brigade+Towers,+135+Brigade+Road,+Bengaluru,+Karnataka+560025&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Brigade+Road+Bengaluru'
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    role: 'Dedicated Experience Centre',
    isHQ: false,
    address: 'Plot No. 12, VIP Hills, Madhapur, Hitech City Main Road, Hyderabad - 500081',
    phone: '+91 40 4852 3300',
    email: 'hyderabad@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=VIP+Hills,+Madhapur,+HITEC+City,+Hyderabad,+Telangana+500081&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Madhapur+HITEC+City+Hyderabad'
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    role: 'Eastern Regional Headquarters',
    isHQ: false,
    address: 'Godrej Genesis, Unit 602, Block EP & GP, Sector V, Salt Lake, Kolkata - 700091',
    phone: '+91 33 4008 7700',
    email: 'kolkata@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Godrej+Genesis,+Sector+V,+Salt+Lake,+Kolkata,+West+Bengal+700091&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Godrej+Genesis+Sector+V+Kolkata'
  },
  {
    id: 'chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    role: 'Tamil Nadu Experience Center',
    isHQ: false,
    address: 'Parry House, 3rd Floor, 43 Moore Street / Anna Salai, Chennai - 600001',
    phone: '+91 44 4211 6600',
    email: 'chennai@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Parry+House,+Moore+Street,+George+Town,+Chennai,+Tamil+Nadu+600001&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=George+Town+Chennai'
  },
  {
    id: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    role: 'Gujarat Experience Center',
    isHQ: false,
    address: 'Titanium Square, Thaltej Cross Roads, SG Highway, Ahmedabad - 380054',
    phone: '+91 79 4030 5500',
    email: 'ahmedabad@elanpro.net',
    timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=Titanium+Square,+SG+Highway,+Thaltej,+Ahmedabad,+Gujarat+380054&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Titanium+Square+SG+Highway+Ahmedabad'
  }
];

export default function CitiesNetwork() {
  const [selectedLocation, setSelectedLocation] = useState(ELANPRO_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = ELANPRO_LOCATIONS.filter(loc =>
    loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 bg-white text-gray-900 relative overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl font-display font-black text-gray-900 tracking-tight mb-3">
              Our Locations & <span className="text-primary">Pan-India Reach</span>
            </h2>

            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
              Visit our Corporate Headquarters, Regional Experience Centres, and parts depots, or connect with our 560+ sales and service partners across 150+ cities.
            </p>
          </FadeIn>
        </div>

        {/* 4-Column Key Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { value: '560+', label: 'Sales & Service Partners', desc: 'Authorized Pan-India Fleet' },
            { value: '150+', label: 'Direct Service Cities', desc: 'Metros & Tier 1/2 Hubs' },
            { value: '31', label: 'States & UTs Covered', desc: 'Complete National Coverage' },
            { value: '< 4 Hrs', label: 'Average Response Time', desc: '24/7 Rapid Service Support' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/90 shadow-sm flex flex-col justify-between hover:border-primary/40 hover:bg-white transition-all"
            >
              <div>
                <span className="text-2xl md:text-3xl font-display font-black text-primary tracking-tight">
                  {stat.value}
                </span>
                <h4 className="text-xs font-bold text-gray-900 mt-1">
                  {stat.label}
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 mt-1.5">
                {stat.desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Main Map & Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Branch Directory (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Branch Offices & Experience Hubs ({ELANPRO_LOCATIONS.length})
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  1-Click Select
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, state, or office..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Location Scroll List */}
              <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredLocations.map(loc => {
                  const isSelected = selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/30'
                          : 'bg-gray-50/70 hover:bg-gray-100/90 border-gray-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          loc.isHQ 
                            ? 'bg-amber-500 text-white shadow-sm' 
                            : isSelected ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
                        }`}>
                          {loc.isHQ ? <Building2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {loc.city}
                            </h4>
                            {loc.isHQ && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                                HQ
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              ({loc.state})
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {loc.role}
                          </p>
                        </div>
                      </div>

                      <div className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 transition-colors ${
                        isSelected ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 group-hover:border-primary group-hover:text-primary'
                      }`}>
                        {isSelected ? 'Spot Marked' : 'View Spot'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Location Details Card */}
            <div className="p-4 rounded-2xl bg-gray-900 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-mono text-primary-light uppercase tracking-wider font-bold">
                    {selectedLocation.isHQ ? 'Corporate Headquarters' : 'Regional Branch'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                  {selectedLocation.timing}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                  <span>Elanpro {selectedLocation.city}</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed pl-5">
                  {selectedLocation.address}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a href={`tel:${selectedLocation.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-gray-300 hover:text-white font-medium">
                  <Phone className="w-3.5 h-3.5 text-primary-light" />
                  <span>{selectedLocation.phone}</span>
                </a>

                <a
                  href={selectedLocation.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-light hover:underline font-bold text-xs"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Live Google Map Embed with Exact Red Spot Marker (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  <span>Exact Spot:</span>
                  <strong className="text-primary">{selectedLocation.city} Office</strong>
                  <span className="text-gray-400 font-normal">({selectedLocation.isHQ ? 'HQ' : 'Hub'})</span>
                </span>
              </div>

              <a
                href={selectedLocation.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Live Map Container with Exact Marker */}
            <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100">
              <iframe
                key={selectedLocation.id}
                src={selectedLocation.mapUrl}
                title={`Elanpro ${selectedLocation.city} Exact Spot Map`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Map Bottom Support Bar */}
            <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                24/7 Service Helpline: <strong className="text-gray-900">+91 124 466 7700</strong>
              </span>
              <a href="/contact" className="text-primary font-bold hover:underline flex items-center gap-1">
                <span>Book a Facility Visit</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
