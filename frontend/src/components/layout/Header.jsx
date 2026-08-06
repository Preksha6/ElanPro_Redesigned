import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Filter } from "lucide-react";
import logo from "@/assets/elanpro-logo.png";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/categories?search=${encodeURIComponent(searchQuery)}`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('navbar-search'));
      }
      setMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Catalogues", path: "/catalogues" },
    { name: "Industries", path: "/industries" },
    { name: "Services", path: "/services" },
    { name: "Clients", path: "/clients" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-3 flex items-center justify-between shadow-sm">
        
        {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer flex items-center justify-center bg-primary px-4 py-2 rounded-xl shadow-sm hover:bg-primary/90 transition-colors">
              <img src={logo} alt="Elanpro Logo" className="h-6 md:h-7 w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location === link.path ? "text-accent" : "text-primary hover:text-accent"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative group flex items-center">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all text-primary placeholder:text-gray-400"
                />
                <button type="submit" className="ml-2 p-1 text-gray-400 hover:text-primary transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            <Button asChild variant="default" className="font-semibold shadow-md rounded-full px-6 bg-primary text-white hover:bg-primary/90">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col p-4 gap-2 lg:hidden">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-4">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-base w-full text-primary placeholder:text-gray-400"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 rounded-xl text-base font-semibold ${
                location === link.path ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full mt-2 rounded-full">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}