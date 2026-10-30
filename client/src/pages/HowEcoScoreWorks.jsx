import React, { useState } from 'react';
import { ShieldCheck, Info, Sparkles, Scale, Check, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

const factors = [
  {
    title: 'Material Integrity (0–25 points)',
    points: 25,
    description:
      'Evaluates whether the base material is certified organic (GOTS), post-consumer recycled (RPET, reclaimed ocean plastics), salvaged heritage timber, or agricultural byproduct (wheat straw, bamboo). Virgin petrochemical plastics score 0.',
    criteria: [
      'GOTS organic, French flax linen, FSC timber: 23–25 pts',
      'Post-consumer recycled metals / glass / RPET: 20–22 pts',
      'Agricultural biopolymer residue: 18–20 pts',
      'Virgin mixed synthetic fibers: 0–5 pts',
    ],
  },
  {
    title: 'Daily Reusability (0–25 points)',
    points: 25,
    description:
      'Quantifies how effectively the item replaces recurring single-use trash. A reusable flask replacing 167 plastic bottles per year scores highest.',
    criteria: [
      'Replaces daily single-use items (>150 uses/year): 23–25 pts',
      'Replaces weekly disposable containers: 18–22 pts',
      'Semi-reusable / durable multi-month consumable: 14–17 pts',
      'Single-use or un-washable items: 0–5 pts',
    ],
  },
  {
    title: 'Packaging Circularity (0–20 points)',
    points: 20,
    description:
      'Evaluates shipping and secondary container materials. We enforce 100% plastic-free packaging: unbleached corrugated kraft, water-activated paper tape, and soy-based printing inks.',
    criteria: [
      'Self-fabric or zero packaging: 20 pts',
      '100% FSC-certified unbleached compostable kraft paper: 19–20 pts',
      'Recycled metal tins / glass apothecary jars: 17–19 pts',
      'Non-recyclable polybags or bubble wrap: 0 pts',
    ],
  },
  {
    title: 'Durability & Lifetime (0–15 points)',
    points: 15,
    description:
      'Assesses mechanical durability, drop resistance, tear strength, and modular repairability (e.g. replaceable silicone gaskets or Swedish safety razor blades).',
    criteria: [
      'Lifetime warranty / solid brass / 304 steel: 14–15 pts',
      'Heavyweight 14oz canvas / borosilicate glass: 12–13 pts',
      'Standard high-density household goods: 10–11 pts',
      'Fragile planned-obsolescence items: 0–4 pts',
    ],
  },
  {
    title: 'Recyclability & End-of-Life (0–15 points)',
    points: 15,
    description:
      'What happens when the product finally reaches its end of life? Mono-material items score highest because they easily re-enter standard recycling loops or safely backyard compost without microplastics.',
    criteria: [
      '100% home compostable (raw bamboo, sisal, loofah): 15 pts',
      'Infinitely recyclable mono-metal (brass, stainless steel): 14–15 pts',
      'Industrial compostable biopolymer (PBAT/wheat): 12–13 pts',
      'Multi-layer composite plastics: 0 pts',
    ],
  },
];

const HowEcoScoreWorks = () => {
  // Interactive Score Simulator
  const [mat, setMat] = useState(24);
  const [reu, setReu] = useState(23);
  const [pack, setPack] = useState(19);
  const [dur, setDur] = useState(14);
  const [rec, setRec] = useState(14);

  const simulatedTotal = mat + reu + pack + dur + rec;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4 text-forest-700" />
          Transparent Lifecycle Methodology
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 dark:text-cream-50 leading-tight">
          How the EcoScore Algorithm Works
        </h1>
        <p className="text-base text-charcoal-600 dark:text-charcoal-300 mt-2 max-w-2xl leading-relaxed">
          We believe true sustainability requires transparent math, not vague buzzwords. EcoScore evaluates products on an objective 0–100 circular scale.
        </p>
      </div>

      {/* Mandatory Honesty Alert Banner */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-accent flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-charcoal-800 dark:text-cream-100">
          <p className="font-bold text-sm text-charcoal-900 dark:text-cream-50">
            Important Disclosure & Honesty Commitment
          </p>
          <p className="leading-relaxed">
            *EcoScore is an internal comparative framework designed to help shoppers compare the circularity of different products in our store. It is{' '}
            <strong>NOT an official third-party scientific certification</strong>, government standard, or ISO lifecycle audit. All estimates for plastic avoided and carbon saved are approximations based on typical consumption baselines.
          </p>
        </div>
      </div>

      {/* 5-Factor Detail Cards */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-cream-50">
          The Five Lifecycle Factors
        </h2>

        <div className="space-y-4">
          {factors.map((factor, idx) => (
            <div
              key={factor.title}
              className="bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50">
                  {factor.title}
                </h3>
                <span className="font-mono font-bold text-xs bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-sage-300 px-2.5 py-1 rounded-lg">
                  Max {factor.points} pts
                </span>
              </div>

              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {factor.description}
              </p>

              <div className="pt-2 border-t border-sage-100 dark:border-charcoal-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {factor.criteria.map((crit, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-charcoal-700 dark:text-charcoal-200">
                    <Check className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive EcoScore Simulator */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-cream-50 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-accent">
              Interactive Tool
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1">
              Simulate an EcoScore
            </h3>
            <p className="text-xs text-sage-200 mt-0.5">
              Adjust the sliders below to see how product design decisions affect the overall score.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-sage-300 block">Computed EcoScore</span>
            <span className="font-mono font-bold text-4xl text-amber-accent">
              {simulatedTotal}/100
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Material Integrity: {mat}/25</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={mat}
              onChange={(e) => setMat(Number(e.target.value))}
              className="w-full accent-amber-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Reusability & Single-Use Elimination: {reu}/25</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={reu}
              onChange={(e) => setReu(Number(e.target.value))}
              className="w-full accent-amber-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Packaging Circularity: {pack}/20</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={pack}
              onChange={(e) => setPack(Number(e.target.value))}
              className="w-full accent-amber-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Durability & Repairability: {dur}/15</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={dur}
              onChange={(e) => setDur(Number(e.target.value))}
              className="w-full accent-amber-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Recyclability & End-of-Life: {rec}/15</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={rec}
              onChange={(e) => setRec(Number(e.target.value))}
              className="w-full accent-amber-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowEcoScoreWorks;
