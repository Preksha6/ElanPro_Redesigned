import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Category deleted successfully.' });
      setCategories(categories.filter(c => c.id !== id));
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const { data, error } = await supabase.from('categories').insert([
      { name, icon, image, count: 0 }
    ]).select();

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Category created.' });
      setCategories([...categories, data[0]]);
      setIsCreating(false);
      setName('');
      setIcon('');
      setImage('');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" /> {isCreating ? 'Cancel' : 'New Category'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji or URL)</Label>
                  <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Background Image URL</Label>
                  <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
                </div>
              </div>
              <Button type="submit">Save Category</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div>Loading categories...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Icon</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Products Count</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 font-medium">{category.id}</td>
                    <td className="px-6 py-4 text-xl">{category.icon}</td>
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">{category.count}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                      No categories found.
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
