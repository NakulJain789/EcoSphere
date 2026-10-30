import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { orderService } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';

const steps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.message || 'Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ErrorState message={error || 'Order not found'} />
        <div className="mt-4">
          <Link to="/orders">
            <Button variant="primary">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button & title */}
      <div>
        <Link
          to="/orders"
          className="text-xs font-semibold text-forest-700 dark:text-sage-300 hover:underline flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Order History
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <span className="text-xs text-charcoal-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* 1. ORDER STATUS TRACKER STEPPER (Tier 2 Bonus) */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-sm">
        <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50 mb-6">
          Shipment Progress
        </h3>

        <div className="relative flex items-center justify-between">
          {/* Background Connecting Bar */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-sage-200 dark:bg-charcoal-800 -z-0"></div>
          {/* Active Progress Bar */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-forest-700 dark:bg-sage-400 -z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 90}%`,
            }}
          ></div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                    isCompleted
                      ? 'bg-forest-800 text-cream-50'
                      : 'bg-white dark:bg-charcoal-800 border-2 border-sage-300 dark:border-charcoal-700 text-charcoal-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCurrent
                      ? 'text-forest-900 dark:text-cream-50 font-bold'
                      : isCompleted
                      ? 'text-forest-700 dark:text-sage-300'
                      : 'text-charcoal-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ORDER IMPACT SUMMARY (Tier 3) */}
      {order.impactSummary && (
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 text-cream-50 rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-accent mb-2">
            <Sparkles className="w-4 h-4" />
            <span>EcoSphere Verified Contribution</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-4">
            Environmental Impact of this Purchase
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-forest-800/80 p-3 rounded-xl border border-forest-700">
              <span className="text-[10px] text-sage-300 block">Plastic Avoided*</span>
              <span className="font-mono font-bold text-lg text-cream-50">
                {(order.impactSummary.totalPlasticAvoidedGrams / 1000).toFixed(2)} kg
              </span>
            </div>
            <div className="bg-forest-800/80 p-3 rounded-xl border border-forest-700">
              <span className="text-[10px] text-sage-300 block">Carbon Saved*</span>
              <span className="font-mono font-bold text-lg text-cream-50">
                {order.impactSummary.totalCarbonSavedKg} kg CO₂
              </span>
            </div>
            <div className="bg-forest-800/80 p-3 rounded-xl border border-forest-700">
              <span className="text-[10px] text-sage-300 block">Avg EcoScore</span>
              <span className="font-mono font-bold text-lg text-cream-50">
                {order.impactSummary.avgEcoScore}/100
              </span>
            </div>
            <div className="bg-forest-800/80 p-3 rounded-xl border border-forest-700">
              <span className="text-[10px] text-sage-300 block">Packaging</span>
              <span className="font-semibold text-xs text-cream-50">
                100% Plastic-Free
              </span>
            </div>
          </div>
          <p className="text-[10px] text-sage-300 mt-3 italic">
            *Impact values are estimates for comparison and are not scientific certifications.
          </p>
        </div>
      )}

      {/* 3. ORDER ITEMS & ADDRESS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="md:col-span-7 bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
          <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50 mb-4 pb-2 border-b border-sage-100 dark:border-charcoal-800">
            Items in Order ({order.orderItems.length})
          </h3>

          <div className="space-y-4 divide-y divide-sage-100 dark:divide-charcoal-800">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-sage-200 dark:border-charcoal-700"
                  />
                  <div>
                    <h5 className="font-serif font-semibold text-xs text-charcoal-900 dark:text-cream-50 line-clamp-1">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-charcoal-500 font-mono mt-0.5">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-xs text-charcoal-900 dark:text-cream-50">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Financial Totals */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm text-xs space-y-3">
            <h4 className="font-serif font-bold text-sm text-charcoal-900 dark:text-cream-50 pb-2 border-b border-sage-100 dark:border-charcoal-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-forest-700" />
              Delivery Destination
            </h4>
            <p className="font-semibold text-charcoal-800 dark:text-cream-100">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-charcoal-600 dark:text-charcoal-300">
              {order.shippingAddress?.address}
            </p>
            <p className="text-charcoal-600 dark:text-charcoal-300">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-charcoal-600 dark:text-charcoal-300">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm text-xs space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-charcoal-900 dark:text-cream-50 pb-2 border-b border-sage-100 dark:border-charcoal-800">
              Payment Breakdown
            </h4>
            <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
              <span>Items Subtotal</span>
              <span className="font-mono font-semibold">₹{order.itemsPrice}</span>
            </div>
            <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
              <span>Plastic-Free Delivery</span>
              <span className="font-mono font-semibold">
                {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
              </span>
            </div>
            <div className="pt-2 border-t border-sage-200 dark:border-charcoal-800 flex justify-between text-sm font-bold text-charcoal-900 dark:text-cream-50">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="font-mono text-forest-900 dark:text-cream-50">
                ₹{order.totalPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
