import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getProductsFromDB } from '@/lib/productService';
import { getClientsFromDB } from '@/lib/clientService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Tags, 
  Package, 
  Building2,
  Users,
  MessageSquare, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  ShieldCheck,
  Layers,
  Sparkles,
  Home
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    categoriesCount: 12,
    productsCount: 0,
    industriesCount: 4,
    clientsCount: 19,
    messagesCount: 0,
    unreadMessages: 0
  });
  const [products, setProducts] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // 1. Fetch products from database service
        const allProducts = await getProductsFromDB();
        setProducts(allProducts || []);

        // 2. Compute category counts
        const breakdown = {};
        allProducts.forEach(p => {
          const cat = p.category || "Professional Kitchen";
          breakdown[cat] = (breakdown[cat] || 0) + 1;
        });
        setCategoryBreakdown(breakdown);

        // 3. Fetch inquiries and categories count
        const [
          { count: msgCount },
          { data: unreadData },
          { count: indCount },
          allClients
        ] = await Promise.all([
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id').eq('status', 'unread'),
          supabase.from('industries').select('*', { count: 'exact', head: true }),
          getClientsFromDB()
        ]);

        setStats({
          categoriesCount: Object.keys(breakdown).length || 12,
          productsCount: allProducts.length,
          industriesCount: indCount || 4,
          clientsCount: (allClients || []).length || 19,
          messagesCount: msgCount || 0,
          unreadMessages: (unreadData || []).length
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { 
      title: 'Commercial Equipment', 
      value: stats.productsCount, 
      subtitle: 'Models in Catalogue',
      icon: Package, 
      color: 'text-sky-600',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200/80',
      link: '/admin/products'
    },
    { 
      title: 'Product Categories', 
      value: stats.categoriesCount, 
      subtitle: '12 Industry Segments',
      icon: Tags, 
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200/80',
      link: '/admin/categories'
    },
    { 
      title: 'Enterprise Clients', 
      value: stats.clientsCount, 
      subtitle: 'Brand Partnerships',
      icon: Users, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/80',
      link: '/admin/clients'
    },
    { 
      title: 'Customer Inquiries', 
      value: stats.messagesCount, 
      subtitle: `${stats.unreadMessages} Unread Quotes`,
      icon: MessageSquare, 
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/80',
      link: '/admin/messages'
    },
    { 
      title: 'Target Industries', 
      value: stats.industriesCount, 
      subtitle: 'Hospitality, Pharma, Retail, Bar',
      icon: Building2, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/80',
      link: '/admin/industries'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0284c7] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-2 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Elanpro Commercial Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight">Admin Operations Center</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Manage your commercial cooling catalogue, technical specifications, category hierarchies, and client quote requests.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold gap-2">
            <Link href="/">
              <Home className="w-4 h-4 text-sky-300" /> Visit Homepage
            </Link>
          </Button>
          <Button asChild className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-md">
            <Link href="/admin/products">
              <Plus className="w-4 h-4 mr-1.5" /> Add Equipment
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <Card className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border ${stat.border}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-black text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center justify-between">
                  <span>{stat.subtitle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Grid: Categories Breakdown & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0284c7]" /> Equipment by Category
            </h2>
            <Link href="/admin/categories">
              <span className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer">
                Manage All →
              </span>
            </Link>
          </div>

          <Card className="p-4 divide-y divide-slate-100">
            {Object.entries(categoryBreakdown).map(([catName, count]) => (
              <div key={catName} className="py-3 px-2 flex items-center justify-between text-sm hover:bg-slate-50/80 rounded-lg transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  <span className="font-semibold text-slate-800">{catName}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                  {count} {count === 1 ? 'model' : 'models'}
                </span>
              </div>
            ))}
            {Object.keys(categoryBreakdown).length === 0 && (
              <div className="py-8 text-center text-sm text-slate-400">
                Loading categories...
              </div>
            )}
          </Card>
        </div>

        {/* Recent Catalogue Items Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Featured Catalogue Equipment
            </h2>
            <Link href="/admin/products">
              <span className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer">
                View All {products.length} Products →
              </span>
            </Link>
          </div>

          <Card className="overflow-hidden border-slate-200/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Model & Category</th>
                    <th className="py-3 px-4">Dimensions</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.slice(0, 7).map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4">
                        <img 
                          src={prod.image || '/product-images/image1.png'} 
                          alt={prod.name} 
                          className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-xs text-[#0284c7] font-semibold">{prod.category}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-600">
                        {prod.dimensions || 'Standard'}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Link href={`/products/${prod.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-600 hover:text-[#0284c7]">
                            View <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
