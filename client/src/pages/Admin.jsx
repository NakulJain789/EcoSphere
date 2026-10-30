import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { productService, orderService } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const categories = [
  'Sustainable Home',
  'Reusable Essentials',
  'Sustainable Fashion',
  'Personal Care',
  'Zero Waste',
  'Upcycled',
  'Travel',
  'Eco Tech Accessories',
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: 'Reusable Essentials',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    materialScore: 24,
    reusabilityScore: 24,
    packagingScore: 20,
    durabilityScore: 14,
    recyclabilityScore: 14,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        orderService.getAllOrders(),
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (orderRes.success) setOrders(orderRes.orders || []);
    } catch (err) {
      toast.error(err.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        shortDescription: newProduct.shortDescription || newProduct.description.substring(0, 100),
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
        stock: Number(newProduct.stock),
        category: newProduct.category,
        images: newProduct.images,
        ecoBreakdown: {
          material: Number(newProduct.materialScore),
          reusability: Number(newProduct.reusabilityScore),
          packaging: Number(newProduct.packagingScore),
          durability: Number(newProduct.durabilityScore),
          recyclability: Number(newProduct.recyclabilityScore),
        },
      };

      const res = await productService.createProduct(payload);
      if (res.success) {
        toast.success('Product created successfully in MongoDB!');
        setShowAddModal(false);
        setNewProduct({
          name: '',
          description: '',
          shortDescription: '',
          price: '',
          originalPrice: '',
          stock: '',
          category: 'Reusable Essentials',
          images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
          materialScore: 24,
          reusabilityScore: 24,
          packagingScore: 20,
          durabilityScore: 14,
          recyclabilityScore: 14,
        });
        loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from MongoDB?`)) {
      try {
        const res = await productService.deleteProduct(id);
        if (res.success) {
          toast.success('Product deleted');
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete product');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sage-200 dark:border-charcoal-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-accent text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-cream-50">
              Admin Control Center
            </h1>
            <p className="text-xs text-charcoal-500">
              Role-based management: Products CRUD, order tracking, and stock synchronization.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={loading}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-sage-200 dark:border-charcoal-800 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'products'
              ? 'border-forest-700 text-forest-900 dark:text-cream-50'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Products Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-forest-700 text-forest-900 dark:text-cream-50'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sage-50 dark:bg-charcoal-800 border-b border-sage-200 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">EcoScore</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100 dark:divide-charcoal-800">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-sage-50/50 dark:hover:bg-charcoal-800/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-charcoal-900 dark:text-cream-50">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-charcoal-400">ID: {p._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-charcoal-600 dark:text-charcoal-300">
                      {p.category}
                    </td>
                    <td className="p-4 font-mono font-bold text-charcoal-900 dark:text-cream-50">
                      ₹{p.price}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono font-semibold ${
                          p.stock < 10 ? 'text-amber-accent' : 'text-forest-700 dark:text-sage-300'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300">
                        {p.ecoScore}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sage-50 dark:bg-charcoal-800 border-b border-sage-200 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status & Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100 dark:divide-charcoal-800">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-sage-50/50 dark:hover:bg-charcoal-800/40">
                    <td className="p-4">
                      <p className="font-mono font-bold text-charcoal-900 dark:text-cream-50">
                        #{o._id.substring(o._id.length - 8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-charcoal-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-charcoal-900 dark:text-cream-50">
                        {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-charcoal-400">{o.user?.email}</p>
                    </td>
                    <td className="p-4 text-charcoal-600 dark:text-charcoal-300">
                      {o.orderItems.reduce((acc, i) => acc + i.quantity, 0)} items
                    </td>
                    <td className="p-4 font-mono font-bold text-forest-950 dark:text-cream-50">
                      ₹{o.totalPrice}
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-charcoal-700 dark:text-charcoal-200">
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-forest-900 dark:text-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-charcoal-900 w-full max-w-2xl rounded-3xl border border-sage-200 dark:border-charcoal-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sage-100 dark:border-charcoal-800">
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
                Add New Sustainable Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-charcoal-400 hover:text-charcoal-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input
                label="Product Name"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Handcrafted Bamboo Cutlery Travel Set"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="899"
                />
                <Input
                  label="Original Price (₹)"
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  placeholder="1199"
                />
                <Input
                  label="Stock Count"
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full text-sm py-2.5 px-3.5 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL with fallback */}
              <div>
                <Input
                  label="Product Image URL (Cloudinary / CDN)"
                  required
                  value={newProduct.images[0]}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Cloudinary / Image host fallback: paste direct image URL or use uncompressed web link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Detailed material breakdown, reusability benefits, and origin story..."
                  className="w-full text-xs p-3 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900"
                />
              </div>

              {/* EcoScore Breakdown sliders */}
              <div className="p-4 rounded-xl bg-sage-50 dark:bg-charcoal-800 space-y-3">
                <span className="text-xs font-bold text-forest-900 dark:text-sage-300 uppercase tracking-wider block">
                  EcoScore Factors (Total: {Number(newProduct.materialScore) + Number(newProduct.reusabilityScore) + Number(newProduct.packagingScore) + Number(newProduct.durabilityScore) + Number(newProduct.recyclabilityScore)}/100)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-charcoal-500 mb-1">Material (0-25)</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={newProduct.materialScore}
                      onChange={(e) => setNewProduct({ ...newProduct, materialScore: e.target.value })}
                      className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-charcoal-500 mb-1">Reusability (0-25)</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={newProduct.reusabilityScore}
                      onChange={(e) => setNewProduct({ ...newProduct, reusabilityScore: e.target.value })}
                      className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-charcoal-500 mb-1">Packaging (0-20)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={newProduct.packagingScore}
                      onChange={(e) => setNewProduct({ ...newProduct, packagingScore: e.target.value })}
                      className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-charcoal-500 mb-1">Durability (0-15)</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={newProduct.durabilityScore}
                      onChange={(e) => setNewProduct({ ...newProduct, durabilityScore: e.target.value })}
                      className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-charcoal-500 mb-1">Recyclability (0-15)</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={newProduct.recyclabilityScore}
                      onChange={(e) => setNewProduct({ ...newProduct, recyclabilityScore: e.target.value })}
                      className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-sage-100 dark:border-charcoal-800">
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={submitting}>
                  Save Product to MongoDB
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
