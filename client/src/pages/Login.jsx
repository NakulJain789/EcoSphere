import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
        toast.success('Welcome to EcoSphere! You earned 50 EcoPoints welcome bonus.');
      } else {
        await login(email, password);
        toast.success('Logged in successfully!');
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role = 'customer') => {
    try {
      setDemoLoading(true);
      await demoLogin(role);
      toast.success(`Signed in as ${role === 'admin' ? 'Admin' : 'Customer'} demo user!`);
      navigate(role === 'admin' ? '/admin' : redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-forest-900 text-cream-50 items-center justify-center font-serif text-2xl font-bold shadow-md">
            E
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50">
            {isRegisterMode ? 'Join EcoSphere' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-300">
            {isRegisterMode
              ? 'Start tracking your plastic-avoidance impact today.'
              : 'Sign in to access your orders and impact dashboard.'}
          </p>
        </div>

        {/* Demo Mode Quick Buttons (Judges Convenience) */}
        <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-900 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900 dark:text-sage-300">
            <Sparkles className="w-4 h-4 text-amber-accent" />
            <span>Judge / Reviewer Quick Demo Login</span>
          </div>
          <p className="text-[11px] text-charcoal-600 dark:text-charcoal-300">
            One-click test accounts pre-populated with order history and impact statistics:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={demoLoading}
              onClick={() => handleDemoSignIn('customer')}
              className="text-xs font-semibold py-2"
            >
              Demo Customer
            </Button>
            <Button
              type="button"
              variant="amber"
              size="sm"
              isLoading={demoLoading}
              onClick={() => handleDemoSignIn('admin')}
              className="text-xs font-semibold py-2"
            >
              Demo Admin Panel
            </Button>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <Input
                label="Full Name"
                id="name"
                required
                icon={User}
                placeholder="Aarav Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              id="password"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={isRegisterMode ? 'Must be at least 6 characters' : ''}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md mt-2"
              isLoading={loading}
            >
              {isRegisterMode ? 'Create Account (+50 EcoPoints)' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle between register and login */}
          <div className="mt-6 text-center pt-4 border-t border-sage-100 dark:border-charcoal-800">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-semibold text-forest-700 dark:text-sage-300 hover:underline"
            >
              {isRegisterMode
                ? 'Already have an account? Sign in here'
                : "Don't have an account yet? Register for free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
