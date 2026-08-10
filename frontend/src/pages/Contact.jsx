import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product_interest: "Commercial Refrigeration",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in your name, email, and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. Our team will get back to you shortly.",
        variant: "default",
        className: "bg-green-500 text-white border-none"
      });

      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        product_interest: "Commercial Refrigeration",
        message: ""
      });
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600">
              Whether you need a custom quote, technical support, or general information, our team is ready to assist you.
            </p>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Form */}
            <div className="w-full lg:w-1/2">
              <FadeIn direction="right" className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-8 relative">Send us a Message</h3>
                
                <form className="space-y-6 relative" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Company</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Acme Hotels" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Interest</label>
                    <select name="product_interest" value={formData.product_interest} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-700">
                      <option value="Commercial Refrigeration">Commercial Refrigeration</option>
                      <option value="Food Service Equipment">Food Service Equipment</option>
                      <option value="Life Science Cooling">Life Science Cooling</option>
                      <option value="Maintenance & Support">Maintenance & Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" placeholder="Tell us about your requirements..."></textarea>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/30 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              </FadeIn>
            </div>

            {/* Contact Details */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <FadeIn direction="left">
                <div className="bg-gray-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] mix-blend-overlay object-cover" />
                  <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Corporate Headquarters</h3>
                  
                  <ul className="space-y-6 relative z-10">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Address</p>
                        <p className="text-gray-400 text-sm leading-relaxed">Elanpro Corporate Office,<br />Sector 44, Gurugram,<br />Haryana 122003, India</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <p className="text-gray-400 text-sm">1800-XXX-XXXX (Toll Free)<br />+91-124-XXXXXXX</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <p className="text-gray-400 text-sm">sales@elanpro.net<br />support@elanpro.net</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </FadeIn>

              {/* Branches */}
              <FadeIn direction="up">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Regional Branches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Mumbai", "Bengaluru", "Chennai"].map((city) =>
                  <div key={city} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <MapPin className="w-4 h-4" /> {city}
                      </div>
                      <p className="text-xs text-gray-500">Sales & Service Center</p>
                      <p className="text-xs text-gray-600 mt-2 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Mon-Sat, 9AM-6PM</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

}