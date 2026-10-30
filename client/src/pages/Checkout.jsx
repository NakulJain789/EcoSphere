import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import OrderSummary from '../components/OrderSummary';
import toast from 'react-hot-toast';

const Checkout = () => {
  const {
    cartItems,
    subtotal,
    shipping,
    grandTotal,
    totalPlasticAvoided,
    totalCarbonSaved,
    avgEcoScore,
    clearCart,
  } = useCart();
  const { user, updateUserEcoStats } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Form State with validation
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '+91 98765 43210',
    address: '42 Green Avenue, Sector 14',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'CARD_DEMO' | 'UPI_DEMO'
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
    if (!shippingAddress.address.trim()) errors.address = 'Street address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please complete all required delivery details');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      };

      const res = await orderService.createOrder(orderPayload);

      if (res.success && res.order) {
        if (res.pointsEarned) {
          updateUserEcoStats(res.pointsEarned);
        }
        clearCart();
        toast.success(`Order placed successfully! You earned ${res.pointsEarned || 50} EcoPoints!`);
        navigate(`/orders/${res.order._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-sage-200 dark:border-charcoal-800">
        <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
          Step 2 of 2
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
          Delivery Details & Conscious Payment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Delivery Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Details */}
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50 mb-4 pb-2 border-b border-sage-100 dark:border-charcoal-800">
              1. Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  id="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  error={formErrors.fullName}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Phone Number"
                  id="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  error={formErrors.phone}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  id="address"
                  required
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  error={formErrors.address}
                />
              </div>

              <Input
                label="City"
                id="city"
                required
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                error={formErrors.city}
              />

              <Input
                label="State"
                id="state"
                required
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, state: e.target.value })
                }
                error={formErrors.state}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Postal / PIN Code"
                  id="postalCode"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  error={formErrors.postalCode}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50 mb-4 pb-2 border-b border-sage-100 dark:border-charcoal-800">
              2. Payment Method
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery (Compulsory requirement, fully active) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-forest-700 bg-forest-50/50 dark:bg-forest-950/30'
                    : 'border-sage-200 dark:border-charcoal-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-forest-700 focus:ring-forest-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-forest-700" />
                    <span className="font-semibold text-xs text-charcoal-900 dark:text-cream-50">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-sage-300 font-bold px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Pay securely upon receipt. 100% plastic-free packaging.
                  </p>
                </div>
              </label>

              {/* Card (Demo Sandbox Mode) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'CARD_DEMO'
                    ? 'border-forest-700 bg-forest-50/50 dark:bg-forest-950/30'
                    : 'border-sage-200 dark:border-charcoal-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD_DEMO"
                  checked={paymentMethod === 'CARD_DEMO'}
                  onChange={() => setPaymentMethod('CARD_DEMO')}
                  className="mt-1 text-forest-700 focus:ring-forest-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-forest-700" />
                    <span className="font-semibold text-xs text-charcoal-900 dark:text-cream-50">
                      Credit / Debit Card (Sandbox Test Mode)
                    </span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-accent font-bold px-1.5 py-0.5 rounded">
                      Demo Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Demo simulation. No real financial transaction processed.
                  </p>
                </div>
              </label>

              {/* UPI (Demo Mode) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'UPI_DEMO'
                    ? 'border-forest-700 bg-forest-50/50 dark:bg-forest-950/30'
                    : 'border-sage-200 dark:border-charcoal-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI_DEMO"
                  checked={paymentMethod === 'UPI_DEMO'}
                  onChange={() => setPaymentMethod('UPI_DEMO')}
                  className="mt-1 text-forest-700 focus:ring-forest-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-forest-700" />
                    <span className="font-semibold text-xs text-charcoal-900 dark:text-cream-50">
                      UPI / Instant QR (Demo Mode)
                    </span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-accent font-bold px-1.5 py-0.5 rounded">
                      Demo Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Simulated zero-fee payment for hackathon demonstration.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order Action */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            totalPlasticAvoided={totalPlasticAvoided}
            totalCarbonSaved={totalCarbonSaved}
            avgEcoScore={avgEcoScore}
            onCheckout={handlePlaceOrder}
            checkoutButtonText="Confirm & Place Order"
            isCheckoutLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
