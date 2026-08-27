import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Plus, Edit, Trash2, Upload, Image as ImageIcon, 
  Search, ExternalLink, CheckCircle2, Star, Filter, RefreshCw
} from 'lucide-react';
import { getLocalClients, getClientsFromDB, saveClientToDB, deleteClientFromDB } from '@/lib/clientService';

const INDUSTRIES_LIST = [
  "Dairy & Ice Cream",
  "QSR & Restaurants",
  "Hospitality & Hotels",
  "Beverage & Bars",
  "Retail & Quick Commerce",
  "Retail & Supermarkets",
  "Cafes & Bakeries",
  "Healthcare & Pharma",
  "Commercial Enterprise"
];

export default function ManageClients() {
  const [clients, setClients] = useState(() => getLocalClients());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES_LIST[0]);
  const [website, setWebsite] = useState('');
  const [featured, setFeatured] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    // 1. Instantly load local cache
    const cached = getLocalClients();
    setClients(cached);
    setLoading(false);

    // 2. Query remote DB
    try {
      const data = await getClientsFromDB();
      if (data && data.length > 0) {
        setClients(data);
      }
    } catch (err) {
      console.warn('Clients query notice:', err);
    }
  }

  function openCreateModal() {
    setEditingClient(null);
    setName('');
    setUrl('');
    setIndustry(INDUSTRIES_LIST[0]);
    setWebsite('');
    setFeatured(true);
    setIsModalOpen(true);
  }

  function openEditModal(client) {
    setEditingClient(client);
    setName(client.name);
    setUrl(client.url || '');
    setIndustry(client.industry || INDUSTRIES_LIST[0]);
    setWebsite(client.website || '');
    setFeatured(client.featured !== undefined ? client.featured : true);
    setIsModalOpen(true);
  }

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select a valid image file (PNG, JPG, SVG, WEBP).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setUrl(uploadEvent.target.result);
      toast({ title: 'Client Logo Loaded', description: `${file.name} ready for saving.` });
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Name Required', description: 'Please enter the client brand name.' });
      return;
    }

    if (!url.trim()) {
      toast({ variant: 'destructive', title: 'Logo Required', description: 'Please upload or provide a logo URL for the client.' });
      return;
    }

    const clientPayload = {
      id: editingClient ? editingClient.id : undefined,
      name: name.trim(),
      url: url.trim(),
      industry: industry || "Commercial Enterprise",
      website: website.trim(),
      featured: Boolean(featured)
    };

    try {
      const saved = await saveClientToDB(clientPayload);
      const refreshed = getLocalClients();
      setClients(refreshed);
      if (editingClient) {
        toast({ title: 'Client Updated', description: `${saved.name} has been successfully updated.` });
      } else {
        toast({ title: 'Client Added', description: `${saved.name} has been added to the client portfolio.` });
      }
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save Failed', description: err.message });
    }
  }

  async function handleDelete(client) {
    if (!confirm(`Are you sure you want to remove client "${client.name}"?`)) return;

    try {
      await deleteClientFromDB(client.id);
      const refreshed = getLocalClients();
      setClients(refreshed);
      toast({ title: 'Client Removed', description: `${client.name} has been deleted.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: err.message });
    }
  }

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (c.industry && c.industry.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
    return matchSearch && matchIndustry;
  });

  const allIndustries = ['All', ...new Set(clients.map(c => c.industry).filter(Boolean))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">Manage Clients & Brands</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Users className="w-4 h-4 text-[#0284c7]" />
            Enterprise Clients & Brand Partners ({clients.length})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={loadClients} 
            variant="outline" 
            size="sm"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button 
            onClick={openCreateModal} 
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-md gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search client by name or sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {allIndustries.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedIndustry === ind
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading client directory...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Clients Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery ? `No clients matched "${searchQuery}". Try a different keyword.` : 'Start by adding your first enterprise client brand.'}
          </p>
          <Button onClick={openCreateModal} className="mt-4 bg-[#0284c7] text-white text-xs font-bold">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add First Client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0284c7]/40 transition-all flex flex-col justify-between overflow-hidden group bg-white"
            >
              {/* Logo Preview Area */}
              <div className="h-32 bg-slate-50/80 p-4 flex items-center justify-center border-b border-slate-100 relative">
                {client.url ? (
                  <img 
                    src={client.url} 
                    alt={client.name} 
                    className="max-h-20 max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x80?text=' + encodeURIComponent(client.name);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px]">No Logo</span>
                  </div>
                )}

                {client.featured && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Card Details */}
              <CardContent className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0284c7] transition-colors truncate">
                    {client.name}
                  </h3>
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md mt-1">
                    {client.industry || "Enterprise"}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {client.id}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button 
                      onClick={() => openEditModal(client)} 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-slate-600 hover:text-[#0284c7] hover:bg-slate-100"
                      title="Edit Client"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>

                    <Button 
                      onClick={() => handleDelete(client)} 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="font-bold text-base">
                  {editingClient ? `Edit Client: ${editingClient.name}` : 'Add New Client / Brand'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Brand Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Client / Brand Name *</Label>
                <Input 
                  placeholder="e.g. Amul, Baskin Robbins, Starbucks..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              {/* Industry Sector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Industry / Commercial Sector *</Label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                >
                  {INDUSTRIES_LIST.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Client Logo Upload & Preview */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Client Logo Picture *</span>
                  <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, SVG with transparent background recommended</span>
                </Label>

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl hover:border-[#0284c7] hover:bg-slate-50 cursor-pointer transition-colors text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-[#0284c7]" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Direct URL Input */}
                <div className="relative">
                  <Input 
                    placeholder="Or paste direct image URL (https://...)"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>

                {/* Live Logo Preview */}
                {url && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center h-24">
                    <img 
                      src={url} 
                      alt="Logo Preview" 
                      className="max-h-20 max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x80?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Official Website (Optional)</Label>
                <Input 
                  placeholder="https://brandwebsite.com"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#0284c7] focus:ring-[#0284c7] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature prominently on public Clients page
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button 
                  type="submit" 
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs"
                >
                  {editingClient ? 'Save Changes' : 'Create Client'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
