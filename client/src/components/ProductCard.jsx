import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);

  // Determine badge styling based on EcoScore
  const getEcoScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-forest-900 text-cream-50 border-forest-800';
    if (score >= 80) return 'bg-forest-700 text-cream-50 border-forest-600';
    return 'bg-sage-600 text-white border-sage-500';
  };

  return (
    <div className="group relative bg-white dark:bg-charcoal-900 rounded-2xl border border-sage-200/90 dark:border-charcoal-800 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sage-50 dark:bg-charcoal-800 mb-3.5">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* EcoScore Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${getEcoScoreBadgeColor(
                product.ecoScore
              )}`}
              title="EcoScore out of 100 based on materials, reusability, packaging, and circularity"
            >
              <span>Score</span>
              <span className="font-mono">{product.ecoScore}</span>
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Save to Wishlist"
            className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur text-charcoal-700 dark:text-cream-50 hover:text-rose-600 transition shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>

          {/* Impact Quick Chip */}
          {product.ecoImpact?.plasticAvoidedGrams > 0 && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-forest-950/80 backdrop-blur text-[11px] font-medium text-cream-100 py-1 px-2.5 rounded-lg flex items-center justify-between">
              <span>Plastic Avoided*:</span>
              <span className="font-semibold text-sage-300">
                {(product.ecoImpact.plasticAvoidedGrams / 1000).toFixed(1)} kg
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-center justify-between text-xs text-sage-600 dark:text-sage-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-accent font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.averageRating?.toFixed(1) || '4.8'}</span>
              <span className="text-charcoal-400 dark:text-charcoal-500">
                ({product.numReviews || 0})
              </span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-serif font-semibold text-base text-charcoal-900 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-sage-300 transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 mb-3">
            {product.shortDescription || product.description}
          </p>
        </div>
      </div>

      {/* Price & Action */}
      <div className="pt-3 border-t border-sage-100 dark:border-charcoal-800 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-forest-950 dark:text-cream-50">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-charcoal-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-sage-600 dark:text-sage-400 block">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.stock <= 0}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-50 text-xs font-semibold transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
