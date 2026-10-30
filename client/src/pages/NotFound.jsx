import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <span className="font-mono text-xs font-bold text-amber-accent tracking-widest uppercase">
            Error 404
          </span>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Path Not Found
          </h1>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-2">
            The page you are looking for has either been relocated or does not exist. Let's guide you back to our circular catalog.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">Browse Catalog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
