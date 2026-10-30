import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-sage-200 dark:border-charcoal-800 last:border-b-0">
      {/* Item info */}
      <div className="flex items-center gap-4">
        <Link to={`/product/${item.product}`} className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-20 h-20 rounded-xl object-cover border border-sage-200 dark:border-charcoal-700 bg-sage-50 dark:bg-charcoal-800"
          />
        </Link>
        <div>
          <Link
            to={`/product/${item.product}`}
            className="font-serif font-semibold text-charcoal-900 dark:text-cream-50 hover:text-forest-700 transition-colors text-sm line-clamp-1"
          >
            {item.name}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-500">
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              ₹{item.price}
            </span>
            <span>•</span>
            <span className="bg-sage-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 px-2 py-0.5 rounded text-[11px] font-semibold">
              Score: {item.ecoScore}
            </span>
          </div>
          {item.plasticAvoidedGrams > 0 && (
            <p className="text-[11px] text-sage-600 dark:text-sage-400 mt-1">
              🌱 Avoids {(item.plasticAvoidedGrams / 1000).toFixed(2)} kg plastic*
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Price Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center border border-sage-200 dark:border-charcoal-700 rounded-xl bg-white dark:bg-charcoal-900">
          <button
            onClick={() => onUpdateQuantity(item.product, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="p-2 text-charcoal-600 dark:text-charcoal-300 hover:text-forest-900 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-mono font-bold text-charcoal-900 dark:text-cream-50">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
            className="p-2 text-charcoal-600 dark:text-charcoal-300 hover:text-forest-900 transition disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[70px]">
          <span className="text-sm font-bold font-mono text-charcoal-900 dark:text-cream-50">
            ₹{item.price * item.quantity}
          </span>
        </div>

        <button
          onClick={() => onRemove(item.product)}
          aria-label="Remove item"
          className="p-2 text-charcoal-400 hover:text-rose-600 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
