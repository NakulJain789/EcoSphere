import React from 'react';
import { Leaf, Recycle, Box, ShieldCheck, Flame, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const EcoImpactCard = ({ product }) => {
  if (!product) return null;

  const breakdown = product.ecoBreakdown || {
    material: 22,
    reusability: 23,
    packaging: 18,
    durability: 13,
    recyclability: 13,
  };

  const impact = product.ecoImpact || {};

  return (
    <div className="rounded-2xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sage-100 dark:border-charcoal-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center font-mono font-bold text-xl shadow-sm">
            {product.ecoScore}
          </div>
          <div>
            <h4 className="font-serif font-bold text-charcoal-900 dark:text-cream-50 text-base flex items-center gap-2">
              <span>EcoScore Index</span>
              <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300">
                {product.ecoScore >= 90 ? 'Top Tier Eco' : product.ecoScore >= 80 ? 'High Impact Saver' : 'Mindful Choice'}
              </span>
            </h4>
            <p className="text-xs text-charcoal-500">
              Score breakdown out of 100 based on circular lifecycle analysis
            </p>
          </div>
        </div>

        <Link
          to="/how-ecoscore-works"
          className="text-xs font-semibold text-forest-700 dark:text-sage-300 hover:underline flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          Methodology
        </Link>
      </div>

      {/* 5-Factor Score Breakdown Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 py-5 border-b border-sage-100 dark:border-charcoal-800">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Material</span>
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              {breakdown.material}/25
            </span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-charcoal-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.material / 25) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Reusability</span>
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              {breakdown.reusability}/25
            </span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-charcoal-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.reusability / 25) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Packaging</span>
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              {breakdown.packaging}/20
            </span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-charcoal-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.packaging / 20) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Durability</span>
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              {breakdown.durability}/15
            </span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-charcoal-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.durability / 15) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-charcoal-700 dark:text-charcoal-200">Recyclability</span>
            <span className="font-mono font-bold text-forest-800 dark:text-sage-300">
              {breakdown.recyclability}/15
            </span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-charcoal-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.recyclability / 15) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Specific Environmental Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-5 pb-3">
        <div className="p-3.5 rounded-xl bg-sage-50/70 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700">
          <span className="text-[11px] text-charcoal-500 block mb-1">Plastic Avoided*</span>
          <span className="text-base font-bold font-mono text-forest-900 dark:text-cream-50">
            {(impact.plasticAvoidedGrams || 0) / 1000} kg
          </span>
          <span className="text-[10px] text-charcoal-400 block mt-0.5">lifetime estimation</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sage-50/70 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700">
          <span className="text-[11px] text-charcoal-500 block mb-1">Carbon Saved*</span>
          <span className="text-base font-bold font-mono text-forest-900 dark:text-cream-50">
            {impact.carbonSavedKg || 0} kg CO₂
          </span>
          <span className="text-[10px] text-charcoal-400 block mt-0.5">lifecycle footprint</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sage-50/70 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700">
          <span className="text-[11px] text-charcoal-500 block mb-1">Packaging</span>
          <span className="text-xs font-semibold text-forest-900 dark:text-cream-50 line-clamp-2">
            {impact.packagingType || 'Plastic-Free Kraft'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sage-50/70 dark:bg-charcoal-800 border border-sage-100 dark:border-charcoal-700">
          <span className="text-[11px] text-charcoal-500 block mb-1">Primary Materials</span>
          <span className="text-xs font-semibold text-forest-900 dark:text-cream-50 line-clamp-2">
            {impact.materials?.join(', ') || 'Natural organic fibers'}
          </span>
        </div>
      </div>

      {/* Mandatory Honesty Rule Disclaimer */}
      <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 italic pt-2">
        *Impact values are estimates for comparison and are not scientific certifications.
      </p>
    </div>
  );
};

export default EcoImpactCard;
