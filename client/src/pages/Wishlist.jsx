import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your Circular Wishlist is Empty"
          description="Save sustainable products you wish to adopt into your daily low-waste lifestyle."
          actionLabel="Explore Catalog"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
          Saved Items
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
          Your Circular Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1">
          Move your favorite verified products to your cart whenever you are ready.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          if (!product || typeof product === 'string') return null;

          return (
            <div
              key={product._id}
              className="bg-white dark:bg-charcoal-900 rounded-2xl border border-sage-200 dark:border-charcoal-800 p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sage-50 dark:bg-charcoal-800 mb-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-charcoal-900/90 text-rose-500 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-forest-900 text-cream-50">
                    EcoScore: {product.ecoScore}
                  </span>
                </div>

                <Link to={`/product/${product._id}`}>
                  <h4 className="font-serif font-semibold text-sm text-charcoal-900 dark:text-cream-50 line-clamp-1 hover:text-forest-700">
                    {product.name}
                  </h4>
                </Link>
                <p className="text-xs font-mono font-bold text-forest-900 dark:text-cream-50 mt-1">
                  ₹{product.price}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-sage-100 dark:border-charcoal-800 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product);
                  }}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  Move to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
