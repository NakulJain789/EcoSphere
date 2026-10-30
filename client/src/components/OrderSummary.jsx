import React from 'react';
import Button from './common/Button';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

const OrderSummary = ({
  subtotal = 0,
  shipping = 0,
  grandTotal = 0,
  totalPlasticAvoided = 0,
  totalCarbonSaved = 0,
  avgEcoScore = 0,
  onCheckout,
  checkoutButtonText = 'Proceed to Checkout',
  isCheckoutLoading = false,
  showCheckoutButton = true,
}) => {
  return (
    <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
      <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50 mb-4 pb-3 border-b border-sage-100 dark:border-charcoal-800">
        Order Summary
      </h3>

      {/* Financial Rows */}
      <div className="space-y-3 text-sm text-charcoal-600 dark:text-charcoal-300">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono font-semibold text-charcoal-900 dark:text-cream-50">
            ₹{subtotal}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span>Shipping</span>
            {shipping === 0 && subtotal > 0 && (
              <span className="text-[10px] bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 px-1.5 py-0.5 rounded font-bold">
                FREE
              </span>
            )}
          </span>
          <span className="font-mono font-semibold text-charcoal-900 dark:text-cream-50">
            {shipping === 0 ? '₹0' : `₹${shipping}`}
          </span>
        </div>

        {subtotal > 0 && subtotal < 999 && (
          <p className="text-[11px] text-amber-accent">
            Add ₹{999 - subtotal} more for free plastic-free shipping!
          </p>
        )}

        <div className="pt-3 border-t border-sage-200 dark:border-charcoal-800 flex justify-between items-baseline">
          <span className="text-base font-bold text-charcoal-900 dark:text-cream-50">
            Grand Total
          </span>
          <span className="text-2xl font-bold font-mono text-forest-950 dark:text-cream-50">
            ₹{grandTotal}
          </span>
        </div>
      </div>

      {/* Estimated Eco Impact Certificate Card */}
      {(totalPlasticAvoided > 0 || avgEcoScore > 0) && (
        <div className="mt-6 p-4 rounded-xl bg-sage-50 dark:bg-charcoal-800/80 border border-sage-200 dark:border-charcoal-700">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-sage-300 mb-2">
            <Sparkles className="w-4 h-4 text-amber-accent" />
            <span>Estimated Environmental Contribution*</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white dark:bg-charcoal-900 p-2.5 rounded-lg border border-sage-100 dark:border-charcoal-700">
              <span className="text-[10px] text-charcoal-500 block">Plastic Avoided*</span>
              <span className="font-mono font-bold text-forest-700 dark:text-sage-300 text-sm">
                {(totalPlasticAvoided / 1000).toFixed(2)} kg
              </span>
            </div>
            <div className="bg-white dark:bg-charcoal-900 p-2.5 rounded-lg border border-sage-100 dark:border-charcoal-700">
              <span className="text-[10px] text-charcoal-500 block">Carbon Saved*</span>
              <span className="font-mono font-bold text-forest-700 dark:text-sage-300 text-sm">
                {totalCarbonSaved.toFixed(1)} kg CO₂
              </span>
            </div>
          </div>

          <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 mt-2 italic leading-tight">
            *Impact values are estimates for comparison and are not scientific certifications.
          </p>
        </div>
      )}

      {/* Checkout Action Button */}
      {showCheckoutButton && (
        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            onClick={onCheckout}
            isLoading={isCheckoutLoading}
            disabled={subtotal === 0}
          >
            <span>{checkoutButtonText}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      )}

      {/* Reassurance Badges */}
      <div className="mt-4 pt-4 border-t border-sage-100 dark:border-charcoal-800 space-y-2 text-xs text-charcoal-500 dark:text-charcoal-400">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-forest-700" />
          <span>100% plastic-free compostable packaging</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-forest-700" />
          <span>Transparent circular lifecycle audit</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
