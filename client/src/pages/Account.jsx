import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Award, ShieldCheck, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Account = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center font-serif text-3xl font-bold shadow-md">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
            {user?.name}
          </h1>
          <p className="text-xs text-charcoal-500">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300">
              🌱 Tier: {user?.ecoJourneyStage || 'Seed'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-accent">
              {user?.ecoPoints || 0} EcoPoints
            </span>
            {isAdmin && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700">
                Admin Role
              </span>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/orders"
          className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 hover:border-forest-600 shadow-sm transition flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-4">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
              My Orders
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Track delivery progress and order receipts.
            </p>
          </div>
          <span className="text-xs font-bold text-forest-700 dark:text-sage-300 flex items-center gap-1 mt-4">
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/impact"
          className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 hover:border-forest-600 shadow-sm transition flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
              My Impact Ledger
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Plastic avoided, Eco Journey, and weekly challenges.
            </p>
          </div>
          <span className="text-xs font-bold text-forest-700 dark:text-sage-300 flex items-center gap-1 mt-4">
            <span>View Impact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/wishlist"
          className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 hover:border-forest-600 shadow-sm transition flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
              Saved Wishlist
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Products you plan to incorporate into your life.
            </p>
          </div>
          <span className="text-xs font-bold text-forest-700 dark:text-sage-300 flex items-center gap-1 mt-4">
            <span>View Wishlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {isAdmin && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-accent" />
            <div>
              <h4 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
                Admin Privileges Active
              </h4>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300">
                You have administrative access to manage products and update customer orders.
              </p>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="amber" size="sm">
              Open Admin Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;
