import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function About() {
  const milestones = [
  { year: "1990", title: "Foundation", desc: "Started operations as a specialized cooling component supplier." },
  { year: "2000", title: "Expansion", desc: "Launched full range of commercial refrigeration units." },
  { year: "2010", title: "Nationwide", desc: "Established pan-India distribution and service network." },
  { year: "2020", title: "Innovation", desc: "Introduced advanced medical-grade and IoT-enabled cooling." },
  { year: "Present", title: "Leadership", desc: "Recognized as India's premier B2B refrigeration brand." }];


  return (
    <Layout>
      <div className="relative pt-32 pb-16 bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=2000&q=80"
            alt="Corporate office"
            className="w-full h-full object-cover opacity-30" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Built on Precision.<br />Driven by Trust.</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              For over three decades, Elanpro has been the backbone of India's cold chain, providing reliable solutions to the world's most demanding industries.
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-16 bg-background">
         <div className="container mx-auto px-4 md:px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <FadeIn direction="right">
                <div className="grid grid-cols-2 gap-4">
                   <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80" className="w-full aspect-[4/5] object-cover rounded-2xl rounded-tr-[4rem]" alt="Engineering" />
                   <img src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80" className="w-full aspect-[4/5] object-cover rounded-2xl rounded-bl-[4rem] mt-8" alt="Science" />
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Mission & Vision</h2>
                <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">Pioneering the Future of Cooling</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  <strong>Mission:</strong> To empower businesses with innovative, energy-efficient, and impeccably reliable refrigeration solutions that protect their assets and enhance their operations.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  <strong>Vision:</strong> To be the undisputed global leader in specialized cooling technologies, recognized for setting the benchmark in quality, sustainability, and customer-centric service.
                </p>
              </FadeIn>
           </div>
         </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-y-1/2" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <FadeIn>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Milestones</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900">Our Journey</h2>
            </FadeIn>
          </div>
          
          <div className="max-w-5xl mx-auto relative">
            {/* Center Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 -translate-x-1/2 rounded-full" />
            
            <StaggerContainer className="space-y-12 relative">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                return (
                  <StaggerItem key={i}>
                    <div className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                      
                      {/* Timeline Node */}
                      <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-white border-4 border-accent rounded-full transform md:-translate-x-1/2 z-10 group-hover:scale-150 group-hover:border-primary transition-all duration-300 shadow-md" />
                      
                      {/* Mobile Line segment (draws connecting line on mobile only) */}
                      {i !== milestones.length - 1 && (
                        <div className="md:hidden absolute left-[1.65rem] top-8 bottom-[-4rem] w-0.5 bg-primary/20 z-0" />
                      )}

                      {/* Content Card Container */}
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 group-hover:border-primary/20 relative overflow-hidden">
                          
                          {/* Large Year Watermark inside card */}
                          <div className={`absolute -bottom-4 ${isEven ? 'md:-left-4 right-4 md:right-auto' : 'right-4'} text-8xl font-black text-gray-900/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/5`}>
                            {m.year}
                          </div>
                          
                          {/* Actual Content */}
                          <div className="relative z-10">
                            <div className={`inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary font-bold text-sm mb-4 ${isEven ? 'md:float-right' : ''} md:clear-both`}>
                              {m.year}
                            </div>
                            <div className="clear-both" />
                            <h4 className="text-2xl font-bold text-gray-900 mb-3">{m.title}</h4>
                            <p className="text-gray-600 leading-relaxed text-lg">{m.desc}</p>
                          </div>
                          
                        </div>
                      </div>
                      
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </Layout>);

}