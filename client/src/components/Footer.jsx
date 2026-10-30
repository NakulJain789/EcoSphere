import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-950 text-cream-100 pt-16 pb-12 border-t border-forest-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center font-serif text-2xl font-bold">
                E
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                EcoSphere
              </span>
            </Link>
            <p className="text-xs text-sage-300 leading-relaxed max-w-sm">
              Shop better. Impact the planet less. A full-stack sustainable e-commerce platform built on honest circular economics, verified lifecycle analytics, and plastic avoidance.
            </p>
            <div className="text-[11px] text-sage-400 italic">
              *Impact values are estimates for comparison and are not scientific certifications.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-cream-50">
              Explore Catalog
            </h4>
            <ul className="space-y-2 text-xs text-sage-300">
              <li>
                <Link to="/products" className="hover:text-cream-50 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Reusable+Essentials" className="hover:text-cream-50 transition">
                  Reusable Essentials
                </Link>
              </li>
              <li>
                <Link to="/products?category=Zero+Waste" className="hover:text-cream-50 transition">
                  Zero Waste Home
                </Link>
              </li>
              <li>
                <Link to="/products?minEcoScore=80" className="hover:text-cream-50 transition">
                  EcoScore 80+ Top Tier
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cream-50 transition">
                  Compare Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Impact & Methodology */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-cream-50">
              Circularity & Tools
            </h4>
            <ul className="space-y-2 text-xs text-sage-300">
              <li>
                <Link to="/how-ecoscore-works" className="hover:text-cream-50 transition">
                  How EcoScore Works
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-cream-50 transition">
                  My Impact Ledger
                </Link>
              </li>
              <li>
                <Link to="/pitch" className="hover:text-cream-50 text-amber-accent font-semibold transition">
                  Hackathon Pitch Deck
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-cream-50 transition">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-cream-50">
              Sustainability Promises
            </h4>
            <div className="space-y-2 text-xs text-sage-300">
              <p>📦 100% Plastic-free compostable boxes</p>
              <p>🚚 Carbon-neutral ground fulfillment</p>
              <p>🌱 Ethical Fair-Trade artisan partners</p>
              <p>🔒 Transparent zero-greenwashing data</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>© {new Date().getFullYear()} EcoSphere. DevCamp 2.0 Task 3 Submission.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for the Earth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
