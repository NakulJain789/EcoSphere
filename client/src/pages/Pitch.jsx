import React from 'react';
import { ShieldCheck, Award, Layers, Sparkles, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Pitch = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Executive Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-accent font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          DevCamp 2.0 Task 3 Hackathon Pitch Deck
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 dark:text-cream-50 leading-tight">
          EcoSphere: Shop Better. Impact The Planet Less.
        </h1>
        <p className="text-base sm:text-lg text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
          The next-generation MERN e-commerce platform bridging quantified circular analytics, zero-greenwashing lifecycle scoring, and interactive 3D web immersion.
        </p>
      </div>

      {/* 1. Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            The Problem
          </span>
          <h3 className="font-serif font-bold text-2xl text-charcoal-900 dark:text-cream-50">
            Rampant Greenwashing & Disposable Commerce
          </h3>
          <p className="text-xs text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            Over 91% of consumer plastics are never recycled. Modern e-commerce is plagued with meaningless "eco-friendly" badges without data, zero-cost shipping wrapped in multi-layer bubble wrap, and non-durable products designed for landfills.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-forest-50/50 dark:bg-forest-950/30 border border-forest-200 dark:border-forest-900 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-400">
            The EcoSphere Solution
          </span>
          <h3 className="font-serif font-bold text-2xl text-charcoal-900 dark:text-cream-50">
            Algorithmic Circularity & Tangible Impact
          </h3>
          <p className="text-xs text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            EcoSphere scores every single SKU across 5 lifecycle dimensions (EcoScore 0–100), tracks personal plastic avoidance in real time, rewards habits through community challenges, and packages everything in 100% compostable materials.
          </p>
        </div>
      </div>

      {/* 2. Architecture & Tech Stack */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-forest-700" />
          <h3 className="font-serif font-bold text-2xl text-charcoal-900 dark:text-cream-50">
            Full-Stack Engineering Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-sage-50 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700 space-y-2">
            <span className="font-bold text-forest-800 dark:text-sage-300 text-sm block">Frontend</span>
            <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              React 18, Vite, React Router 6, Tailwind CSS, Three.js, React Three Fiber, React Three Drei, Framer Motion, Axios.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sage-50 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700 space-y-2">
            <span className="font-bold text-forest-800 dark:text-sage-300 text-sm block">Backend REST API</span>
            <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              Node.js, Express, Helmet security headers, CORS origin whitelist, Express rate-limiters, JWT tokens, bcryptjs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sage-50 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700 space-y-2">
            <span className="font-bold text-forest-800 dark:text-sage-300 text-sm block">Database & Storage</span>
            <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              MongoDB & Mongoose schemas with atomic stock updates, compound indexes, and embedded MongoDB engine fallback for zero-configuration testing.
            </p>
          </div>
        </div>
      </div>

      {/* 3. DevCamp 2.0 Brief Compliance Matrix */}
      <div className="bg-forest-900 text-cream-50 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-accent">
            Comprehensive Verification
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl mt-1">
            100% Brief Compliance Matrix
          </h3>
          <p className="text-xs text-sage-200 mt-1">
            Every compulsory requirement and all 8 bonus challenges engineered to production quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Tier 1: Auth & JWT Protected Routes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Tier 1: Dynamic Products & Category Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Tier 1: Cart, Checkout & Orders in MongoDB</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 1: Role-Based Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 2: Cloudinary / CDN Image Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 3: COD & Sandbox Payment Gateways</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 4: Persistent Customer Wishlist</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 5: Verified Reviews & Auto Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 6: Advanced Filter, Sort & URL Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 7: Interactive Order Status Stepper</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Bonus 8: Skeletons, Toasts & Error Boundaries</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-accent flex-shrink-0" />
            <span>Tier 4: 3D Globe & Product 3D Viewer</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link to="/products">
          <Button variant="primary" size="lg" className="font-bold">
            Explore EcoSphere Live Platform
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Pitch;
