import { useEffect, useState } from 'react';
import { useLocation, Link, Route, Switch } from 'wouter';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Tags, 
  Package, 
  Building2, 
  LogOut,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && location.startsWith('/admin')) {
        setLocation('/admin/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && location.startsWith('/admin')) {
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Inquiries', href: '/admin/messages', icon: MessageSquare },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Industries', href: '/admin/industries', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/admin">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 cursor-pointer">
                ElanPro Admin
              </span>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="outline" className="w-full justify-start text-zinc-600 dark:text-zinc-400" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-semibold">Admin Panel</span>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
