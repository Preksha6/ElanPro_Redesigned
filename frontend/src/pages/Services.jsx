import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { supabase } from "@/lib/supabase";
import { 
  Truck, 
  Headphones, 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  X, 
  CheckCircle2, 
  Send, 
  Download, 
  Lock, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  truck: <Truck className="w-8 h-8 text-accent" />,
  headphones: <Headphones className="w-8 h-8 text-accent" />,
  wrench: <Wrench className="w-8 h-8 text-accent" />
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // AMC Request Modal State
  const [amcModalOpen, setAmcModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amcForm, setAmcForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    note: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase.from('services').select('*').order('id');
        if (data) setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAmcSubmit = async (e) => {
    e.preventDefault();
    if (!amcForm.name || !amcForm.email || !amcForm.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter your name, email, and phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const newInquiry = {
      id: "amc-" + Date.now(),
      name: amcForm.name,
      email: amcForm.email,
      phone: amcForm.phone,
      company: amcForm.company || "N/A",
      product_interest: "AMC Brochure Request: Annual Maintenance Contract",
      message: `City: ${amcForm.city || 'N/A'} | Note: ${amcForm.note || 'Requested Annual Maintenance Contract Brochure & SLA Terms'}`,
      status: 'unread',
      created_at: new Date().toISOString()
    };

    let insertedToDb = false;
    try {
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert([
          {
            name: newInquiry.name,
            email: newInquiry.email,
            phone: newInquiry.phone,
            company: newInquiry.company,
            product_interest: newInquiry.product_interest,
            message: newInquiry.message,
            status: 'unread'
          }
        ]);
        if (!error) {
          insertedToDb = true;
        }
      }
    } catch (err) {
      console.warn("Supabase insert notice:", err);
    }

    // Only save to local storage if database insert was not successful
    if (!insertedToDb) {
      try {
        const stored = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
        localStorage.setItem('elanpro_contact_messages', JSON.stringify([newInquiry, ...stored]));
      } catch (e) {}
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "AMC Request Received",
        description: `Your AMC Brochure package has been authorized for ${amcForm.email}.`,
      });
    }, 600);
  };

  const handleDirectDownload = () => {
    toast({
      title: "Downloading AMC Brochure...",
      description: "Annual Maintenance Contract SLA and service tier details are downloading.",
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Layout>
      <div className="pt-32 pb-20 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=2000&q=80')] opacity-10 mix-blend-overlay object-cover" />
        <FadeIn className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Service You Can Count On</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/80">
            Our commitment doesn't end at the sale. Elanpro offers industry-leading after-sales support, maintenance contracts, and a nationwide distribution network.
          </p>
        </FadeIn>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv) =>
            <StaggerItem key={srv.id}>
                <div className="group relative rounded-3xl overflow-hidden h-full min-h-[320px] hover:shadow-2xl transition-all duration-300 border border-white/10">
                  <img 
                    src={srv.icon === 'truck' ? 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80' : srv.icon === 'headphones' ? 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80' : 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80'} 
                    alt={srv.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Lighter overlay so the image is visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/10 group-hover:bg-primary/30 transition-colors duration-500" />
                  
                  <div className="relative z-10 p-8 flex flex-col h-full text-white">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 text-white shadow-sm">
                      {iconMap[srv.icon] || <ShieldCheck className="w-8 h-8 text-accent" />}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4 drop-shadow-md">{srv.title}</h3>
                    <p className="text-gray-100 leading-relaxed drop-shadow-sm flex-grow">{srv.description}</p>
                  </div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <FadeIn direction="right">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Nationwide Network</h2>
                <p className="text-lg text-gray-400 mb-8">
                  With over 150 branch offices and authorized service centers across India, an Elanpro technician is never far away. We ensure fast response times because we know downtime costs money.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">150+ Touchpoints</h4>
                      <p className="text-gray-400 text-sm">Offices and service centers across all states.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Wrench className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">300+ Certified Techs</h4>
                      <p className="text-gray-400 text-sm">Highly trained professionals ready to deploy.</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="w-full lg:w-1/2">
              <FadeIn direction="left">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800 aspect-video md:aspect-[4/3] flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&q=80" alt="Map concept" className="opacity-40 mix-blend-luminosity object-cover w-full h-full absolute" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                  <div className="z-10 text-center p-8 border border-white/10 rounded-2xl backdrop-blur-md bg-black/40">
                     <ShieldCheck className="w-16 h-16 text-accent mx-auto mb-4" />
                     <h3 className="text-2xl font-bold">India's Trusted Partner</h3>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-center">
         <div className="container mx-auto px-4">
           <FadeIn>
             <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Need Maintenance?</h2>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Sign up for an Annual Maintenance Contract (AMC) today to keep your equipment running at peak efficiency year-round.</p>
             <Button 
               size="lg" 
               className="rounded-full h-14 px-8 text-lg font-bold bg-primary hover:bg-accent text-white gap-2 transition-all shadow-md"
               onClick={() => {
                 setIsSuccess(false);
                 setAmcModalOpen(true);
               }}
             >
               <FileText className="w-5 h-5" />
               <span>Request AMC Brochure</span>
             </Button>
           </FadeIn>
         </div>
      </section>

      {/* AMC BROCHURE REQUEST MODAL */}
      {amcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setAmcModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Service Literature Request</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-1">
                {isSuccess ? "Request Submitted Successfully" : "Request Annual Maintenance Contract Brochure"}
              </h3>
              
              <div className="text-xs text-slate-300 mt-2 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium border border-white/10">
                  📄 Elanpro Comprehensive AMC &amp; Preventive Maintenance Guide
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900">
                    Thank you, {amcForm.name}!
                  </h4>
                  
                  <p className="text-xs md:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your request for the <strong>Annual Maintenance Contract (AMC) Brochure</strong> has been registered. Our service team will review your requirements and send the complete AMC literature and SLA terms directly to <strong>{amcForm.email}</strong>.
                  </p>

                  <div className="pt-4 flex justify-center">
                    <Button
                      onClick={() => setAmcModalOpen(false)}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-8"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAmcSubmit} className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Please provide your contact details to receive our comprehensive AMC terms, preventative maintenance schedules, and SLA packages.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={amcForm.name}
                        onChange={(e) => setAmcForm({...amcForm, name: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Work / Official Email <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh@hotelgroup.com"
                        value={amcForm.email}
                        onChange={(e) => setAmcForm({...amcForm, email: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile / WhatsApp <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={amcForm.phone}
                        onChange={(e) => setAmcForm({...amcForm, phone: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Facility Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Hotel & Suites"
                        value={amcForm.company}
                        onChange={(e) => setAmcForm({...amcForm, company: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facility City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, New Delhi, Bengaluru..."
                      value={amcForm.city}
                      onChange={(e) => setAmcForm({...amcForm, city: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Equipment Details / Service Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 10 Under-counter chillers and 2 cold rooms requiring quarterly maintenance..."
                      value={amcForm.note}
                      onChange={(e) => setAmcForm({...amcForm, note: e.target.value})}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setAmcModalOpen(false)}
                      className="text-xs text-slate-500"
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-bold px-7 gap-2 shadow-lg shadow-accent/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Processing..." : "Submit & Access AMC Brochure"}</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}