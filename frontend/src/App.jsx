import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/NotFound';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import Catalogues from '@/pages/Catalogues';
import Products from '@/pages/Products';
import Industries from '@/pages/Industries';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/catalogues" component={Catalogues} />
      <Route path="/products" component={Products} />
      <Route path="/industries" component={Industries} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>);

}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;