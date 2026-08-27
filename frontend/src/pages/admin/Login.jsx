import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ArrowLeft, Home } from 'lucide-react';
import logo from '@/assets/elanpro-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully.",
      });
      setLocation('/admin');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 relative">
      
      {/* Top Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold gap-2">
            <ArrowLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
            Back to Homepage
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950 text-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-5">
            <img src={logo} alt="Elanpro Logo" className="h-9 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-display font-black tracking-tight text-white">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Enter your credentials to access the commercial management console
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@elanpro.net" 
                  className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
            <Link href="/" className="w-full">
              <Button type="button" variant="outline" className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold">
                Return to Public Website
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
