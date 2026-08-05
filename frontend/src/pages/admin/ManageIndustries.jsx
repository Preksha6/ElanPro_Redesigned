import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

export default function ManageIndustries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stat, setStat] = useState('');
  const [image, setImage] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchIndustries();
  }, []);

  async function fetchIndustries() {
    setLoading(true);
    const { data, error } = await supabase.from('industries').select('*').order('name', { ascending: true });
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching industries', description: error.message });
    } else {
      setIndustries(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(industryId) {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    const { error } = await supabase.from('industries').delete().eq('id', industryId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Industry deleted successfully.' });
      setIndustries(industries.filter(ind => ind.id !== industryId));
    }
  }

  async function handleCreate(e) {
    e.preventDefault();

    const { data, error } = await supabase.from('industries').insert([
      { id, name, description, stat, image, products: [] }
    ]).select();

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Industry created.' });
      setIndustries([data[0], ...industries]);
      setIsCreating(false);
      // Reset form
      setId(''); setName(''); setDescription(''); setStat(''); setImage('');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Industries</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" /> {isCreating ? 'Cancel' : 'New Industry'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Industry ID (Slug, e.g. ind-5)</Label>
                  <Input id="id" value={id} onChange={e => setId(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Industry Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stat">Key Statistic (e.g. '1000+ Hotels')</Label>
                  <Input id="stat" value={stat} onChange={e => setStat(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" value={image} onChange={e => setImage(e.target.value)} required />
                </div>
              </div>
              <Button type="submit">Save Industry</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div>Loading industries...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Statistic</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {industries.map((ind) => (
                  <tr key={ind.id} className="bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-2">
                      {ind.image && (
                        <img src={ind.image} alt={ind.name} className="w-16 h-10 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {ind.name}
                      <div className="text-xs text-zinc-500 font-normal truncate max-w-[250px]">{ind.description}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      {ind.stat}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ind.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {industries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                      No industries found.
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
