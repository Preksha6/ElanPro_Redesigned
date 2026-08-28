import React, { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getProductByIdFromDB, getProductsFromDB, formatCleanDimensions, formatCleanTemp, getProductImage } from "@/lib/productService";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Download, 
  Share2, 
  ShieldCheck, 
  Leaf, 
  Snowflake, 
  PhoneCall, 
  Mail, 
  Ruler, 
  Layers, 
  ThermometerSnowflake, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Box,
  Loader2,
} from "lucide-react";

export default function ProductDetail() {
  const [matchProducts, paramsProducts] = useRoute("/products/:id");
  const [matchProduct, paramsProduct] = useRoute("/product/:id");
  const { toast } = useToast();

  const id = paramsProducts?.id || paramsProduct?.id;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await getProductByIdFromDB(id);
        setProduct(found);

        if (found) {
          const allProds = await getProductsFromDB();
          const related = allProds
            .filter(p => p.id !== found.id && (p.category === found.category || p.subcategory === found.subcategory))
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error loading product from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();

    const handleCatalogueUpdated = () => {
      loadProductData();
    };
    window.addEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
    return () => window.removeEventListener('elanpro-catalogue-updated', handleCatalogueUpdated);
  }, [id]);

  const handleDownloadSpec = () => {
    if (!product) return;
    let specText = `=========================================================\n`;
    specText += `ELANPRO COMMERCIAL REFRIGERATION SPECIFICATION SHEET\n`;
    specText += `=========================================================\n\n`;
    specText += `PRODUCT NAME  : ${product.name}\n`;
    specText += `MODEL NUMBER  : ${product.model || product.name}\n`;
    specText += `CATEGORY      : ${product.category}\n`;
    specText += `SUBCATEGORY   : ${product.subcategory || 'Commercial Refrigeration'}\n\n`;
    specText += `OVERVIEW & DESCRIPTION:\n`;
    specText += `${product.description}\n\n`;
    
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      specText += `TECHNICAL SPECIFICATIONS:\n`;
      specText += `---------------------------------------------------------\n`;
      Object.entries(product.specifications).forEach(([k, v]) => {
        specText += `${k.padEnd(35)} : ${v}\n`;
      });
      specText += `\n`;
    }

    if (product.features && product.features.length > 0) {
      specText += `ENGINEERING FEATURES & HIGHLIGHTS:\n`;
      specText += `---------------------------------------------------------\n`;
      const feats = Array.isArray(product.features) ? product.features : [product.features];
      feats.forEach(f => {
        specText += `* ${f}\n`;
      });
      specText += `\n`;
    }

    specText += `WARRANTY & SERVICE:\n`;
    specText += `* 1 Year Comprehensive Machine Warranty\n`;
    specText += `* 4 Years Compressor Warranty\n`;
    specText += `* 300+ City Authorized Nationwide Service Network\n\n`;
    specText += `=========================================================\n`;
    specText += `Official Website : https://elanpro.net\n`;
    specText += `National Toll-Free: 1800-102-4464\n`;
    specText += `Sales & Support   : sales@elanpro.net\n`;
    specText += `=========================================================\n`;

    const blob = new Blob([specText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Elanpro_${(product.model || product.name).replace(/[^a-zA-Z0-9]/g, '_')}_SpecSheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Datasheet Downloaded",
      description: `Complete technical specification sheet for ${product.name} downloaded successfully.`,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
            Loading equipment specifications...
          </p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <Box className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">
              The requested equipment model could not be found.
            </p>
            <Button asChild className="rounded-full px-6 bg-primary text-white">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const specs = product.specifications || {};
  const rawDim = product.dimensions || specs["Dimensions (WxDxH mm)"] || specs["Dimension WxDxH (mm)"] || specs["Product Dimensions(mm)(wxdxh)"] || specs["Dimension (WxDxH) mm"] || specs["Dim. (WxDxH) mm"] || specs["Dimensions (mm)"] || specs["External Size WxDxH (inch)"] || (Object.entries(specs).find(([k]) => k.toLowerCase().includes('dimension') || k.toLowerCase().includes('wxdxh'))?.[1]) || "Standard Commercial";
  const dimVal = formatCleanDimensions(rawDim);
  const capVal = specs["Capacity (Liters)"] || specs["Capacity (Ltr)"] || specs["Capacity (L)"] || specs["SKU / Selection Capacity"] || specs["Item Capacity (Pcs)"] || specs["Storage Capacity (Items)"] || specs["Ice Bin Capacity (Kg)"] || specs["Total Storage Volume(L )"] || specs["Capacity Ltrs."] || specs["Capacity (Pcs)"] || specs["Capacity"] || (Object.entries(specs).find(([k]) => k.toLowerCase().includes('capacity') || k.toLowerCase().includes('volume'))?.[1]) || "Commercial Grade";
  const rawTemp = specs["Temperature Range (°C)"] || specs["Temperature range (°C)"] || specs["Temperature Range"] || specs["Temperature (°C)"] || specs["Temperature range (˚C)"] || (Object.entries(specs).find(([k]) => k.toLowerCase().includes('temp'))?.[1]) || "+2°C ~ +8°C";
  const tempVal = formatCleanTemp(rawTemp);
  const refVal = specs["Refrigerant"] || specs["Refrigerant Type"] || "Eco-Friendly R290 / R600a";

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 pb-20">
        
        {/* BREADCRUMBS & TOP NAV */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium overflow-x-auto py-1">
              <Link href="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link href="/products" className="hover:text-primary transition-colors shrink-0">Products</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link href={`/categories?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors shrink-0 truncate max-w-[150px]">
                {product.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.model || product.name}</span>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-slate-200 hover:bg-white text-slate-700">
                <Link href="/products">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Products
                </Link>
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm" className="rounded-full text-xs font-bold border-slate-200 hover:bg-white text-slate-700">
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* PRODUCT HERO SECTION */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: Image */}
            <div className="lg:col-span-6">
              <FadeIn>
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[420px] md:min-h-[500px] group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between gap-2 z-10">
                    <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-2xs">
                      {product.subcategory || product.category}
                    </span>
                    
                    {product.badge && (
                      <span className="bg-[#0284c7] text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <img 
                    src={getProductImage(product)} 
                    alt={product.name} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png';
                    }}
                    className="w-full h-auto max-h-[380px] object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 my-auto"
                  />

                  <div className="w-full pt-6 mt-auto border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      MODEL: {product.model || product.name}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Certified Commercial Unit
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-center shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                    <span className="block text-[11px] font-bold text-slate-800">Tropicalized</span>
                    <span className="block text-[10px] text-slate-500">43°C Ambient</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-center shadow-2xs">
                    <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <span className="block text-[11px] font-bold text-slate-800">Eco-Friendly</span>
                    <span className="block text-[10px] text-slate-500">Low GWP Gas</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-center shadow-2xs">
                    <Snowflake className="w-5 h-5 text-[#0284c7] mx-auto mb-1" />
                    <span className="block text-[11px] font-bold text-slate-800">Precision Temp</span>
                    <span className="block text-[10px] text-slate-500">Dixell Controller</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* RIGHT: Specs & Details */}
            <div className="lg:col-span-6 flex flex-col">
              <FadeIn delay={0.1}>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0284c7]">
                    {product.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {product.model || product.name}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                  {product.name}
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Highlight Specs Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">
                    Key Performance Highlights
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-[#0284c7] flex items-center justify-center shrink-0">
                        <Ruler className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dimensions</span>
                        <span className="block text-xs sm:text-sm font-extrabold text-slate-900 truncate" title={dimVal}>
                          {dimVal}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity / Vol</span>
                        <span className="block text-xs sm:text-sm font-extrabold text-slate-900 truncate" title={capVal}>
                          {capVal}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0">
                        <ThermometerSnowflake className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperature</span>
                        <span className="block text-xs sm:text-sm font-extrabold text-slate-900 truncate" title={tempVal}>
                          {tempVal}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Refrigerant</span>
                        <span className="block text-xs sm:text-sm font-extrabold text-slate-900 truncate" title={refVal}>
                          {refVal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full sm:w-auto flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-14 text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
                  >
                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
                      <Mail className="w-4 h-4 mr-2" /> Request Official Quote
                    </Link>
                  </Button>

                  <Button 
                    onClick={handleDownloadSpec}
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto flex-1 rounded-full border-slate-200 hover:bg-white bg-slate-50 text-slate-800 font-bold h-14 text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-primary" /> Download Spec Sheet
                  </Button>
                </div>

                <div className="bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Need immediate technical assistance?</span>
                      <span className="block text-xs text-slate-600">Speak directly with our commercial cooling engineers.</span>
                    </div>
                  </div>
                  <a 
                    href="tel:18001024464" 
                    className="shrink-0 text-xs font-black text-[#0284c7] hover:underline uppercase tracking-wider"
                  >
                    1800-102-4464
                  </a>
                </div>

              </FadeIn>
            </div>

          </div>
        </div>

        {/* TECHNICAL SPECS & FEATURES */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-16">
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-slate-900">Complete Technical Specifications</h2>
                </div>

                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}>
                            <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-600 w-5/12 border-b border-slate-100">
                              {key}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 font-extrabold text-slate-900 w-7/12 border-b border-slate-100 font-mono">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-4">Standard commercial specifications available upon request.</p>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Engineering Highlights
                  </h2>

                  <ul className="space-y-3.5">
                    {(Array.isArray(product.features) ? product.features : [product.features]).map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 text-xs sm:text-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-[#0f2b48] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4 backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" /> Elanpro Assurance
                  </div>

                  <h3 className="text-lg font-bold mb-2">Commercial Warranty & Service</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Every unit is backed by our comprehensive commercial guarantee and nationwide service infrastructure across 300+ Indian cities.
                  </p>

                  <div className="space-y-2 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                      <span>1-Year Comprehensive Machine Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                      <span>4-Years Compressor Extended Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                      <span>Original OEM Certified Spare Parts</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </FadeIn>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <FadeIn delay={0.3}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Similar Models in {product.category}</h2>
                  <p className="text-xs text-slate-500 mt-1">Explore alternative configurations, sizes, and capacities.</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-slate-200">
                  <Link href={`/categories?category=${encodeURIComponent(product.category)}`}>
                    View All Range <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <Link 
                    key={rel.id} 
                    href={`/products/${rel.id}`}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group p-5 cursor-pointer"
                  >
                    <div className="h-48 bg-slate-50 rounded-2xl flex items-center justify-center p-4 mb-4 overflow-hidden relative">
                      <img 
                        src={rel.image} 
                        alt={rel.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                      />
                      {rel.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {rel.badge}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                      {rel.model || rel.subcategory}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {rel.name}
                    </h4>
                    
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0284c7] uppercase">
                      <span>View Specs</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        )}

      </div>
    </Layout>
  );
}
