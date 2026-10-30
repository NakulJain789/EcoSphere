import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success) {
        setWishlist(res.wishlist || []);
      }
    } catch (err) {
      console.warn('Could not load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast('Please login to save to wishlist', { icon: '🌿' });
      return;
    }

    const productId = product._id;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
        await wishlistService.removeFromWishlist(productId);
        toast.success(`Removed "${product.name}" from wishlist`);
      } else {
        setWishlist((prev) => [...prev, product]);
        await wishlistService.addToWishlist(productId);
        toast.success(`Added "${product.name}" to wishlist`);
      }
    } catch (error) {
      toast.error(error.message);
      fetchWishlist(); // Revert on failure
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
