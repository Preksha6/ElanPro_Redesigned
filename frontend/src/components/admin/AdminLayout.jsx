import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Tags, 
  Package, 
  Building2, Users, 
  LogOut,
  Menu,
  X,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Home,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/elanpro-logo.png';

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && location.startsWith('/admin') && location !== '/admin/login') {
        setLocation('/admin/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && location.startsWith('/admin') && location !== '/admin/login') {
        setLocation('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [location, setLocation]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLocation('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <div className="w-10 h-10 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Equipment', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Customer Inquiries', href: '/admin/messages', icon: MessageSquare },
    { name: 'Industries', href: '/admin/industries', icon: Building2 },
    { name: 'Clients & Brands', href: '/admin/clients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Link href="/admin">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="Elanpro Logo" className="h-7 w-auto object-contain" />
              <span className="text-[10px] font-mono tracking-widest text-[#0284c7] uppercase font-bold border-l border-slate-700 pl-2">
                Admin
              </span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Admin Management
          </div>

          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-[#0284c7] text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </Link>
            );
          })}

          {/* Quick Website Navigation Section */}
          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Live Website</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          
          <Link href="/">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-sky-400" />
                <span>Visit Homepage</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </Link>

          <Link href="/products">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-indigo-400" />
                <span>Product Catalogue</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </Link>

          <Link href="/categories">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Tags className="w-4 h-4 text-emerald-400" />
                <span>Browse Categories</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </Link>
        </nav>

        {/* User / Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5 mb-3 px-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-[#0284c7]">
              AD
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-200 truncate">Commercial Admin</span>
              <span className="block text-[10px] text-slate-400 truncate font-mono">admin@elanpro.net</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center text-xs font-bold text-slate-300 border-slate-800 hover:bg-red-950/50 hover:text-red-400 hover:border-red-900 transition-colors h-9" 
            onClick={handleSignOut}
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </Button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-slate-900 dark:text-white text-sm hidden sm:inline-block">
              ElanPro Admin Panel
            </span>
          </div>

          {/* Quick Action Top Buttons */}
          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="h-9 text-xs font-bold text-slate-700 hover:text-[#0284c7] border-slate-200 hover:bg-slate-50 gap-1.5">
              <Link href="/">
                <Home className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Visit Homepage</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="h-9 text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-2xs gap-1.5">
              <Link href="/products">
                <Package className="w-3.5 h-3.5" />
                <span>Product Catalogue</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
