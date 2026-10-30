import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecosphere_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ecosphere_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} units available in stock`);
          return prevItems;
        }
        toast.success(`Updated "${product.name}" quantity to ${newQty}`);
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} units available`);
          return prevItems;
        }
        toast.success(`Added "${product.name}" to cart`);
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            stock: product.stock,
            ecoScore: product.ecoScore,
            plasticAvoidedGrams: product.ecoImpact?.plasticAvoidedGrams || 0,
            carbonSavedKg: product.ecoImpact?.carbonSavedKg || 0,
            isReusable: product.ecoImpact?.isReusable || false,
            quantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          if (newQuantity > item.stock) {
            toast.error(`Only ${item.stock} units available in stock`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product === productId);
      if (item) toast.success(`Removed "${item.name}" from cart`);
      return prevItems.filter((i) => i.product !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  // Impact calculations in cart
  const totalPlasticAvoided = cartItems.reduce(
    (acc, item) => acc + item.plasticAvoidedGrams * item.quantity,
    0
  );
  const totalCarbonSaved = cartItems.reduce(
    (acc, item) => acc + item.carbonSavedKg * item.quantity,
    0
  );
  const avgEcoScore =
    totalItemsCount > 0
      ? Math.round(
          cartItems.reduce((acc, item) => acc + item.ecoScore * item.quantity, 0) /
            totalItemsCount
        )
      : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        shipping,
        grandTotal,
        totalPlasticAvoided,
        totalCarbonSaved,
        avgEcoScore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
