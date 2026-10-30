import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';
import { productService, reviewService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import EcoImpactCard from '../components/EcoImpactCard';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import toast from 'react-hot-toast';

// Lazy-load 3D product model viewer
const Product3DViewer = lazy(() => import('../components/Product3DViewer'));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI view state
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | '3d'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review submission form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [prodRes, reviewsRes, altRes] = await Promise.all([
          productService.getProductById(id),
          reviewService.getReviews(id),
          productService.getAlternatives(id),
        ]);

        if (prodRes.success) {
          setProduct(prodRes.product);
        } else {
          setError('Product not found');
        }

        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews || []);
        }

        if (altRes.success) {
          setAlternatives(altRes.alternatives || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a verified product review');
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewService.createReview(product._id, {
        rating: newRating,
        comment: newComment,
      });

      if (res.success) {
        toast.success('Thank you! Review submitted successfully');
        setReviews([res.review, ...reviews]);
        setNewComment('');
      }
    } catch (err) {
      toast.error(err.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="h-[480px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ErrorState
          message={error || 'Product not found.'}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-4">
          <Link to="/products">
            <Button variant="primary">Return to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. PRODUCT TOP GALLERY & BUY BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery / 3D Viewer Area */}
        <div className="lg:col-span-6 space-y-4">
          {/* Toggle View Mode Buttons */}
          <div className="flex items-center justify-between pb-1">
            <div className="inline-flex p-1 rounded-xl bg-sage-100 dark:bg-charcoal-800 border border-sage-200 dark:border-charcoal-700">
              <button
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'photo'
                    ? 'bg-white dark:bg-charcoal-900 text-forest-950 dark:text-cream-50 shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-300'
                }`}
              >
                Photo Gallery
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  viewMode === '3d'
                    ? 'bg-white dark:bg-charcoal-900 text-forest-950 dark:text-cream-50 shadow-sm'
                    : 'text-charcoal-600 dark:text-charcoal-300'
                }`}
              >
                <span>3D Interactive Viewer</span>
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
              </button>
            </div>

            <span className="text-xs text-charcoal-500 font-medium">
              Category: {product.category}
            </span>
          </div>

          {/* Main Visual Display */}
          {viewMode === 'photo' ? (
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-sage-50 dark:bg-charcoal-800 border border-sage-200 dark:border-charcoal-700 relative">
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0]}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist toggle"
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur shadow hover:text-rose-600 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorited ? 'fill-rose-500 text-rose-500' : 'text-charcoal-700'
                  }`}
                />
              </button>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="aspect-square w-full rounded-2xl bg-sage-100 dark:bg-charcoal-800 flex items-center justify-center">
                  <p className="text-xs text-charcoal-500">Loading 3D Model...</p>
                </div>
              }
            >
              <Product3DViewer productName={product.name} category={product.category} />
            </Suspense>
          )}

          {/* Image Thumbnails if multiple images exist */}
          {viewMode === 'photo' && product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImageIndex === idx
                      ? 'border-forest-700'
                      : 'border-sage-200 dark:border-charcoal-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-forest-900 text-cream-50 text-xs font-mono font-bold">
                EcoScore: {product.ecoScore}/100
              </span>
              <div className="flex items-center gap-1 text-amber-accent text-xs font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.averageRating?.toFixed(1) || '4.9'}</span>
                <span className="text-charcoal-400">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-cream-50 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-bold font-mono text-forest-950 dark:text-cream-50">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-charcoal-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-xs font-medium text-forest-700 dark:text-sage-300">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          <p className="text-sm text-charcoal-700 dark:text-charcoal-200 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Circular Highlights */}
          <div className="p-4 rounded-xl bg-sage-50 dark:bg-charcoal-800/60 border border-sage-200 dark:border-charcoal-700 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-forest-900 dark:text-cream-50 font-medium">
              <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
              <span>Packaging: {product.ecoImpact?.packagingType || '100% Plastic-Free Compostable Cardboard'}</span>
            </div>
            <div className="flex items-center gap-2 text-forest-900 dark:text-cream-50 font-medium">
              <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
              <span>Material Base: {product.ecoImpact?.materials?.join(', ') || 'Certified Sustainable'}</span>
            </div>
            <div className="flex items-center gap-2 text-forest-900 dark:text-cream-50 font-medium">
              <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
              <span>Estimated Lifetime Plastic Avoidance: {(product.ecoImpact?.plasticAvoidedGrams || 0) / 1000} kg*</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300">
                Quantity:
              </span>
              <div className="flex items-center border border-sage-200 dark:border-charcoal-700 rounded-xl bg-white dark:bg-charcoal-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-charcoal-600 hover:text-forest-900"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-charcoal-600 hover:text-forest-900 disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-charcoal-500">
                {product.stock > 0 ? `(${product.stock} units available)` : 'Out of stock'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 font-bold shadow-md"
                disabled={product.stock <= 0}
                onClick={() => addToCart(product, quantity)}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Conscious Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock <= 0}
                className="font-bold"
              >
                Direct Checkout
              </Button>
            </div>
          </div>

          {/* Logistics Promises */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-sage-200 dark:border-charcoal-800 text-xs text-charcoal-600 dark:text-charcoal-300">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-700" />
              <span>Carbon-neutral dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-forest-700" />
              <span>30-day circular return window</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ECO IMPACT CARD (Mandatory Tier 3) */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
          Environmental Lifecycle Breakdown
        </h2>
        <EcoImpactCard product={product} />
      </section>

      {/* 3. "WHY THIS PRODUCT?" & COMPARISON VS DISPOSABLE ALTERNATIVE */}
      <section className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8">
        <div className="max-w-3xl mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-accent">
            Circularity In Action
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Why It's Better: Sustainable vs. Disposable Alternative
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Real data comparison against typical single-use disposable equivalents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EcoSphere Choice */}
          <div className="p-6 rounded-2xl bg-forest-900 text-cream-50 border border-forest-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sage-300">
                EcoSphere Product
              </span>
              <span className="text-xs font-mono font-bold bg-forest-800 px-2 py-0.5 rounded text-amber-accent">
                EcoScore: {product.ecoScore}
              </span>
            </div>
            <h4 className="font-serif font-bold text-lg">{product.name}</h4>
            <p className="text-xs text-sage-200 leading-relaxed">
              Designed for multi-year reuse with repairable or biodegradable components, diverting virgin plastics and packaging from landfills.
            </p>
            <div className="pt-2 border-t border-forest-800 text-xs font-semibold text-cream-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-accent" />
              <span>Plastic Avoided*: {(product.ecoImpact?.plasticAvoidedGrams || 0) / 1000} kg</span>
            </div>
          </div>

          {/* Disposable Alternative */}
          <div className="p-6 rounded-2xl bg-sage-50 dark:bg-charcoal-800/80 border border-sage-200 dark:border-charcoal-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Conventional Disposable
              </span>
              <span className="text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded">
                EcoScore: &lt;35
              </span>
            </div>
            <h4 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50">
              {product.disposableAlternative?.name || 'Single-use plastic alternative'}
            </h4>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              {product.disposableAlternative?.comparisonNote ||
                'Single-use item that is discarded after minutes of use, taking centuries to fragment into environmental microplastics.'}
            </p>
            <div className="pt-2 border-t border-sage-200 dark:border-charcoal-700 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              Annual Waste Avoided: {product.disposableAlternative?.annualWasteAvoided || 'Eliminates repetitive waste*'}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-charcoal-500 mt-4 italic">
          *Impact values are estimates for comparison and are not scientific certifications.
        </p>
      </section>

      {/* 4. GREENER ALTERNATIVES SUGGESTIONS */}
      {alternatives.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-sage-400">
                Greener Alternatives
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
                Highest Scored in this Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {alternatives.map((alt) => (
              <div
                key={alt._id}
                className="bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-sage-200 dark:border-charcoal-800 shadow-sm flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={alt.images[0]}
                    alt={alt.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 px-1.5 py-0.5 rounded">
                      Score: {alt.ecoScore}
                    </span>
                    <h5 className="font-serif font-semibold text-sm line-clamp-1 mt-1">
                      {alt.name}
                    </h5>
                    <span className="font-mono font-bold text-xs">₹{alt.price}</span>
                  </div>
                </div>
                <Link
                  to={`/product/${alt._id}`}
                  className="mt-3 text-xs font-bold text-forest-800 dark:text-sage-300 hover:underline flex items-center justify-end"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. VERIFIED REVIEWS & RATINGS */}
      <section className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage-100 dark:border-charcoal-800">
          <div>
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Verified customer feedback on durability, materials, and daily utility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-bold text-forest-950 dark:text-cream-50">
              {product.averageRating?.toFixed(1) || '4.9'}
            </span>
            <div className="flex text-amber-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Review Submission Form */}
        <div className="p-6 rounded-2xl bg-sage-50/70 dark:bg-charcoal-800/60 border border-sage-200 dark:border-charcoal-700">
          <h4 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50 mb-3">
            Write a Review
          </h4>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                  Rating:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-accent hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-current' : 'text-charcoal-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience regarding durability, packaging quality, and daily usage..."
                  className="w-full text-xs p-3 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={submittingReview}
              >
                Submit Verified Review
              </Button>
            </form>
          ) : (
            <div className="text-xs text-charcoal-600 dark:text-charcoal-300 flex items-center justify-between">
              <span>Please log in to submit a review and earn EcoPoints.</span>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-charcoal-500 italic">
              No reviews yet. Be the first to share your experience with this circular product.
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-xl border border-sage-100 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-charcoal-900 dark:text-cream-50">
                      {rev.name}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 px-1.5 py-0.5 rounded font-bold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-accent">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-charcoal-700 dark:text-charcoal-200 leading-relaxed">
                  {rev.comment}
                </p>
                <span className="text-[10px] text-charcoal-400 mt-2 block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
