import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import { productService } from "../services/api";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

const categories = [
  "All",
  "Reusable Essentials",
  "Sustainable Home",
  "Sustainable Fashion",
  "Personal Care",
  "Zero Waste",
  "Upcycled",
  "Travel",
  "Eco Tech Accessories",
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialMinEcoScore = searchParams.get("minEcoScore") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter local state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [minEcoScore, setMinEcoScore] = useState(initialMinEcoScore);
  const [sortOption, setSortOption] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    setSearchInput(searchParams.get("search") || "");
    setMinEcoScore(searchParams.get("minEcoScore") || "");
    setSortOption(searchParams.get("sort") || "newest");
    setPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchInput.trim() !== "" ? searchInput.trim() : undefined,
          minEcoScore: minEcoScore ? Number(minEcoScore) : undefined,
        };

        const res = await productService.getProducts(params);
        console.log("PRODUCT API RESPONSE:", res);
        const productList = Array.isArray(res) ? res : res.products || [];
        setProducts(productList);
        setTotalCount(res.total || productList.length);
        setTotalPages(res.pages || 1);
      } catch (err) {
        console.error("Error fetching catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchInput, minEcoScore, sortOption, page]);

  // Update URL search parameters
  const updateUrlParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clean up empty params
    Object.keys(merged).forEach((key) => {
      if (!merged[key] || merged[key] === "All" || merged[key] === "") {
        delete merged[key];
      }
    });

    setSearchParams(merged);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setPage(1);
    updateUrlParams({ category, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrlParams({ search: searchInput, page: 1 });
  };

  const handleEcoScoreToggle = () => {
    const nextVal = minEcoScore === "80" ? "" : "80";
    setMinEcoScore(nextVal);
    setPage(1);
    updateUrlParams({ minEcoScore: nextVal, page: 1 });
  };

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    setSortOption(nextSort);
    setPage(1);
    updateUrlParams({ sort: nextSort, page: 1 });
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSearchInput("");
    setMinEcoScore("");
    setSortOption("newest");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Verified Sustainable Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Shop Conscious Essentials
          </h1>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-1">
            Showing {totalCount} verified zero-waste and circular products from
            MongoDB.
          </p>
        </div>

        {/* Search Bar & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 sm:w-64"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by material, tag..."
              className="w-full text-xs py-2.5 pl-9 pr-4 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </form>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="text-xs py-2.5 pl-3 pr-8 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-600 appearance-none font-medium"
            >
              <option value="newest">Sort: Newest Arrival</option>
              <option value="ecoscore">Sort: Highest EcoScore</option>
              <option value="rating">Sort: Top Customer Rated</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400" />
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-sage-200 dark:border-charcoal-800">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === category
                ? "bg-forest-800 text-cream-50 shadow-sm"
                : "bg-white dark:bg-charcoal-900 text-charcoal-700 dark:text-charcoal-200 border border-sage-200 dark:border-charcoal-700 hover:border-forest-600"
            }`}
          >
            {category}
          </button>
        ))}

        {/* 80+ EcoScore Filter Pill */}
        <button
          onClick={handleEcoScoreToggle}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            minEcoScore === "80"
              ? "bg-amber-accent text-white shadow-sm"
              : "bg-amber-50 dark:bg-amber-950/30 text-amber-accentDark dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100"
          }`}
        >
          <span>Score 80+ Only</span>
          {minEcoScore === "80" && <X className="w-3.5 h-3.5" />}
        </button>

        {/* Reset button if filters active */}
        {(selectedCategory !== "All" || searchInput || minEcoScore) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline ml-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No sustainable products matched your filter"
          description="Try broadening your category or resetting the EcoScore threshold to view our complete circular lineup."
          actionLabel="Clear Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => {
                  const p = Math.max(1, page - 1);
                  setPage(p);
                  updateUrlParams({ page: p });
                }}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-charcoal-600 dark:text-charcoal-300 font-medium px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => {
                  const p = Math.min(totalPages, page + 1);
                  setPage(p);
                  updateUrlParams({ page: p });
                }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
