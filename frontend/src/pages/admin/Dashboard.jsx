import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tags, Package, Building2, Wrench } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    industries: 0,
    services: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: categories },
          { count: products },
          { count: industries },
          { count: services }
        ] = await Promise.all([
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('industries').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          categories: categories || 0,
          products: products || 0,
          industries: industries || 0,
          services: services || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Categories', value: stats.categories, icon: Tags, color: 'text-blue-500' },
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-green-500' },
    { title: 'Total Industries', value: stats.industries, icon: Building2, color: 'text-purple-500' },
    { title: 'Total Services', value: stats.services, icon: Wrench, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
