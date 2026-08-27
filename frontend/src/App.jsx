import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/NotFound';
import { useEffect } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import Catalogues from '@/pages/Catalogues';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Industries from '@/pages/Industries';
import Services from '@/pages/Services';
import Clients from '@/pages/Clients';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

import AdminLayout from '@/components/admin/AdminLayout';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ManageCategories from '@/pages/admin/ManageCategories';
import ManageProducts from '@/pages/admin/ManageProducts';
import ManageIndustries from '@/pages/admin/ManageIndustries';
import ManageMessages from '@/pages/admin/ManageMessages';
import ManageClients from '@/pages/admin/ManageClients';

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/catalogues" component={Catalogues} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/industries" component={Industries} />
      <Route path="/services" component={Services} />
      <Route path="/clients" component={Clients} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/categories">
        <AdminLayout>
          <ManageCategories />
        </AdminLayout>
      </Route>
      <Route path="/admin/products">
        <AdminLayout>
          <ManageProducts />
        </AdminLayout>
      </Route>
      <Route path="/admin/industries">
        <AdminLayout>
          <ManageIndustries />
        </AdminLayout>
      </Route>
      <Route path="/admin/messages">
        <AdminLayout>
          <ManageMessages />
        </AdminLayout>
      </Route>
      <Route path="/admin/clients">
        <AdminLayout>
          <ManageClients />
        </AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
