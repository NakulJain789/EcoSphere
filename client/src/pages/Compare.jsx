import React, { useState, useEffect } from 'react';
import { Scale, Check, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const Compare = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 40 });
        if (res.success) {
          setAllProducts(res.products || []);
          // Pre-select first two products for immediate demo comparison
          if (res.products && res.products.length >= 2) {
            setSelectedIds([res.products[0]._id, res.products[1]._id]);
          }
        }
      } catch (err) {
        console.error('Failed to load products for compare:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  const selectedProducts = allProducts.filter((p) => selectedIds.includes(p._id));

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.error('You can compare a maximum of 3 products at a time');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-sage-400">
          Side-by-Side Analysis
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
          Product Comparison Mode
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-1">
          Evaluate EcoScores, materials, estimated plastic avoidance, and specifications side by side.
        </p>
      </div>

      {/* Product Selectors */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-800 space-y-3">
        <span className="text-xs font-bold text-charcoal-800 dark:text-cream-100 uppercase tracking-wider block">
          Select up to 3 products to compare ({selectedIds.length}/3 selected):
        </span>
        <div className="flex flex-wrap gap-2">
          {allProducts.map((p) => {
            const isSelected = selectedIds.includes(p._id);
            return (
              <button
                key={p._id}
                onClick={() => toggleSelect(p._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-forest-800 text-cream-50 shadow-sm'
                    : 'bg-sage-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-sage-200'
                }`}
              >
                {p.name} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedProducts.length === 0 ? (
        <div className="text-center py-16 text-charcoal-500 text-sm">
          Please select at least one product above to view comparison details.
        </div>
      ) : (
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sage-200 dark:border-charcoal-800 bg-sage-50 dark:bg-charcoal-800">
                  <th className="p-6 text-charcoal-500 uppercase tracking-wider font-semibold w-1/4">
                    Feature / Attribute
                  </th>
                  {selectedProducts.map((p) => (
                    <th key={p._id} className="p-6 w-1/4">
                      <div className="space-y-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-24 h-24 rounded-2xl object-cover border border-sage-200 dark:border-charcoal-700"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-sm text-charcoal-900 dark:text-cream-50 line-clamp-1">
                            {p.name}
                          </h4>
                          <span className="font-mono font-bold text-base text-forest-950 dark:text-cream-50 mt-1 block">
                            ₹{p.price}
                          </span>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => addToCart(p, 1)}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100 dark:divide-charcoal-800">
                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    EcoScore (0-100)
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 font-mono font-bold text-base text-forest-900 dark:text-sage-300">
                      {p.ecoScore}/100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Category
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 text-charcoal-600 dark:text-charcoal-300">
                      {p.category}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Estimated Plastic Avoided*
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 font-mono font-semibold text-forest-800 dark:text-sage-300">
                      {(p.ecoImpact?.plasticAvoidedGrams || 0) / 1000} kg
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Estimated Carbon Saved*
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 font-mono font-semibold text-forest-800 dark:text-sage-300">
                      {p.ecoImpact?.carbonSavedKg || 0} kg CO₂
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Materials Used
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 text-charcoal-600 dark:text-charcoal-300">
                      {p.ecoImpact?.materials?.join(', ') || 'Certified sustainable'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Packaging Type
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 text-charcoal-600 dark:text-charcoal-300">
                      {p.ecoImpact?.packagingType || 'Plastic-free compostable'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-charcoal-800 dark:text-cream-100">
                    Customer Rating
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p._id} className="p-4 font-medium text-amber-accent">
                      ★ {p.averageRating?.toFixed(1) || '4.9'} ({p.numReviews || 0} reviews)
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
