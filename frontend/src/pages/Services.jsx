import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { supabase } from "@/lib/supabase";
import { Truck, Headphones, Wrench, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap = {
  truck: <Truck className="w-8 h-8 text-primary" />,
  headphones: <Headphones className="w-8 h-8 text-primary" />,
  wrench: <Wrench className="w-8 h-8 text-primary" />
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                    {iconMap[srv.icon]}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">{srv.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{srv.description}</p>
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
             <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold">Download AMC Brochure</Button>
           </FadeIn>
         </div>
      </section>
    </Layout>);

}