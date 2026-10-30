import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Package,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { challengeService, orderService } from '../services/api';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const stages = [
  { name: 'Seed', minPoints: 0, maxPoints: 99, icon: '🌱', desc: 'Starting your plastic-free journey' },
  { name: 'Sprout', minPoints: 100, maxPoints: 299, icon: '🌿', desc: 'Consistent zero-waste habits formed' },
  { name: 'Grower', minPoints: 300, maxPoints: 599, icon: '🪴', desc: 'Active community waste diverter' },
  { name: 'Earth Keeper', minPoints: 600, maxPoints: 9999, icon: '🌍', desc: 'Mastery in circular living and climate leadership' },
];

const Impact = () => {
  const { user, updateUserEcoStats } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        const [chalRes, ordRes] = await Promise.all([
          challengeService.getChallenges(),
          orderService.getMyOrders(),
        ]);

        if (chalRes.success) setChallenges(chalRes.challenges || []);
        if (ordRes.success) setOrders(ordRes.orders || []);
      } catch (err) {
        console.error('Failed to load impact data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const totalPoints = user?.ecoPoints || 0;
  const currentStageIndex = stages.findIndex(
    (s) => totalPoints >= s.minPoints && totalPoints <= s.maxPoints
  );
  const currentStage = stages[currentStageIndex !== -1 ? currentStageIndex : 0];
  const nextStage = stages[currentStageIndex + 1];

  // Calculate total impact across user's orders
  const totalPlasticAvoidedKg = orders.reduce(
    (acc, o) => acc + (o.impactSummary?.totalPlasticAvoidedGrams || 0),
    0
  ) / 1000;

  const totalCarbonSavedKg = orders.reduce(
    (acc, o) => acc + (o.impactSummary?.totalCarbonSavedKg || 0),
    0
  );

  const totalItemsCount = orders.reduce(
    (acc, o) => acc + o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const totalReusableCount = orders.reduce(
    (acc, o) => acc + (o.impactSummary?.reusableItemsCount || 0),
    0
  );

  const handleCompleteChallenge = async (id, points) => {
    try {
      setCompletingId(id);
      const res = await challengeService.completeChallenge(id);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        toast.success(res.message);
        updateUserEcoStats(points);
      }
    } catch (err) {
      toast.error(err.message || 'Could not complete challenge');
    } finally {
      setCompletingId(null);
    }
  };

  const isChallengeCompleted = (challengeId) => {
    return user?.completedChallenges?.some(
      (c) => (c.challenge?._id || c.challenge || c) === challengeId
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-sage-400">
          Personal Sustainability Ledger
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
          My Impact & Circular Journey
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mt-1">
          Track your real planetary contribution, unlock higher eco badges, and participate in weekly challenges.
        </p>
      </div>

      {/* 1. ECO JOURNEY STAGE & PROGRESS */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 text-cream-50 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-amber-accent text-xs font-bold">
              <span>Current Status</span>
              <span>•</span>
              <span>Stage {currentStageIndex + 1} of 4</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentStage.icon}</span>
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                  {currentStage.name} Tier
                </h2>
                <p className="text-xs text-sage-200 mt-0.5">{currentStage.desc}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-sage-200 mb-1.5 font-semibold">
                <span>{totalPoints} EcoPoints Earned</span>
                {nextStage ? (
                  <span>{nextStage.minPoints - totalPoints} points to {nextStage.name}</span>
                ) : (
                  <span>Maximum Tier Achieved! 🎉</span>
                )}
              </div>
              <div className="w-full bg-forest-950/80 h-3 rounded-full overflow-hidden border border-forest-700">
                <div
                  className="bg-amber-accent h-full rounded-full transition-all duration-700"
                  style={{
                    width: nextStage
                      ? `${Math.min(100, Math.max(10, (totalPoints / nextStage.minPoints) * 100))}%`
                      : '100%',
                  }}
                />
              </div>
            </div>

            <p className="text-[11px] text-sage-300 pt-1">
              Earn EcoPoints with every purchase (10 pts per ₹100 + bonus plastic avoidance) and by completing weekly zero-waste challenges.
            </p>
          </div>

          {/* Growing Tree/Globe Art display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-forest-800/60 border border-forest-700 text-center">
            <div className="w-28 h-28 rounded-full bg-forest-900/90 border-2 border-amber-accent flex items-center justify-center text-5xl shadow-inner mb-3">
              {currentStage.icon}
            </div>
            <span className="font-serif font-bold text-lg text-cream-50">
              Eco Tree: {currentStage.name}
            </span>
            <span className="text-[11px] text-sage-300 mt-0.5">
              Evolves as you divert waste
            </span>
          </div>
        </div>
      </div>

      {/* 2. AGGREGATE IMPACT METRICS */}
      <section className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
          Your Cumulative Planetary Savings*
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 block mb-1">
              Estimated Plastic Avoided*
            </span>
            <span className="font-mono text-3xl font-bold text-forest-950 dark:text-cream-50">
              {totalPlasticAvoidedKg.toFixed(2)} kg
            </span>
            <span className="text-[11px] text-charcoal-500 block mt-1">
              Equivalent to ~{(totalPlasticAvoidedKg * 25).toFixed(0)} single-use bottles
            </span>
          </div>

          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 block mb-1">
              Estimated Carbon Diverted*
            </span>
            <span className="font-mono text-3xl font-bold text-forest-950 dark:text-cream-50">
              {totalCarbonSavedKg.toFixed(1)} kg
            </span>
            <span className="text-[11px] text-charcoal-500 block mt-1">
              Across verified lifecycle audits
            </span>
          </div>

          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 block mb-1">
              Sustainable Items Bought
            </span>
            <span className="font-mono text-3xl font-bold text-forest-950 dark:text-cream-50">
              {totalItemsCount}
            </span>
            <span className="text-[11px] text-charcoal-500 block mt-1">
              {totalReusableCount} lifetime reusables in circulation
            </span>
          </div>

          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 block mb-1">
              Plastic-Free Orders
            </span>
            <span className="font-mono text-3xl font-bold text-forest-950 dark:text-cream-50">
              {orders.length}
            </span>
            <span className="text-[11px] text-charcoal-500 block mt-1">
              100% compostable shipment packaging
            </span>
          </div>
        </div>

        <p className="text-[11px] text-charcoal-500 italic">
          *Impact values are estimates for comparison and are not scientific certifications.
        </p>
      </section>

      {/* 3. WEEKLY ECO CHALLENGES */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-accent">
            Earn Points & Build Habits
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50 mt-1">
            Weekly Eco Challenges
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Simple tangible actions to slash single-use consumption in your daily routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => {
            const completed = isChallengeCompleted(c._id);

            return (
              <div
                key={c._id}
                className={`p-6 rounded-3xl border transition-all ${
                  completed
                    ? 'bg-forest-50/60 dark:bg-forest-950/20 border-forest-300 dark:border-forest-900'
                    : 'bg-white dark:bg-charcoal-900 border-sage-200 dark:border-charcoal-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sage-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300">
                      {c.category} • {c.difficulty}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50 mt-1.5">
                      {c.title}
                    </h4>
                  </div>
                  <span className="font-mono font-bold text-xs bg-amber-100 dark:bg-amber-950 text-amber-accent px-2 py-1 rounded-lg flex-shrink-0">
                    +{c.points} pts
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed mb-4">
                  {c.description}
                </p>

                {c.tip && (
                  <div className="p-3 rounded-xl bg-sage-50/80 dark:bg-charcoal-800/80 text-[11px] text-charcoal-600 dark:text-charcoal-400 mb-4 border border-sage-100 dark:border-charcoal-700">
                    💡 <span className="font-semibold">Tip:</span> {c.tip}
                  </div>
                )}

                <div className="pt-3 border-t border-sage-100 dark:border-charcoal-800 flex items-center justify-between">
                  {completed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-sage-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed (+{c.points} EcoPoints added)
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={completingId === c._id}
                      onClick={() => handleCompleteChallenge(c._id, c.points)}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Impact;
