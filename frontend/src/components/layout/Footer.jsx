import { Link } from "wouter";
import logo from "@/assets/elanpro-logo.png";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block w-fit">
              <img src={logo} alt="Elanpro Logo" className="h-10 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's leading commercial refrigeration brand. Delivering world-class cooling solutions for hospitality, retail, healthcare, and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors cursor-pointer">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors cursor-pointer">Services & Support</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors cursor-pointer">Industries</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors cursor-pointer">Contact Us</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Products</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">Commercial Refrigeration</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">Food Service Equipment</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">Beverage Dispensers</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">Medical Cooling</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors cursor-pointer">Minibars</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-display font-semibold text-lg mb-6">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Elanpro Corporate Office, Sector 44, Gurugram, Haryana 122003, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">sales@elanpro.net</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Elanpro. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>);

}