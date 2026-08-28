import { useEffect, useState, useMemo } from 'react';
import { 
  getProductsFromDB, 
  saveProductToDB, 
  deleteProductFromDB,
  normalizeModelKey 
} from '@/lib/productService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Search, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  SlidersHorizontal,
  Layers,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Grid,
  Camera,
  Check
} from 'lucide-react';

const CATEGORIES_LIST = [
  "All Categories",
  "Professional Kitchen",
  "Retail Refrigeration",
  "Pharma & Medical",
  "Cold Room Solutions",
  "Supermarket Systems",
  "Beverage Cooling",
  "Bar Refrigeration",
  "Ice Machine & Flakers",
  "Mini Bar & Mini Fridge",
  "Confectionery Showcase",
  "Vending Solutions",
  "Water Solutions"
];

const STANDARD_SPEC_KEYS = [
  "Dimensions (WxDxH mm)",
  "Capacity (Liters)",
  "Temperature Range (°C)",
  "Refrigerant",
  "Cooling Mode",
  "Power Supply",
  "Shelves",
  "Door Type",
  "Internal Material"
];

// All 31 extracted high-resolution product photography assets
const CATALOGUE_IMAGES = Array.from({ length: 31 }, (_, i) => `https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image${i + 1}.png`);

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    model: '',
    category: 'Professional Kitchen',
    subcategory: '',
    dimensions: '',
    description: '',
    badge: '',
    image: 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png',
    featuresText: '',
    specsList: [] // [{ key: '', value: '' }]
  });

  const { toast } = useToast();

  useEffect(() => {
    loadProducts();

    // Listen for cross-page live updates
    const handleUpdate = () => {
      loadProducts();
    };
    window.addEventListener('elanpro-catalogue-updated', handleUpdate);
    return () => window.removeEventListener('elanpro-catalogue-updated', handleUpdate);
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProductsFromDB();
      setProducts(data || REAL_PRODUCTS);
    } catch (err) {
      console.warn("Failed to load products, using default catalogue:", err);
      setProducts(REAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  // Filtered and Paginated Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.model && p.model.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  function openCreateModal() {
    setIsEditing(false);
    setShowImageGallery(false);
    setFormData({
      id: '',
      name: '',
      model: '',
      category: 'Professional Kitchen',
      subcategory: 'Reach-In Premium Chiller & Freezer',
      dimensions: '',
      description: '',
      badge: '',
      image: '/product-images/image1.png',
      featuresText: 'High efficiency cooling circuit\nPrecision digital temperature controller\nTropicalized for 43°C ambient operation',
      specsList: [
        { key: 'Dimensions (WxDxH mm)', value: '' },
        { key: 'Capacity (Liters)', value: '' },
        { key: 'Temperature Range (°C)', value: '' },
        { key: 'Refrigerant', value: 'R 290' },
        { key: 'Cooling Mode', value: 'Ventilated Cooling (Frost Free)' },
        { key: 'Power Supply', value: '230V / 50Hz' }
      ]
    });
    setIsModalOpen(true);
  }

  function openEditModal(prod) {
    setIsEditing(true);
    setShowImageGallery(false);
    const specsArray = prod.specifications 
      ? Object.entries(prod.specifications).map(([key, value]) => ({ key, value }))
      : [];

    const featuresString = Array.isArray(prod.features) 
      ? prod.features.join('\n') 
      : (prod.features || '');

    setFormData({
      id: prod.id,
      name: prod.name,
      model: prod.model || '',
      category: prod.category || 'Professional Kitchen',
      subcategory: prod.subcategory || '',
      dimensions: prod.dimensions || '',
      description: prod.description || '',
      badge: prod.badge || '',
      image: prod.image || '/product-images/image1.png',
      featuresText: featuresString,
      specsList: specsArray.length > 0 ? specsArray : [
        { key: 'Dimensions (WxDxH mm)', value: prod.dimensions || '' },
        { key: 'Capacity (Liters)', value: '' },
        { key: 'Temperature Range (°C)', value: '' }
      ]
    });
    setIsModalOpen(true);
  }

  function handleImageFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select a valid image file (PNG, JPG, WEBP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File Too Large', description: 'Image size should be under 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setFormData(prev => ({ ...prev, image: dataUrl }));
      toast({ title: 'Picture Inserted', description: `${file.name} loaded successfully as the product picture.` });
    };
    reader.readAsDataURL(file);
  }

  function handleSpecChange(index, field, value) {
    const updated = [...formData.specsList];
    updated[index][field] = value;
    setFormData({ ...formData, specsList: updated });
  }

  function addSpecRow() {
    setFormData({
      ...formData,
      specsList: [...formData.specsList, { key: '', value: '' }]
    });
  }

  function removeSpecRow(index) {
    const updated = formData.specsList.filter((_, i) => i !== index);
    setFormData({ ...formData, specsList: updated });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Construct specifications object
    const specsObj = {};
    formData.specsList.forEach(item => {
      if (item.key && item.value) {
        specsObj[item.key.trim()] = item.value.trim();
      }
    });

    if (formData.dimensions && !specsObj['Dimensions (WxDxH mm)']) {
      specsObj['Dimensions (WxDxH mm)'] = formData.dimensions.trim();
    }

    const featuresArr = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    let generatedId = formData.id;
    if (!generatedId) {
      const slugBase = `${formData.subcategory || formData.category}-${formData.model || formData.name}`.toLowerCase();
      generatedId = slugBase.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const payload = {
      id: generatedId,
      name: formData.name,
      model: formData.model || formData.name,
      category: formData.category,
      subcategory: formData.subcategory || formData.category,
      dimensions: formData.dimensions || specsObj['Dimensions (WxDxH mm)'] || null,
      description: formData.description,
      features: featuresArr,
      specifications: specsObj,
      image: formData.image || '/product-images/image1.png',
      badge: formData.badge || null
    };

    // Save with full persistence (Supabase + LocalStorage)
    const result = await saveProductToDB(payload);

    if (result.success) {
      // Update state immediately without refresh
      setProducts(prev => {
        const normKey = normalizeModelKey(result.product.model || result.product.name);
        const filtered = prev.filter(p => p.id !== result.product.id && normalizeModelKey(p.model || p.name) !== normKey);
        return [result.product, ...filtered];
      });

      toast({ 
        title: isEditing ? 'Equipment & Picture Updated' : 'Equipment Created', 
        description: `${payload.name} has been saved permanently across all pages.` 
      });
      setIsModalOpen(false);
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.error || 'Could not save product' });
    }
  }

  async function handleDelete(productId, productName, modelName) {
    if (!confirm(`Are you sure you want to remove "${productName}" from the catalogue?`)) return;

    const result = await deleteProductFromDB(productId, modelName || productName);
    if (result.success) {
      setProducts(prev => prev.filter(p => p.id !== productId && normalizeModelKey(p.model || p.name) !== normalizeModelKey(modelName || productName)));
      toast({ title: 'Equipment Removed', description: `${productName} was permanently removed from inventory.` });
    } else {
      toast({ variant: 'destructive', title: 'Delete Failed', description: 'Could not delete product' });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">Manage Products</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Layers className="w-4 h-4 text-[#0284c7]" /> 
            Active Inventory: <strong className="text-slate-800">{products.length} unique models (0 duplicates)</strong> across {CATEGORIES_LIST.length - 1} categories
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add New Equipment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200/90 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by model (e.g. EGN 1500, EIM 36, Galaxy), name, or subcategory..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full md:w-64">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {CATEGORIES_LIST.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span>Showing {paginatedProducts.length} of {filteredProducts.length} unique equipment models</span>
          {selectedCategory !== 'All Categories' && (
            <button 
              onClick={() => setSelectedCategory('All Categories')}
              className="text-[#0284c7] font-semibold hover:underline"
            >
              Reset Category Filter
            </button>
          )}
        </div>
      </Card>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading commercial catalogue...</div>
      ) : (
        <Card className="overflow-hidden border-slate-200/90 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-20 text-center">Picture</th>
                  <th className="py-3 px-4">Equipment Model & Name</th>
                  <th className="py-3 px-4">Category & Subcategory</th>
                  <th className="py-3 px-4">Dimensions (WxDxH)</th>
                  <th className="py-3 px-4">Specs</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.map((product) => {
                  const specCount = product.specifications ? Object.keys(product.specifications).length : 0;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 px-4 text-center">
                        <div 
                          onClick={() => openEditModal(product)} 
                          className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 mx-auto cursor-pointer group-hover:border-[#0284c7] transition-all overflow-hidden"
                          title="Click to modify picture"
                        >
                          <img 
                            src={product.image || '/product-images/image1.png'} 
                            alt={product.name} 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-xs font-mono font-bold text-[#0284c7] mt-0.5">
                          Model: {product.model || product.id}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{product.category}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{product.subcategory}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-700">
                        {product.dimensions || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {specCount} specs
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {product.badge ? (
                          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a 
                            href={`/products/${product.id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284c7] hover:bg-slate-100 transition-colors"
                            title="View on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditModal(product)} 
                            className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/5"
                            title="Edit product & picture"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(product.id, product.name, product.model)} 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      No commercial equipment found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {totalPages} ({filteredProducts.length} unique items)
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          currentPage === pageNum 
                            ? 'bg-[#0284c7] text-white' 
                            : 'text-slate-600 hover:bg-slate-200/70'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 text-xs font-semibold"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* CREATE / EDIT MODAL WITH PICTURE MANAGER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {isEditing ? 'Edit Equipment & Picture' : 'Create New Equipment Model'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Insert or modify product photography, technical specifications, and model identifiers. Changes will persist permanently.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PICTURE MANAGEMENT STUDIO */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
                <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0284c7]" /> Product Picture & Media Controls
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Upload from device, pick from 31 catalogue assets, or enter URL
                  </span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Current Image Preview Box */}
                  <div className="flex flex-col items-center gap-2 shrink-0 mx-auto sm:mx-0">
                    <div className="w-28 h-28 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm p-2 flex items-center justify-center relative group overflow-hidden">
                      {formData.image ? (
                        <img 
                          src={formData.image} 
                          alt="Product Preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = 'https://lfshnugnjjbibrosqtke.supabase.co/storage/v1/object/public/products/image1.png'; }}
                        />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center gap-1">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-[10px]">No Picture</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 truncate max-w-[120px]">
                      {formData.image ? (formData.image.startsWith('data:') ? 'Custom Upload' : formData.image.split('/').pop()) : 'No image'}
                    </span>
                  </div>

                  {/* Actions & Inputs */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Computer</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageFileUpload} 
                        />
                      </label>

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowImageGallery(!showImageGallery)}
                        className="text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 gap-1.5"
                      >
                        <Grid className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{showImageGallery ? 'Close Gallery' : 'Select from Catalogue Gallery (31)'}</span>
                      </Button>

                      {formData.image && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Picture
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-500">
                        Or specify Image Asset Path / Web URL:
                      </Label>
                      <Input 
                        placeholder="/product-images/image1.png or https://example.com/chiller.jpg" 
                        value={formData.image} 
                        onChange={e => setFormData({ ...formData, image: e.target.value })} 
                        className="h-8 text-xs bg-white font-mono"
                      />
                    </div>

                    {/* Expandable Image Gallery Grid */}
                    {showImageGallery && (
                      <div className="mt-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1.5 border-b border-slate-100">
                          <span>Select an equipment photograph from the catalogue:</span>
                          <span className="text-[10px] text-slate-400 font-normal">31 Total Assets</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                          {CATALOGUE_IMAGES.map((imgPath, idx) => {
                            const isSelected = formData.image === imgPath;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, image: imgPath });
                                  setShowImageGallery(false);
                                  toast({ title: 'Picture Updated', description: `Assigned Asset ${idx + 1}` });
                                }}
                                className={`p-1.5 rounded-xl border transition-all flex flex-col items-center relative ${
                                  isSelected 
                                    ? 'border-[#0284c7] bg-sky-50 ring-2 ring-sky-400' 
                                    : 'border-slate-200 hover:border-slate-400 bg-slate-50/50'
                                }`}
                                title={`Asset #${idx + 1}`}
                              >
                                <img 
                                  src={imgPath} 
                                  alt={`Asset ${idx + 1}`} 
                                  className="w-11 h-11 object-contain"
                                />
                                <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                                  #{idx + 1}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#0284c7] text-white rounded-full flex items-center justify-center text-[8px]">
                                    ✓
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Core Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Model Number *</Label>
                  <Input 
                    placeholder="e.g. EGN 1500 C4, EIM 36" 
                    value={formData.model} 
                    onChange={e => setFormData({ ...formData, model: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">Full Equipment Name *</Label>
                  <Input 
                    placeholder="e.g. Reach-In Premium Chiller & Freezer EGN 1500 C4" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Category *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm font-semibold"
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    required
                  >
                    {CATEGORIES_LIST.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Subcategory</Label>
                  <Input 
                    placeholder="e.g. Reach-In Premium Chiller & Freezer" 
                    value={formData.subcategory} 
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })} 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Dimensions (WxDxH mm)</Label>
                  <Input 
                    placeholder="e.g. 1420 x 875 x 2090" 
                    value={formData.dimensions} 
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })} 
                  />
                </div>
              </div>

              {/* Badges & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Badge (Optional)</Label>
                  <Input 
                    placeholder="e.g. 'Premium', 'Ultra-Low -86°C', 'Smart IoT'" 
                    value={formData.badge} 
                    onChange={e => setFormData({ ...formData, badge: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">Description</Label>
                  <Input 
                    placeholder="Overview of the equipment model..." 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>
              </div>

              {/* Features (One per line) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Key Engineering Features (One per line)</Label>
                <Textarea 
                  rows={3} 
                  placeholder="Auto Defrosting&#10;Digital Controller&#10;Adjustable SS Shelves&#10;Eco-Friendly Refrigerant" 
                  value={formData.featuresText} 
                  onChange={e => setFormData({ ...formData, featuresText: e.target.value })} 
                />
              </div>

              {/* EXACT SPECIFICATIONS BUILDER */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-[#0284c7]" /> Complete Technical Specifications
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Store exact attributes directly from the catalogue (Dimensions, Capacity, Temperature, Refrigerant, etc.)
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addSpecRow}
                    className="text-xs font-bold text-[#0284c7] border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Specification Field
                  </Button>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-2 max-h-56 overflow-y-auto">
                  {formData.specsList.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        placeholder="Attribute (e.g. Capacity (Liters))" 
                        value={item.key} 
                        onChange={e => handleSpecChange(index, 'key', e.target.value)} 
                        className="w-1/2 h-9 text-xs bg-white"
                        list="spec-suggestions"
                      />
                      <Input 
                        placeholder="Value (e.g. 1300 L, -2°C ~ 8°C)" 
                        value={item.value} 
                        onChange={e => handleSpecChange(index, 'value', e.target.value)} 
                        className="w-1/2 h-9 text-xs bg-white font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeSpecRow(index)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                        title="Remove spec"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.specsList.length === 0 && (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No technical specifications added yet. Click "+ Add Specification Field" above.
                    </div>
                  )}
                </div>

                <datalist id="spec-suggestions">
                  {STANDARD_SPEC_KEYS.map(k => (
                    <option key={k} value={k} />
                  ))}
                </datalist>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-6 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> 
                  {isEditing ? 'Update Equipment & Picture' : 'Save New Equipment'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
