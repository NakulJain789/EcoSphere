import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    grandTotal,
    totalPlasticAvoided,
    totalCarbonSaved,
    avgEcoScore,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Conscious Cart is Empty"
          description="Explore our curated catalog of durable, plastic-free alternatives to start avoiding landfill waste today."
          actionLabel="Explore Catalog"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-sage-200 dark:border-charcoal-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Shopping Cart
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Review Conscious Items ({cartItems.length})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-charcoal-500 hover:text-rose-600 transition flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
          <div className="divide-y divide-sage-100 dark:divide-charcoal-800">
            {cartItems.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="pt-6 mt-4 border-t border-sage-100 dark:border-charcoal-800 flex items-center justify-between">
            <Link
              to="/products"
              className="text-xs font-bold text-forest-700 dark:text-sage-300 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Dynamic Order Summary & Impact preview */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            totalPlasticAvoided={totalPlasticAvoided}
            totalCarbonSaved={totalCarbonSaved}
            avgEcoScore={avgEcoScore}
            onCheckout={() => navigate('/checkout')}
            checkoutButtonText="Proceed to Delivery & Payment"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
