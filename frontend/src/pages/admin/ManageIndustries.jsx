import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit, Building2, Upload, Image as ImageIcon } from 'lucide-react';

export default function ManageIndustries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  
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

  function openCreate() {
    setEditingIndustry(null);
    setId('');
    setName('');
    setDescription('');
    setStat('');
    setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200');
    setIsCreating(true);
  }

  function openEdit(ind) {
    setEditingIndustry(ind);
    setId(ind.id);
    setName(ind.name);
    setDescription(ind.description || '');
    setStat(ind.stat || '');
    setImage(ind.image || '');
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
      toast({ title: 'Industry Picture Inserted', description: `${file.name} loaded.` });
    };
    reader.readAsDataURL(file);
  }

  async function handleDelete(industryId, indName) {
    if (!confirm(`Are you sure you want to delete industry "${indName}"?`)) return;
    const { error } = await supabase.from('industries').delete().eq('id', industryId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Industry deleted successfully.' });
      setIndustries(industries.filter(ind => ind.id !== industryId));
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    const cleanId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = { id: cleanId, name, description, stat, image, products: [] };

    const { data, error } = await supabase.from('industries').upsert([payload]).select();

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      if (editingIndustry) {
        setIndustries(industries.map(i => i.id === cleanId ? payload : i));
        toast({ title: 'Industry Updated', description: `${name} has been updated.` });
      } else {
        setIndustries([payload, ...industries]);
        toast({ title: 'Industry Created', description: `${name} has been created.` });
      }
      setIsCreating(false);
      setEditingIndustry(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">Manage Industries</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Building2 className="w-4 h-4 text-[#0284c7]" />
            Target Sectors ({industries.length})
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Industry
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6 border-blue-200 bg-blue-50/30 p-6 rounded-3xl">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900">
              {editingIndustry ? `Edit Industry: ${editingIndustry.name}` : 'Create New Industry'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Industry ID</Label>
                  <Input value={id} onChange={e => setId(e.target.value)} required placeholder="e.g. ind-hospitality" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Industry Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Hospitality & Food Service" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Industry focus description..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Key Statistic</Label>
                  <Input value={stat} onChange={e => setStat(e.target.value)} required placeholder="e.g. 10,000+ Kitchens Equipped" />
                </div>
                
                {/* Industry Picture Control */}
                <div className="space-y-2 md:col-span-2 p-4 bg-white rounded-2xl border border-slate-200">
                  <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0284c7]" /> Industry Photography
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {image && (
                      <img src={image} alt="Industry Preview" className="w-28 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Industry Picture</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <Input value={image} onChange={e => setImage(e.target.value)} required placeholder="Or paste image URL" className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold">
                  {editingIndustry ? 'Update Industry' : 'Save Industry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading industries...</div>
      ) : (
        <Card className="overflow-hidden border-slate-200/90 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-28">Picture</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Statistic</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {industries.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      {ind.image && (
                        <img src={ind.image} alt={ind.name} className="w-20 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {ind.name}
                      <div className="text-xs text-slate-500 font-normal truncate max-w-[280px]">{ind.description}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">
                      {ind.stat}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(ind)} className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/5">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ind.id, ind.name)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
