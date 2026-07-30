import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";
import { MOCK_INDUSTRIES } from "@/data/mockData";
import { CheckCircle2 } from "lucide-react";

export default function Industries() {
  return (
    <Layout>
      <div className="pt-32 pb-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80')] mix-blend-overlay object-cover" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Tailored Solutions for Every Sector</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We understand that a five-star hotel and a life-sciences laboratory have vastly different cooling needs. That's why we build sector-specific portfolios.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="bg-background">
        {MOCK_INDUSTRIES.map((ind, i) => {
          const isEven = i % 2 === 0;
          return (
            <section key={ind.id} className={`py-16 md:py-16 ${isEven ? 'bg-white' : 'bg-secondary/10'}`}>
              <div className="container mx-auto px-4 md:px-6">
                <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                  
                  <div className="w-full md:w-1/2">
                    <FadeIn direction={isEven ? "right" : "left"}>
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                          src={ind.image}
                          alt={ind.name}
                          className="w-full aspect-square md:aspect-[4/3] object-cover" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="glass-panel rounded-2xl p-4 inline-block">
                            <span className="text-primary font-bold text-lg">{ind.stat}</span>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>

                  <div className="w-full md:w-1/2">
                    <FadeIn direction={isEven ? "left" : "right"}>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">{ind.name}</h2>
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {ind.description}
                      </p>
                      
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Recommended Equipment</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ind.products.map((prod, idx) =>
                          <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                              {prod}
                            </li>
                          )}
                        </ul>
                      </div>
                    </FadeIn>
                  </div>

                </div>
              </div>
            </section>);

        })}
      </div>
    </Layout>);

}