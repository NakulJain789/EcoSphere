import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { orderService } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-sage-300 border-forest-300';
    case 'Shipped':
      return 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200';
    case 'Confirmed':
      return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200';
    default:
      return 'bg-sage-100 text-charcoal-700 dark:bg-charcoal-800 dark:text-charcoal-200 border-sage-300';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-10 w-1/4 mb-6" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Placed Yet"
          description="You haven't placed any sustainable orders yet. Start exploring to build your circular impact history."
          actionLabel="Start Shopping"
          onAction={() => (window.location.href = '/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
          Account History
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
          Your Sustainable Orders ({orders.length})
        </h1>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1">
          Review past shipments, tracking status, and quantified plastic avoidance records.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sage-100 dark:border-charcoal-800">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">
                    Order Ref
                  </span>
                  <span className="font-mono font-bold text-xs text-charcoal-900 dark:text-cream-50">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">
                    Date Placed
                  </span>
                  <span className="text-xs text-charcoal-700 dark:text-charcoal-300 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">
                    Total
                  </span>
                  <span className="font-mono font-bold text-xs text-forest-950 dark:text-cream-50">
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <Link to={`/orders/${order._id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Items Thumbnails row */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-sage-200 dark:border-charcoal-700"
                    />
                    <div className="max-w-[140px]">
                      <p className="text-xs font-medium text-charcoal-800 dark:text-cream-50 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-charcoal-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Environmental Impact Tag */}
              {order.impactSummary?.totalPlasticAvoidedGrams > 0 && (
                <div className="bg-sage-50 dark:bg-charcoal-800/80 px-3 py-1.5 rounded-xl border border-sage-200 dark:border-charcoal-700 text-xs text-forest-800 dark:text-sage-300 font-medium">
                  🌱 Avoided approx. {(order.impactSummary.totalPlasticAvoidedGrams / 1000).toFixed(2)} kg plastic*
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
