import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { productService, challengeService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';

// Lazy-load 3D Hero to avoid blocking first paint
const Hero3DCanvas = lazy(() => import('../components/Hero3DCanvas'));

const categories = [
  { name: 'Reusable Essentials', count: '4 items', icon: '🍶' },
  { name: 'Sustainable Home', count: '4 items', icon: '🏡' },
  { name: 'Sustainable Fashion', count: '3 items', icon: '🌿' },
  { name: 'Personal Care', count: '4 items', icon: '🫧' },
  { name: 'Zero Waste', count: '3 items', icon: '♻️' },
  { name: 'Upcycled', count: '3 items', icon: '🧵' },
  { name: 'Travel', count: '3 items', icon: '🎒' },
  { name: 'Eco Tech Accessories', count: '4 items', icon: '⚡' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [picks, setPicks] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [productsRes, picksRes, challengesRes] = await Promise.all([
          productService.getProducts({ featured: 'true', limit: 8 }),
          productService.getPicks(),
          challengeService.getChallenges(),
        ]);

        if (productsRes.success) setFeaturedProducts(productsRes.products || []);
        if (picksRes.success) setPicks(picksRes.picks || {});
        if (challengesRes.success) setChallenges(challengesRes.challenges || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. 3D HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-[#F2ECDF] via-[#F8F5EF] to-[#F8F5EF] dark:from-[#142A24] dark:via-[#111312] dark:to-[#111312] border-b border-sage-200/60 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900/60 text-forest-900 dark:text-sage-300 border border-forest-300 dark:border-forest-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-forest-700 animate-pulse"></span>
              Verified Sustainable Circular Goods
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-950 dark:text-cream-50 leading-[1.15] tracking-tight">
              Shop better.{' '}
              <span className="italic font-normal block sm:inline text-forest-800 dark:text-sage-300">
                Impact the planet less.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-700 dark:text-charcoal-200 max-w-xl leading-relaxed">
              Every item is scored on material integrity, lifetime reusability, and plastic avoidance. Zero greenwashing—just quantifiable planetary savings.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" className="font-bold shadow-lg">
                  Explore Catalog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/products?minEcoScore=80">
                <Button variant="secondary" size="lg" className="font-semibold">
                  View 80+ EcoScore
                </Button>
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sage-200/80 dark:border-charcoal-800 text-xs text-charcoal-600 dark:text-charcoal-300">
              <div>
                <span className="block font-mono text-xl font-bold text-forest-900 dark:text-cream-50">
                  28+
                </span>
                <span>Verified products</span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-forest-900 dark:text-cream-50">
                  100%
                </span>
                <span>Plastic-free shipping</span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-forest-900 dark:text-cream-50">
                  0-100
                </span>
                <span>Lifecycle EcoScore</span>
              </div>
            </div>
          </div>

          {/* 3D Earth-like Canvas */}
          <div className="lg:col-span-5 h-[350px] sm:h-[450px] relative flex items-center justify-center">
            <Suspense
              fallback={
                <div className="w-64 h-64 rounded-full bg-forest-900/10 dark:bg-forest-900/40 animate-pulse" />
              }
            >
              <Hero3DCanvas />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-forest-800 dark:text-sage-300 hover:underline flex items-center gap-1"
          >
            <span>All 8 Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 hover:border-forest-600 dark:hover:border-sage-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <div>
                <h4 className="font-serif font-semibold text-charcoal-900 dark:text-cream-50 text-sm group-hover:text-forest-700 dark:group-hover:text-sage-300 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-charcoal-500 mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. ECOSPHERE PICKS (Dynamic from DB) */}
      {picks && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest-900 text-cream-50 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-cream-100 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-accent" />
                Algorithmically Computed Picks
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
                EcoSphere Picks of the Week
              </h2>
              <p className="text-sm text-sage-200 max-w-xl mb-8">
                Recognizing the highest performing circular designs across score, durability, and daily reusability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {picks.bestEcoScore && (
                  <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-accent">
                        Highest EcoScore
                      </span>
                      <h4 className="font-serif font-semibold text-base text-cream-50 mt-1 line-clamp-1">
                        {picks.bestEcoScore.name}
                      </h4>
                      <p className="text-xs text-sage-200 mt-1 line-clamp-2">
                        {picks.bestEcoScore.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-forest-700/80 flex items-center justify-between">
                      <span className="font-mono font-bold text-cream-50 text-sm">
                        ₹{picks.bestEcoScore.price}
                      </span>
                      <Link
                        to={`/product/${picks.bestEcoScore._id}`}
                        className="text-xs font-semibold text-amber-accent hover:underline flex items-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )}

                {picks.mostReusable && (
                  <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-accent">
                        Top Reusable Essential
                      </span>
                      <h4 className="font-serif font-semibold text-base text-cream-50 mt-1 line-clamp-1">
                        {picks.mostReusable.name}
                      </h4>
                      <p className="text-xs text-sage-200 mt-1 line-clamp-2">
                        {picks.mostReusable.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-forest-700/80 flex items-center justify-between">
                      <span className="font-mono font-bold text-cream-50 text-sm">
                        ₹{picks.mostReusable.price}
                      </span>
                      <Link
                        to={`/product/${picks.mostReusable._id}`}
                        className="text-xs font-semibold text-amber-accent hover:underline flex items-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )}

                {picks.betterHome && (
                  <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-accent">
                        Better Home Pick
                      </span>
                      <h4 className="font-serif font-semibold text-base text-cream-50 mt-1 line-clamp-1">
                        {picks.betterHome.name}
                      </h4>
                      <p className="text-xs text-sage-200 mt-1 line-clamp-2">
                        {picks.betterHome.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-forest-700/80 flex items-center justify-between">
                      <span className="font-mono font-bold text-cream-50 text-sm">
                        ₹{picks.betterHome.price}
                      </span>
                      <Link
                        to={`/product/${picks.betterHome._id}`}
                        className="text-xs font-semibold text-amber-accent hover:underline flex items-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )}

                {picks.consciousTravel && (
                  <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-accent">
                        Conscious Travel
                      </span>
                      <h4 className="font-serif font-semibold text-base text-cream-50 mt-1 line-clamp-1">
                        {picks.consciousTravel.name}
                      </h4>
                      <p className="text-xs text-sage-200 mt-1 line-clamp-2">
                        {picks.consciousTravel.shortDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-forest-700/80 flex items-center justify-between">
                      <span className="font-mono font-bold text-cream-50 text-sm">
                        ₹{picks.consciousTravel.price}
                      </span>
                      <Link
                        to={`/product/${picks.consciousTravel._id}`}
                        className="text-xs font-semibold text-amber-accent hover:underline flex items-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW ECO-SCORE WORKS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-100 dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 rounded-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-sage-400">
                Transparent Methodology
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50">
                How EcoScore (0–100) Works
              </h2>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                Rather than accepting vague "eco-friendly" claims, our algorithm weights 5 lifecycle factors: Material (25%), Reusability (25%), Packaging (20%), Durability (15%), and Recyclability (15%).
              </p>
              <div className="pt-2">
                <Link to="/how-ecoscore-works">
                  <Button variant="outline" size="sm" className="font-semibold">
                    Read the Full Methodology & Assumptions
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white dark:bg-charcoal-800 p-4 rounded-xl border border-sage-200 dark:border-charcoal-700">
                <span className="font-mono font-bold text-forest-800 dark:text-sage-300 text-lg">25%</span>
                <p className="font-semibold text-charcoal-900 dark:text-cream-50 mt-1">Material Integrity</p>
                <p className="text-charcoal-500 text-[11px] mt-0.5">Organic, reclaimed, or recycled base</p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 p-4 rounded-xl border border-sage-200 dark:border-charcoal-700">
                <span className="font-mono font-bold text-forest-800 dark:text-sage-300 text-lg">25%</span>
                <p className="font-semibold text-charcoal-900 dark:text-cream-50 mt-1">Daily Reusability</p>
                <p className="text-charcoal-500 text-[11px] mt-0.5">Eliminates single-use waste</p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 p-4 rounded-xl border border-sage-200 dark:border-charcoal-700">
                <span className="font-mono font-bold text-forest-800 dark:text-sage-300 text-lg">20%</span>
                <p className="font-semibold text-charcoal-900 dark:text-cream-50 mt-1">Plastic-Free Pack</p>
                <p className="text-charcoal-500 text-[11px] mt-0.5">Compostable paper, zero polybags</p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 p-4 rounded-xl border border-sage-200 dark:border-charcoal-700">
                <span className="font-mono font-bold text-forest-800 dark:text-sage-300 text-lg">30%</span>
                <p className="font-semibold text-charcoal-900 dark:text-cream-50 mt-1">Durability & Recyclability</p>
                <p className="text-charcoal-500 text-[11px] mt-0.5">End-of-life circular design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
              Community Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
              Featured Sustainable Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-forest-800 dark:text-sage-300 hover:underline flex items-center gap-1"
          >
            <span>Explore All 28 Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. WEEKLY CHALLENGE SNAPSHOT */}
      {challenges.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-accent">
                <Award className="w-4 h-4" />
                <span>Weekly Community Eco Challenge</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
                {challenges[0].title}
              </h3>
              <p className="text-sm text-charcoal-600 dark:text-charcoal-300 max-w-xl">
                {challenges[0].description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-charcoal-500 block">Reward</span>
                <span className="font-mono font-bold text-forest-800 dark:text-sage-300 text-lg">
                  +{challenges[0].points} EcoPoints
                </span>
              </div>
              <Link to="/impact">
                <Button variant="primary" size="md">
                  Join Challenge
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. KEEP IT IN THE LOOP (Coming Soon honest circular cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Circular Lifecycle
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Keep It In The Loop
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Every product we make has a planned next life. Here is what is launching next:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sage-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300">
              Coming Soon
            </span>
            <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-charcoal-900 dark:text-cream-50 text-base mb-1">
              EcoSphere Resell
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              Trade in gently used gear for store credits. We inspect, sanitize, and list on our verified pre-loved circular hub.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sage-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300">
              Coming Soon
            </span>
            <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-charcoal-900 dark:text-cream-50 text-base mb-1">
              Community Donate
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              Direct pre-paid shipping labels to route warm blankets, totes, and apparel to certified local grassroots partners.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sage-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300">
              Coming Soon
            </span>
            <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-charcoal-900 dark:text-cream-50 text-base mb-1">
              Zero-Waste Takeback
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              Send back end-of-life safety razor blades or brass ware. We melt and recast them into our next generation line.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
