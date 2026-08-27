import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getProductsFromDB } from '@/lib/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit, ExternalLink, Tags, Sparkles, Layers, Image as ImageIcon, Upload, Camera } from 'lucide-react';

const INITIAL_CORE_CATEGORIES = [
  { id: 'professional-kitchen', name: 'Professional Kitchen', icon: '👨‍🍳', image: 'https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg', description: 'Heavy-duty reach-in chillers, undercounters, prep tables, and blast freezers' },
  { id: 'retail-refrigeration', name: 'Retail Refrigeration', icon: '🛒', image: 'https://elanpro.net/wp-content/uploads/2025/07/Retail_-min.jpg', description: 'Flat & curved glass chest freezers, hard top deep freezers, and visi-coolers' },
  { id: 'supermarket-systems', name: 'Supermarket Systems', icon: '🏬', image: 'https://elanpro.net/wp-content/uploads/2025/07/Super-market_-min.jpg', description: 'Plug-in and remote multideck open display chillers and glass door cases' },
  { id: 'pharma-medical', name: 'Pharma & Medical', icon: '💉', image: 'https://elanpro.net/wp-content/uploads/2025/07/Pharma-800-x-800.jpg', description: 'Ultra-low -86°C deep freezers, biomedical storage, and vaccine chillers' },
  { id: 'cold-room-solutions', name: 'Cold Room Solutions', icon: '❄️', image: 'https://elanpro.net/wp-content/uploads/2025/06/cold-room.jpg', description: 'Tropicalized condensing units, evaporators, and custom walk-in cold rooms' },
  { id: 'bar-refrigeration', name: 'Bar Refrigeration', icon: '🍸', image: 'https://elanpro.net/wp-content/uploads/2025/06/BAR-REFRIGERATION.jpg', description: 'Back-bar bottle coolers, undercounter glass frosters, and draft beer kegerators' },
  { id: 'beverage-cooling', name: 'Beverage Cooling', icon: '🍷', image: 'https://elanpro.net/wp-content/uploads/2025/06/BEVERAGE.jpg', description: 'Dual-zone wine chillers, premium cellars, and rapid beverage coolers' },
  { id: 'ice-machine-flakers', name: 'Ice Machine & Flakers', icon: '🧊', image: 'https://elanpro.net/wp-content/uploads/2025/06/ice.jpg', description: 'Self-contained gourmet cube makers and modular heavy-duty ice systems' },
  { id: 'confectionery-showcase', name: 'Confectionery Showcase', icon: '🍰', image: 'https://elanpro.net/wp-content/uploads/2025/06/CONFECTIONERY-SHOWCASE.jpg', description: 'Heated glass pastry showcases and countertop refrigerated display units' },
  { id: 'mini-bar-mini-fridge', name: 'Mini Bar & Mini Fridge', icon: '🏨', image: 'https://elanpro.net/wp-content/uploads/2025/06/Mini-Bar-2.jpg', description: 'Ultra-silent 0dB absorption hotel minibars and compact compressor fridges' },
  { id: 'vending-solutions', name: 'Vending Solutions', icon: '🤖', image: 'https://elanpro.net/wp-content/uploads/2025/07/Vending-machine_-min.jpg', description: 'Smart IoT touchscreen automated vending machines for food and drinks' },
  { id: 'water-solutions', name: 'Water Solutions', icon: '💧', image: 'https://elanpro.net/wp-content/uploads/2025/07/water-cooler_-min.jpg', description: 'Heavy-duty water coolers, dispensers, and coffee milk chillers' }
];

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('❄️');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchCategoriesAndCounts();
  }, []);

  async function fetchCategoriesAndCounts() {
    setLoading(true);
    try {
      const prods = await getProductsFromDB();
      const counts = {};
      prods.forEach(p => {
        const cat = p.category || "Professional Kitchen";
        counts[cat.toLowerCase()] = (counts[cat.toLowerCase()] || 0) + 1;
      });
      setProductCounts(counts);

      const { data: dbCategories, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error || !dbCategories || dbCategories.length <= 3) {
        setCategories(INITIAL_CORE_CATEGORIES);
      } else {
        setCategories(dbCategories);
      }
    } catch (err) {
      console.warn("Using core categories:", err);
      setCategories(INITIAL_CORE_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingCategory(null);
    setName('');
    setIcon('❄️');
    setImage('https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg');
    setDescription('');
    setIsCreating(true);
  }

  function openEdit(cat) {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || '❄️');
    setImage(cat.image || '');
    setDescription(cat.description || '');
    setIsCreating(true);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImage(uploadEvent.target.result);
      toast({ title: 'Cover Image Inserted', description: `${file.name} loaded.` });
    };
    reader.readAsDataURL(file);
  }

  async function handleDelete(id, catName) {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
    setCategories(categories.filter(c => c.id !== id));
    toast({ title: 'Category Removed', description: `${catName} has been deleted.` });
  }

  async function handleSave(e) {
    e.preventDefault();
    const slug = editingCategory ? editingCategory.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      id: slug,
      name,
      icon,
      image,
      description
    };

    try {
      await supabase.from('categories').upsert([newCategory]);
    } catch (e) {
      console.warn(e);
    }

    if (editingCategory) {
      setCategories(categories.map(c => c.id === slug ? { ...c, ...newCategory } : c));
      toast({ title: 'Category Updated', description: `${name} and cover image updated.` });
    } else {
      setCategories([...categories, newCategory]);
      toast({ title: 'Category Created', description: `${name} has been created.` });
    }

    setIsCreating(false);
    setEditingCategory(null);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">Manage Categories</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Tags className="w-4 h-4 text-[#0284c7]" />
            Organization: <strong className="text-slate-800">{categories.length} commercial categories</strong>
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Modal / Form */}
      {isCreating && (
        <Card className="mb-6 border-blue-200 bg-blue-50/30 p-6 rounded-3xl">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">Category Name *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Specialty Refrigeration" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Icon (Emoji or Symbol)</Label>
                  <Input value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g. ❄️, 🛒, 🍾" />
                </div>
                
                {/* Category Picture Control */}
                <div className="space-y-2 md:col-span-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0284c7]" /> Cover Photography & Media
                    </span>
                  </Label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {image && (
                      <img 
                        src={image} 
                        alt="Category Preview" 
                        className="w-28 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0" 
                      />
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-2xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Cover Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        {image && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => setImage('')} className="text-xs text-red-500">
                            Clear
                          </Button>
                        )}
                      </div>
                      <Input 
                        value={image} 
                        onChange={e => setImage(e.target.value)} 
                        placeholder="Or enter image URL: https://elanpro.net/wp-content/uploads/..." 
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-3">
                  <Label className="text-xs font-bold text-slate-700">Category Description</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary of products in this category..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold">
                  {editingCategory ? 'Update Category & Picture' : 'Save Category'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading category lineup...</div>
      ) : (
        <Card className="overflow-hidden border-slate-200/90 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Icon</th>
                  <th className="py-3 px-4 w-28">Cover</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Scope & Applications</th>
                  <th className="py-3 px-4">Models In Catalogue</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => {
                  const count = productCounts[category.name.toLowerCase()] || 0;
                  return (
                    <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-2xl text-center">
                        {category.icon || '❄️'}
                      </td>
                      <td className="py-3 px-4">
                        <img 
                          src={category.image || 'https://elanpro.net/wp-content/uploads/2025/06/PROFESSIONAL-KITCHEN.jpg'} 
                          alt={category.name} 
                          className="w-20 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {category.name}
                        <div className="text-[11px] font-mono text-slate-400 font-normal">ID: {category.id}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[280px]">
                        <p className="text-xs line-clamp-2">{category.description || 'Commercial cooling equipment line.'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-[#0284c7] border border-sky-100">
                          {count} {count === 1 ? 'equipment model' : 'equipment models'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a 
                            href={`/categories?category=${encodeURIComponent(category.name)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284c7] hover:bg-slate-100 transition-colors"
                            title="View category on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(category)} 
                            className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/5"
                            title="Edit Category & Picture"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(category.id, category.name)} 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
