import React from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CATALOGUES = [
  { id: 1, name: "2024 Product Catalog", desc: "Complete overview of our refrigeration products.", size: "4.2 MB", year: 2024 },
  { id: 2, name: "Medical Storage Solutions", desc: "Specialized cooling for vaccines and medicines.", size: "2.1 MB", year: 2024 },
  { id: 3, name: "Commercial Display Units", desc: "Showcase your products with efficient cooling.", size: "3.5 MB", year: 2023 },
];

export default function Catalogues() {
  return (
    <Layout>
      <div className="pt-32 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Product Catalogues</h1>
              <p className="text-lg text-gray-600">Request our latest brochures and specifications to find the perfect solution for your business.</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATALOGUES.map((cat) => (
              <StaggerItem key={cat.id}>
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{cat.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{cat.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-400">PDF • {cat.size}</span>
                    <Button asChild variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                      <Link href="/contact">
                        Request Catalogue
                      </Link>
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </div>
    </Layout>
  );
}
