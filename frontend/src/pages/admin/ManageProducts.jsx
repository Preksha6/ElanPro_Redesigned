import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').order('name', { ascending: true }),
      supabase.from('categories').select('name').order('name', { ascending: true })
    ]);

    if (productsRes.error) {
      toast({ variant: 'destructive', title: 'Error fetching products', description: productsRes.error.message });
    } else {
      setProducts(productsRes.data || []);
    }

    if (categoriesRes.data) {
      setCategories(categoriesRes.data.map(c => c.name));
    }
    setLoading(false);
  }

  async function handleDelete(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully.' });
      setProducts(products.filter(p => p.id !== productId));
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    
    // Parse comma-separated features into an array
    const featuresArray = features.split(',').map(f => f.trim()).filter(Boolean);

    const { data, error } = await supabase.from('products').insert([
      { 
        id, 
        name, 
        category, 
        subcategory, 
        description, 
        features: featuresArray, 
        image, 
        badge: badge || null 
      }
    ]).select();

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Product created.' });
      setProducts([data[0], ...products]);
      setIsCreating(false);
      // Reset form
      setId(''); setName(''); setCategory(''); setSubcategory(''); 
      setDescription(''); setFeatures(''); setImage(''); setBadge('');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" /> {isCreating ? 'Cancel' : 'New Product'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Product ID (Slug, e.g. cr-10)</Label>
                  <Input id="id" value={id} onChange={e => setId(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input id="subcategory" value={subcategory} onChange={e => setSubcategory(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="features">Features (Comma separated)</Label>
                  <Input id="features" placeholder="Fast cooling, Energy efficient, LED Display" value={features} onChange={e => setFeatures(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge (Optional, e.g. 'New' or 'Premium')</Label>
                  <Input id="badge" value={badge} onChange={e => setBadge(e.target.value)} />
                </div>
              </div>
              <Button type="submit">Save Product</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Badge</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-2">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {product.name}
                      <div className="text-xs text-zinc-500 font-normal">{product.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      {product.category}
                      <div className="text-xs text-zinc-500">{product.subcategory}</div>
                    </td>
                    <td className="px-6 py-4">
                      {product.badge && <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{product.badge}</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
