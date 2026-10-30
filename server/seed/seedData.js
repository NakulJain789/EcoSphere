const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Challenge = require('../models/Challenge');

const productsData = [
  // 1. Reusable Essentials
  {
    name: 'Insulated Pure Copper & Steel Flask (750ml)',
    description: 'Triple-wall insulated flask handcrafted from 90% recycled food-grade stainless steel with a copper lining. Keeps beverages ice cold for 24 hours or piping hot for 12 hours without any synthetic coatings or BPA.',
    shortDescription: 'Triple-wall 90% recycled stainless steel flask, zero-plastic seal.',
    price: 1299,
    originalPrice: 1599,
    stock: 45,
    category: 'Reusable Essentials',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 25, packaging: 20, durability: 15, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 4200,
      carbonSavedKg: 18.5,
      materials: ['90% Recycled 304 Stainless Steel', 'Natural Food-grade Silicone Seal', 'Laser-etched Bamboo Cap'],
      packagingType: 'FSC-certified unbleached kraft box printed with soy ink',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use PET plastic beverage bottles',
      annualWasteAvoided: 'Approx. 167 single-use plastic bottles avoided per year*',
      comparisonNote: 'Replaces an estimated 167 single-use 500ml water bottles annually for an average daily commuter.*',
    },
    averageRating: 4.9,
    numReviews: 28,
    tags: ['drinkware', 'zero-waste', 'plastic-free', 'commute', 'bestseller'],
    featured: true,
  },
  {
    name: 'Organic Fair-Trade Canvas Everyday Tote',
    description: 'Reinforced 14oz heavy-duty organic cotton canvas tote dyed using plant-based pigments. Features double-stitched boxed corners, internal key leash, and deep dual bottle pockets for reliable market runs.',
    shortDescription: 'Heavy-duty 14oz GOTS certified organic cotton market tote.',
    price: 649,
    originalPrice: 799,
    stock: 80,
    category: 'Reusable Essentials',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 23, reusability: 24, packaging: 20, durability: 14, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 3100,
      carbonSavedKg: 9.2,
      materials: ['100% GOTS Organic Cotton', 'Natural Plant Dyes', 'Recycled Cotton Thread'],
      packagingType: 'Recycled paper sleeve, zero polybags',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use plastic grocery bags',
      annualWasteAvoided: 'Approx. 350 thin-film plastic carry bags per year*',
      comparisonNote: 'Eliminates hundreds of single-use thin poly bags that clog municipal storm drains and marine habitats.*',
    },
    averageRating: 4.8,
    numReviews: 34,
    tags: ['bags', 'organic', 'plastic-free', 'bestseller'],
    featured: true,
  },
  {
    name: 'Borosilicate Glass Meal Prep Containers (Set of 3)',
    description: 'Thermal shock resistant borosilicate glass food containers topped with naturally antimicrobial sustainably harvested bamboo lids and food-grade silicone airtight seals. Oven, freezer, and dishwasher safe.',
    shortDescription: 'Airtight glass prep bowls with engraved natural bamboo lids.',
    price: 1499,
    originalPrice: 1899,
    stock: 35,
    category: 'Reusable Essentials',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 23, reusability: 25, packaging: 19, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 2800,
      carbonSavedKg: 12.1,
      materials: ['High-Borosilicate Glass', 'Sustainably Harvested Moso Bamboo', 'Food-grade Silicone'],
      packagingType: '100% molded pulp cushion box, fully compostable',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use plastic wrap & cling film',
      annualWasteAvoided: 'Approx. 12 rolls of PVC cling film per year*',
      comparisonNote: 'Stops microplastic leaching into warm food and prevents non-recyclable cling wrap from reaching landfills.*',
    },
    averageRating: 4.9,
    numReviews: 19,
    tags: ['kitchen', 'food-prep', 'glass', 'plastic-free'],
    featured: false,
  },
  {
    name: 'Barista Reusable Ceramic Travel Cup (350ml)',
    description: 'Double-walled artisan stoneware travel cup with a leak-resistant silicone splash lid. Glazed with non-toxic lead-free minerals. Keeps your flat white warm while protecting hands from heat.',
    shortDescription: 'Double-walled ceramic coffee tumbler with splash lid.',
    price: 899,
    originalPrice: 1199,
    stock: 50,
    category: 'Reusable Essentials',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 22, reusability: 24, packaging: 19, durability: 13, recyclability: 12 },
    ecoImpact: {
      plasticAvoidedGrams: 1900,
      carbonSavedKg: 7.8,
      materials: ['Natural High-fired Stoneware', 'Food-grade Silicone Lid', 'Mineral Glaze'],
      packagingType: 'Recycled corrugated cardboard cushion',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Polyethylene-lined disposable paper coffee cups',
      annualWasteAvoided: 'Approx. 240 takeaway coffee cups & plastic lids*',
      comparisonNote: 'Most paper cups are lined with plastic film, making them non-recyclable in standard municipal recycling.*',
    },
    averageRating: 4.7,
    numReviews: 22,
    tags: ['coffee', 'ceramic', 'commute', 'morning'],
    featured: false,
  },

  // 2. Sustainable Home
  {
    name: 'French Flax Linen Bed Sheet & Pillowcase Set',
    description: 'Woven from 100% certified French linen flax requiring 80% less water than conventional cotton during cultivation. Naturally hypoallergenic, thermoregulating, and softens beautifully with every wash.',
    shortDescription: '100% stonewashed organic French flax linen bedding set.',
    price: 3499,
    originalPrice: 4299,
    stock: 20,
    category: 'Sustainable Home',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 22, packaging: 19, durability: 15, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 850,
      carbonSavedKg: 24.0,
      materials: ['100% Certified French Flax Linen', 'Coconut Shell Buttons', 'Organic Thread'],
      packagingType: 'Self-fabric linen drawstring pouch (zero plastic packaging)',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Synthetic polyester microfiber bedding',
      annualWasteAvoided: 'Sheds zero synthetic plastic microfibers during laundering*',
      comparisonNote: 'Synthetic polyester bedsheets release hundreds of thousands of microfibers each wash that pollute waterways.*',
    },
    averageRating: 4.9,
    numReviews: 16,
    tags: ['home', 'bedroom', 'linen', 'luxury', 'bestseller'],
    featured: true,
  },
  {
    name: 'Handwoven Natural Jute & Recycled Cotton Rug',
    description: 'Braided by skilled artisan cooperatives using unbleached raw golden jute and upcycled garment factory cotton offcuts. Sturdy, naturally stain-resistant, and entirely biodegradable at the end of life.',
    shortDescription: 'Artisan braided natural jute and upcycled cotton floor rug.',
    price: 2199,
    originalPrice: 2799,
    stock: 25,
    category: 'Sustainable Home',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 22, packaging: 19, durability: 14, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 1600,
      carbonSavedKg: 14.3,
      materials: ['Golden Raw Jute', 'Pre-consumer Recycled Cotton Warp'],
      packagingType: 'Recycled kraft paper roll with jute string binding',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Polypropylene plastic synthetic rug',
      annualWasteAvoided: 'Diverts 1.8 kg of textile cuttings from landfills*',
      comparisonNote: 'Standard machine rugs use petroleum-based polypropylene that never biodegrades in landfills.*',
    },
    averageRating: 4.6,
    numReviews: 12,
    tags: ['home', 'decor', 'handcrafted', 'jute'],
    featured: false,
  },
  {
    name: 'Hand-Poured Soy Wax & Cedarwood Candle',
    description: 'Small-batch clean burning candle poured with 100% Midwest non-GMO soy wax, crackling FSC wooden wick, and pure therapeutic-grade cedarwood & sage essential oils in a reusable amber glass jar.',
    shortDescription: 'Clean-burning soy wax candle with cedarwood & sage essential oils.',
    price: 799,
    originalPrice: 999,
    stock: 60,
    category: 'Sustainable Home',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 22, reusability: 23, packaging: 18, durability: 12, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 350,
      carbonSavedKg: 3.8,
      materials: ['Non-GMO Pure Soy Wax', 'FSC-Certified Wood Wick', 'Amber Apothecary Glass'],
      packagingType: 'Recycled cardboard cylinder box',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Petroleum paraffin wax candles with synthetic fragrance',
      annualWasteAvoided: 'Zero petroleum soot or benzene emissions*',
      comparisonNote: 'Paraffin candles release toxic toluene and benzene vapors; soy wax burns cleanly with zero soot.*',
    },
    averageRating: 4.8,
    numReviews: 24,
    tags: ['home', 'aromatherapy', 'candle', 'clean-air'],
    featured: false,
  },
  {
    name: 'Upcycled Teak Wood Serving Board',
    description: 'Carved by master woodworkers from reclaimed teak beams rescued from dismantled old heritage homes. Conditioned with organic cold-pressed walnut oil. Each piece bears unique grain character.',
    shortDescription: 'Reclaimed heritage teak wood cheese and cutting board.',
    price: 1399,
    originalPrice: 1799,
    stock: 30,
    category: 'Sustainable Home',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 24, packaging: 18, durability: 15, recyclability: 13 },
    ecoImpact: {
      plasticAvoidedGrams: 850,
      carbonSavedKg: 11.2,
      materials: ['100% Salvaged Reclaimed Teak Wood', 'Organic Walnut Oil Finish'],
      packagingType: 'Recycled corrugated cardboard with unbleached twine',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Plastic polyethylene cutting boards',
      annualWasteAvoided: 'Zero plastic shavings ingested or discarded*',
      comparisonNote: 'Plastic cutting boards shed microplastics directly into your food with every knife strike.*',
    },
    averageRating: 4.9,
    numReviews: 15,
    tags: ['kitchen', 'woodwork', 'reclaimed', 'upcycled'],
    featured: false,
  },

  // 3. Sustainable Fashion
  {
    name: 'Organic Hemp & Bamboo Minimalist Overshirt',
    description: 'A breathable, durable overshirt constructed from a custom 55% true industrial hemp and 45% organic bamboo viscose blend. Uses unpolished corozo nut buttons. Hemp requires no pesticides or synthetic fertilizers.',
    shortDescription: '55% industrial hemp and organic bamboo buttoned utility shirt.',
    price: 2499,
    originalPrice: 2999,
    stock: 30,
    category: 'Sustainable Fashion',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 23, packaging: 19, durability: 15, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 900,
      carbonSavedKg: 16.5,
      materials: ['55% True Hemp', '45% Organic Bamboo', 'Natural Corozo Nut Buttons'],
      packagingType: 'Glassine compostable paper wrap, zero plastics',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Fast-fashion polyester synthetic jacket',
      annualWasteAvoided: 'Eliminates 3.5 kg CO2e in fast-fashion manufacturing emissions*',
      comparisonNote: 'Fast-fashion garments are worn an average of 7 times before landfill disposal; hemp lasts for decades.*',
    },
    averageRating: 4.7,
    numReviews: 18,
    tags: ['apparel', 'hemp', 'slow-fashion', 'organic'],
    featured: true,
  },
  {
    name: 'Recycled Ocean Plastic Waterproof Windbreaker',
    description: 'High-performance featherweight windbreaker shell woven entirely from certified post-consumer ocean-bound plastic bottles (RPET). Coated with non-toxic fluorine-free DWR water repellent.',
    shortDescription: 'Ultralight waterproof jacket made from 28 recycled ocean bottles.',
    price: 2899,
    originalPrice: 3499,
    stock: 25,
    category: 'Sustainable Fashion',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 22, reusability: 23, packaging: 19, durability: 14, recyclability: 13 },
    ecoImpact: {
      plasticAvoidedGrams: 1400,
      carbonSavedKg: 13.8,
      materials: ['100% Certified Recycled Ocean PET', 'PFC-free DWR Finish', 'Recycled YKK Zippers'],
      packagingType: 'Cassava starch compostable polybag',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Virgin petroleum nylon rain gear',
      annualWasteAvoided: 'Recovers 28 plastic bottles directly from coastal waterways*',
      comparisonNote: 'Transforms discard plastic into a durable 5-year technical jacket instead of ocean debris.*',
    },
    averageRating: 4.8,
    numReviews: 21,
    tags: ['outerwear', 'recycled-plastic', 'waterproof', 'active'],
    featured: false,
  },
  {
    name: 'Zero-Waste Organic Cotton Socks (Pack of 3)',
    description: 'Cushioned crew socks knitted with 92% regenerative organic cotton and 8% natural rubber elastics. Knitted on seamless circular machines to generate zero fabric cutting waste.',
    shortDescription: 'Seamless regenerative organic cotton cushioned socks.',
    price: 549,
    originalPrice: 699,
    stock: 90,
    category: 'Sustainable Fashion',
    images: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 23, reusability: 22, packaging: 20, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 450,
      carbonSavedKg: 4.5,
      materials: ['92% Regenerative Organic Cotton', '8% Natural Tree Rubber'],
      packagingType: 'Recycled paper belly band with seed paper tag',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Petroleum-based acrylic socks',
      annualWasteAvoided: 'Saves 1,200 liters of freshwater agricultural irrigation*',
      comparisonNote: 'Regenerative organic farming replenishes soil organic carbon and utilizes natural rainfall.*',
    },
    averageRating: 4.7,
    numReviews: 26,
    tags: ['basics', 'organic-cotton', 'comfortable', 'zero-waste'],
    featured: false,
  },

  // 4. Personal Care
  {
    name: 'Solid Cold-Pressed Botanical Shampoo Bar (Argan & Rosemary)',
    description: 'Concentrated waterless shampoo bar formulated with organic argan oil, French green clay, and rosemary extract. Equivalent to 3 conventional 250ml plastic shampoo bottles without sodium lauryl sulfate.',
    shortDescription: 'Zero-waste concentrated solid shampoo bar equal to 3 bottles.',
    price: 399,
    originalPrice: 499,
    stock: 120,
    category: 'Personal Care',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 21, packaging: 20, durability: 15, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 240,
      carbonSavedKg: 5.6,
      materials: ['Organic Moroccan Argan Oil', 'Rosemary Hydrosol', 'Montmorillonite Green Clay'],
      packagingType: '100% post-consumer recycled paper box with soy vegetable inks',
      isReusable: false,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use plastic shampoo & conditioner bottles',
      annualWasteAvoided: 'Approx. 8 plastic shampoo bottles per household/yr*',
      comparisonNote: 'Liquid shampoos are 80% water shipped in thick single-use high-density polyethylene plastic.*',
    },
    averageRating: 4.9,
    numReviews: 42,
    tags: ['haircare', 'solid-bar', 'zero-plastic', 'bestseller'],
    featured: true,
  },
  {
    name: 'Precision Double-Edge Brass Safety Razor',
    description: 'Engineered from 100% solid knurled marine-grade brass with a matte gunmetal finish. Designed to last a lifetime, replacing disposable cartridge razors with standard recyclable stainless steel blades.',
    shortDescription: 'All-metal lifetime brass safety razor with 10 Swedish blades.',
    price: 1199,
    originalPrice: 1499,
    stock: 65,
    category: 'Personal Care',
    images: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 25, packaging: 20, durability: 15, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 1800,
      carbonSavedKg: 8.9,
      materials: ['100% Marine Grade Knurled Brass', 'Swedish Stainless Steel Blades'],
      packagingType: 'Biodegradable kraft gift box with recyclable metal tin for used blades',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Disposable plastic razors and cartridges',
      annualWasteAvoided: 'Approx. 52 plastic razors or composite heads per year*',
      comparisonNote: 'Over 2 billion disposable plastic razors and composite cartridges are buried in landfills every year.*',
    },
    averageRating: 4.9,
    numReviews: 31,
    tags: ['grooming', 'shaving', 'zero-waste', 'plastic-free', 'bestseller'],
    featured: true,
  },
  {
    name: 'Natural Bamboo Charcoal Toothbrush (Set of 4)',
    description: 'Sustainably wild-harvested Moso bamboo handles carved with ergonomic contours, fitted with castor bean oil-infused soft bristles. 100% compostable handle that breaks down in garden soil within 6 months.',
    shortDescription: '100% biodegradable Moso bamboo toothbrushes with plant bristles.',
    price: 349,
    originalPrice: 449,
    stock: 140,
    category: 'Personal Care',
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 20, packaging: 20, durability: 13, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 160,
      carbonSavedKg: 2.2,
      materials: ['Organic Moso Bamboo', 'Castor Bean Oil Infused Bristles', 'Activated Bamboo Charcoal'],
      packagingType: 'Zero-plastic unbleached kraft paper packaging',
      isReusable: false,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Petrochemical plastic toothbrushes',
      annualWasteAvoided: 'Replaces 4 non-recyclable multi-material plastic brushes*',
      comparisonNote: 'Every plastic toothbrush ever made still exists today because composite plastics cannot be recycled.*',
    },
    averageRating: 4.8,
    numReviews: 38,
    tags: ['oralcare', 'bamboo', 'biodegradable', 'daily'],
    featured: false,
  },
  {
    name: 'All-Natural Mineral Sunscreen SPF 40 (Reef Safe)',
    description: 'Non-nano zinc oxide sunscreen formulated with organic shea butter, jojoba, and aloe vera. Completely free from oxybenzone, octinoxate, microplastics, and synthetic fragrances that bleach coral reefs.',
    shortDescription: 'Non-nano zinc oxide reef-safe mineral sunscreen in metal tin.',
    price: 749,
    originalPrice: 899,
    stock: 55,
    category: 'Personal Care',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 21, packaging: 19, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 120,
      carbonSavedKg: 2.9,
      materials: ['Non-Nano Zinc Oxide', 'Fair-Trade Organic Shea Butter', 'Pure Jojoba Seed Oil'],
      packagingType: 'Infinitely recyclable aluminum tin, zero plastic caps',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Chemical sunscreen in squeezy plastic tubes',
      annualWasteAvoided: 'Zero harmful chemical runoff bleaching coral reefs*',
      comparisonNote: 'An estimated 14,000 tons of chemical sunscreen wash into coral reefs every year.*',
    },
    averageRating: 4.7,
    numReviews: 17,
    tags: ['skincare', 'sunscreen', 'reef-safe', 'plastic-free'],
    featured: false,
  },

  // 5. Zero Waste
  {
    name: 'Organic Beeswax Food Wrap Assorted Pack (4 Sizes)',
    description: 'Handmade using certified GOTS organic cotton infused with pure sustainably sourced beeswax, jojoba oil, and natural tree damar resin. Molds with the warmth of your hands to seal bowls, cheese, vegetables, and bread.',
    shortDescription: 'Reusable food wraps made from organic cotton & natural beeswax.',
    price: 699,
    originalPrice: 899,
    stock: 75,
    category: 'Zero Waste',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 25, packaging: 20, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 2100,
      carbonSavedKg: 7.2,
      materials: ['GOTS Certified Organic Cotton', 'Local Unfiltered Beeswax', 'Cold-Pressed Jojoba Oil'],
      packagingType: '100% recycled paper envelope with soy ink',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use plastic cling wrap and aluminum foil',
      annualWasteAvoided: 'Approx. 8 rolls of plastic cling film avoided per year*',
      comparisonNote: 'Replaces disposable PVC films with a breathable, antibacterial food cover washable with cold water.*',
    },
    averageRating: 4.9,
    numReviews: 39,
    tags: ['kitchen', 'food-storage', 'beeswax', 'zero-waste', 'bestseller'],
    featured: true,
  },
  {
    name: 'Solid Brass Travel Cutlery Set with Linen Roll',
    description: 'Compact hand-polished solid brass spoon, fork, knife, and angled metal straw with coconut fiber cleaning brush. Housed in a washable organic linen travel pouch that fits neatly into your daypack.',
    shortDescription: 'Hand-polished brass dining cutlery with organic linen wrap.',
    price: 949,
    originalPrice: 1199,
    stock: 50,
    category: 'Zero Waste',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 23, reusability: 25, packaging: 19, durability: 15, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 3400,
      carbonSavedKg: 8.4,
      materials: ['Solid Forged Brass', 'Organic French Linen Wrap', 'Coconut Husk Fiber Brush'],
      packagingType: 'Kraft envelope, zero bubble wrap',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Single-use takeaway plastic forks, knives, and straws',
      annualWasteAvoided: 'Approx. 400 single-use plastic utensils per year*',
      comparisonNote: 'Takeaway plastic cutlery is rarely recycled due to food residue and lightweight polystyrene makeup.*',
    },
    averageRating: 4.8,
    numReviews: 23,
    tags: ['travel', 'cutlery', 'on-the-go', 'zero-waste'],
    featured: false,
  },
  {
    name: 'Natural Loofah & Sisal Kitchen Cleaning Sponges (Set of 5)',
    description: '100% plant-based scrubbing pads made from sun-dried loofah gourd and sisal agave cactus fibers. Stitched with cotton thread. Expands in water to scrub baked pots effortlessly without scratching.',
    shortDescription: '100% plant-fiber kitchen scrub sponges, 100% compostable.',
    price: 399,
    originalPrice: 499,
    stock: 110,
    category: 'Zero Waste',
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 21, packaging: 20, durability: 14, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 750,
      carbonSavedKg: 3.1,
      materials: ['Natural Loofah Gourd', 'Agave Sisal Fiber', 'Organic Cotton Thread'],
      packagingType: 'Recycled paper sleeve',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Synthetic polyurethane yellow & green foam sponges',
      annualWasteAvoided: 'Approx. 18 synthetic plastic sponges per year*',
      comparisonNote: 'Plastic yellow sponges shed microplastic particles straight down kitchen sinks into the ocean.*',
    },
    averageRating: 4.7,
    numReviews: 29,
    tags: ['kitchen', 'cleaning', 'compostable', 'plant-based'],
    featured: false,
  },

  // 6. Upcycled
  {
    name: 'Upcycled Sailcloth Weekender Duffel Bag (38L)',
    description: 'Rugged water-resistant duffel handcrafted from decommissioned racing sailboat spinnakers and discarded automotive seatbelts. Each one-of-a-kind bag prevents durable Dacron sails from being incinerated.',
    shortDescription: 'Water-resistant travel duffel made from reclaimed racing yacht sails.',
    price: 3299,
    originalPrice: 3999,
    stock: 18,
    category: 'Upcycled',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 24, packaging: 19, durability: 15, recyclability: 13 },
    ecoImpact: {
      plasticAvoidedGrams: 2800,
      carbonSavedKg: 21.0,
      materials: ['Decommissioned Marine Sailcloth', 'Reclaimed Automotive Seatbelts', 'Recycled YKK Zippers'],
      packagingType: 'Minimalist recycled paper wrapping with sailcloth scrap tag',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Virgin synthetic luggage bags',
      annualWasteAvoided: 'Rescues 3.2 sq meters of non-biodegradable sailcloth*',
      comparisonNote: 'Upcycling existing technical textiles skips the immense petrochemical extraction needed for virgin fabrics.*',
    },
    averageRating: 4.9,
    numReviews: 14,
    tags: ['luggage', 'upcycled', 'adventure', 'unique', 'bestseller'],
    featured: true,
  },
  {
    name: 'Upcycled Wine Bottle Drinking Glasses (Set of 4)',
    description: 'Rescued empty wine bottles collected from local restaurants, score-cut, hand-beveled, and flame-polished by glass artisans. Dishwasher safe, heavyweight, and beautifully tinted in olive green.',
    shortDescription: 'Hand-cut & polished tumblers made from rescued wine bottles.',
    price: 899,
    originalPrice: 1199,
    stock: 40,
    category: 'Upcycled',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 24, packaging: 19, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 1200,
      carbonSavedKg: 9.8,
      materials: ['100% Upcycled Glass Wine Bottles'],
      packagingType: 'Recycled paper egg-carton style divider box',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Disposable plastic party cups',
      annualWasteAvoided: 'Rescues 4 glass bottles from energy-intensive remelting*',
      comparisonNote: 'Upcycling uses 85% less energy than melting down cullet glass in conventional glass foundries.*',
    },
    averageRating: 4.8,
    numReviews: 20,
    tags: ['glassware', 'upcycled', 'dining', 'kitchen'],
    featured: false,
  },
  {
    name: 'Reclaimed Bicycle Inner Tube Card Wallet',
    description: 'Slim minimalist front-pocket wallet hand-stitched from punctured bicycle inner tubes diverted from bike repair shops. Naturally water-resistant, ultra-flexible, and holds 8 cards plus folded currency.',
    shortDescription: 'Ultra-slim water-resistant cardholder from punctured bike tubes.',
    price: 599,
    originalPrice: 799,
    stock: 55,
    category: 'Upcycled',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 24, packaging: 20, durability: 15, recyclability: 12 },
    ecoImpact: {
      plasticAvoidedGrams: 600,
      carbonSavedKg: 6.4,
      materials: ['Reclaimed Butyl Rubber Inner Tubes', 'Waxed Organic Cotton Thread'],
      packagingType: 'Seed paper envelope that sprouts wildflowers when planted',
      isReusable: true,
      isRecyclable: false,
    },
    disposableAlternative: {
      name: 'PVC plastic faux leather wallets',
      annualWasteAvoided: 'Keeps non-biodegradable vulcanized rubber out of incinerators*',
      comparisonNote: 'Butyl inner tubes take over 500 years to decompose in landfills; this wallet gives them decades of utility.*',
    },
    averageRating: 4.7,
    numReviews: 19,
    tags: ['accessories', 'wallet', 'upcycled', 'everyday-carry'],
    featured: false,
  },

  // 7. Travel
  {
    name: 'Ultralight Foldable Solar Charger (21W)',
    description: 'High-efficiency SunPower monocrystalline solar panels encased in weather-resistant recycled PET fabric with dual smart USB ports. Folds down to the size of a paperback notebook for off-grid hiking and travel.',
    shortDescription: 'Water-resistant folding 21W solar charging panel with dual USB.',
    price: 2799,
    originalPrice: 3499,
    stock: 22,
    category: 'Travel',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 21, reusability: 25, packaging: 18, durability: 14, recyclability: 12 },
    ecoImpact: {
      plasticAvoidedGrams: 1100,
      carbonSavedKg: 35.0,
      materials: ['Monocrystalline Silicon Cells', 'Recycled PET Ballistic Fabric', 'Brass Grommets'],
      packagingType: 'FSC certified corrugated paperboard',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Disposable alkaline AA batteries',
      annualWasteAvoided: 'Generates clean off-grid electricity for 5+ years*',
      comparisonNote: 'Eliminates dozens of single-use toxic alkaline batteries used in camping lanterns and power packs.*',
    },
    averageRating: 4.8,
    numReviews: 15,
    tags: ['solar', 'energy', 'travel', 'outdoor'],
    featured: true,
  },
  {
    name: 'Zero-Waste Solid Toiletries Travel Kit',
    description: 'TSA-friendly aluminum travel tin featuring miniature solid shampoo, botanical body wash bar, natural toothpaste bites in a glass vial, and an organic bamboo comb. No liquids to leak in your luggage.',
    shortDescription: 'Plastic-free solid travel toiletries with leakproof metal tin.',
    price: 849,
    originalPrice: 1099,
    stock: 45,
    category: 'Travel',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 24, reusability: 23, packaging: 20, durability: 14, recyclability: 15 },
    ecoImpact: {
      plasticAvoidedGrams: 850,
      carbonSavedKg: 6.8,
      materials: ['Botanical Plant Oils', 'Recyclable Aluminum Tin', 'Castor Bean Bristles'],
      packagingType: '100% recycled paper sleeve',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Mini hotel travel plastic shampoo bottles',
      annualWasteAvoided: 'Approx. 24 miniature hotel plastic bottles per frequent traveler*',
      comparisonNote: 'Hotel travel toiletries create massive amounts of plastic that are discarded after 1 or 2 uses.*',
    },
    averageRating: 4.9,
    numReviews: 27,
    tags: ['travel', 'toiletries', 'zero-waste', 'tsa-approved'],
    featured: false,
  },
  {
    name: 'Organic Cotton Hammock with Tree-Friendly Straps',
    description: 'Woven with unbleached heavy organic cotton rope, capable of supporting up to 200kg. Includes wide polyester webbing tree-saver straps that disperse weight without scoring or harming tree bark.',
    shortDescription: 'Heavy-duty organic cotton travel hammock with tree-saver straps.',
    price: 1699,
    originalPrice: 2199,
    stock: 30,
    category: 'Travel',
    images: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 23, reusability: 24, packaging: 19, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 900,
      carbonSavedKg: 10.2,
      materials: ['100% Raw Organic Cotton', 'High-tensile Tree-friendly Webbing', 'Steel Carabiners'],
      packagingType: 'Cotton stuff sack with recycled paper hangtag',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Disposable outdoor gear',
      annualWasteAvoided: 'Protects tree bark integrity and leaves zero trace*',
      comparisonNote: 'Tree-friendly straps protect delicate sapwood from damage that narrow ropes cause to forest trees.*',
    },
    averageRating: 4.8,
    numReviews: 16,
    tags: ['outdoor', 'camping', 'hammock', 'leave-no-trace'],
    featured: false,
  },

  // 8. Eco Tech Accessories
  {
    name: 'Wheat Straw & Plant Bioplastic Phone Case',
    description: 'Shock-absorbing protective mobile case created from natural wheat straw agricultural residue and biodegradable biopolymers. Military-drop tested up to 2 meters. Breaks down in industrial compost in 180 days.',
    shortDescription: '100% compostable shockproof case made from leftover wheat straw.',
    price: 699,
    originalPrice: 899,
    stock: 85,
    category: 'Eco Tech Accessories',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 22, packaging: 20, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 180,
      carbonSavedKg: 3.4,
      materials: ['Agricultural Wheat Straw Waste', 'Plant-based PBAT Biopolymer'],
      packagingType: 'Plantable seed paper box with zero plastic windows',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Polycarbonate and silicone plastic phone cases',
      annualWasteAvoided: 'Over 1 billion plastic phone cases are trashed globally each year*',
      comparisonNote: 'Synthetic plastic phone cases survive for centuries; wheat bioplastic safely composts into rich soil.*',
    },
    averageRating: 4.7,
    numReviews: 35,
    tags: ['tech', 'phone-case', 'compostable', 'bestseller'],
    featured: true,
  },
  {
    name: 'Braided Recycled Ocean Ocean-Tether Charging Cable (2M)',
    description: 'Fast-charging 60W USB-C cable braided with 100% post-consumer ocean-bound plastic yarn. Reinforced with aramid fiber core and laser-welded aluminum alloy connector housings rated for 25,000+ bends.',
    shortDescription: 'Braided 60W USB-C cable made from recycled marine plastic.',
    price: 799,
    originalPrice: 999,
    stock: 70,
    category: 'Eco Tech Accessories',
    images: [
      'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 22, reusability: 24, packaging: 19, durability: 15, recyclability: 13 },
    ecoImpact: {
      plasticAvoidedGrams: 320,
      carbonSavedKg: 4.8,
      materials: ['Recycled Ocean Plastic Yarn', 'Recyclable Aluminum Connectors', 'Oxygen-free Copper'],
      packagingType: 'Molded pulp tray with recycled cardboard exterior',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Fragile PVC disposable charging cables',
      annualWasteAvoided: 'Outlasts 4 standard rubber cables that fray and tear*',
      comparisonNote: 'Standard PVC cables crack within months; reinforced recycled ocean plastic sheath withstands heavy use.*',
    },
    averageRating: 4.9,
    numReviews: 29,
    tags: ['tech', 'cable', 'durable', 'fast-charge'],
    featured: false,
  },
  {
    name: 'Natural Cork & Recycled Rubber Desk Mat (90x40cm)',
    description: 'Reversible dual-sided workspace desk pad crafted from organic harvested Mediterranean oak cork and natural recycled tire rubber. Water-resistant, naturally warm to touch, and anti-slip.',
    shortDescription: 'Dual-sided Mediterranean cork and natural rubber desk pad.',
    price: 1199,
    originalPrice: 1499,
    stock: 40,
    category: 'Eco Tech Accessories',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 25, reusability: 23, packaging: 19, durability: 14, recyclability: 14 },
    ecoImpact: {
      plasticAvoidedGrams: 850,
      carbonSavedKg: 9.2,
      materials: ['Sustainably Harvested Oak Cork', 'Natural Recycled Tree Rubber'],
      packagingType: 'Kraft paper roll tube with metal ends',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Polyurethane artificial leather desk pads',
      annualWasteAvoided: 'Harvesting cork bark actually helps the oak tree absorb 3x more CO2*',
      comparisonNote: 'Cork is harvested without felling trees; the bark naturally regenerates every 9 years.*',
    },
    averageRating: 4.8,
    numReviews: 22,
    tags: ['tech', 'desk', 'workspace', 'cork'],
    featured: false,
  },
  {
    name: 'Solar Powered Wireless Bluetooth Speaker',
    description: 'Portable outdoor sound system featuring an integrated high-efficiency solar panel, bamboo grille, and casing made from 100% recycled plastics. Delivers 16 hours of rich acoustic playback.',
    shortDescription: 'Outdoor Bluetooth speaker with built-in solar cell and bamboo grille.',
    price: 2499,
    originalPrice: 2999,
    stock: 28,
    category: 'Eco Tech Accessories',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    ecoBreakdown: { material: 22, reusability: 24, packaging: 18, durability: 13, recyclability: 12 },
    ecoImpact: {
      plasticAvoidedGrams: 1200,
      carbonSavedKg: 14.5,
      materials: ['Moso Bamboo Soundboard', 'Post-Consumer Recycled Polycarbonate', 'Monocrystalline Solar Cell'],
      packagingType: 'Molded paper pulp packaging, zero Styrofoam',
      isReusable: true,
      isRecyclable: true,
    },
    disposableAlternative: {
      name: 'Non-repairable virgin plastic mini speakers',
      annualWasteAvoided: 'Zero grid electricity required during outdoor use*',
      comparisonNote: 'Combines renewable solar energy and natural acoustic bamboo resonance.*',
    },
    averageRating: 4.9,
    numReviews: 19,
    tags: ['audio', 'speaker', 'solar', 'tech', 'bestseller'],
    featured: true,
  },
];

const challengesData = [
  {
    title: 'Zero Single-Use Coffee Cups',
    description: 'Use your reusable tumbler or dine in at a cafe for all hot beverages throughout the entire week.',
    category: 'Waste Reduction',
    points: 75,
    difficulty: 'Easy',
    tip: 'Keep your insulated mug in your backpack or near your keys so you never leave home without it.',
    active: true,
  },
  {
    title: 'Plastic-Free Grocery Run',
    description: 'Complete all household grocery shopping using reusable canvas tote bags and mesh produce sacks.',
    category: 'Waste Reduction',
    points: 100,
    difficulty: 'Medium',
    tip: 'Choose loose fruits and vegetables over shrink-wrapped produce bundles at local farmers markets.',
    active: true,
  },
  {
    title: 'Cold-Water Laundry Cycle',
    description: 'Wash all clothing loads on cold water settings (30°C / 85°F or lower) to slash electrical heating demand.',
    category: 'Energy & Climate',
    points: 50,
    difficulty: 'Easy',
    tip: 'About 75% to 90% of energy your washing machine uses goes toward heating the water.',
    active: true,
  },
  {
    title: 'Zero Food Waste Pantry Cleanout',
    description: 'Cook 5 consecutive meals using solely ingredients already existing in your pantry, fridge, or freezer.',
    category: 'Circular Living',
    points: 125,
    difficulty: 'Deep Impact',
    tip: 'Turn vegetable peelings and scraps into homemade vegetable stock rather than discarding them.',
    active: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log('Seeding EcoSphere database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Challenge.deleteMany({}),
    ]);

    // 1. Create Demo Customer & Demo Admin
    const demoCustomer = await User.create({
      name: 'Aarav Patel (Demo Customer)',
      email: 'demo@ecosphere.dev',
      password: 'EcoDemo123!',
      role: 'customer',
      ecoPoints: 340,
    });

    const demoAdmin = await User.create({
      name: 'EcoSphere Admin',
      email: 'admin@ecosphere.dev',
      password: 'EcoAdmin123!',
      role: 'admin',
      ecoPoints: 850,
    });

    // 2. Insert Products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${createdProducts.length} sustainable products`);

    // 3. Insert Challenges
    const createdChallenges = await Challenge.insertMany(challengesData);
    console.log(`Successfully seeded ${createdChallenges.length} eco challenges`);

    // Add one completed challenge to demo user
    demoCustomer.completedChallenges.push({
      challenge: createdChallenges[0]._id,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });
    // Add two products to demo user's wishlist
    demoCustomer.wishlist.push(createdProducts[0]._id, createdProducts[4]._id);
    await demoCustomer.save();

    // 4. Create Initial Reviews for products
    const sampleReviews = [
      {
        product: createdProducts[0]._id, // Flask
        user: demoCustomer._id,
        name: demoCustomer.name,
        rating: 5,
        comment: 'Exceeded all expectations. The finish is stunning and it kept my cold water chilled through an entire hike in summer heat. Highly recommended!',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[1]._id, // Tote
        user: demoAdmin._id,
        name: demoAdmin.name,
        rating: 5,
        comment: 'Super sturdy canvas and generous internal pockets. It easily carries two heavy glass bottles and produce without straining.',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[4]._id, // Linen sheets
        user: demoCustomer._id,
        name: demoCustomer.name,
        rating: 5,
        comment: 'Incredible texture and breathability. Knowing it is authentic French flax with no microplastics gives great peace of mind.',
        verifiedPurchase: true,
      },
    ];
    await Review.insertMany(sampleReviews);

    // 5. Create Seed Orders for Demo Customer to show order history & impact
    const seedOrder1 = await Order.create({
      user: demoCustomer._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 1,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          ecoScore: createdProducts[0].ecoScore,
          plasticAvoidedGrams: createdProducts[0].ecoImpact.plasticAvoidedGrams,
          carbonSavedKg: createdProducts[0].ecoImpact.carbonSavedKg,
        },
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          quantity: 2,
          image: createdProducts[1].images[0],
          price: createdProducts[1].price,
          ecoScore: createdProducts[1].ecoScore,
          plasticAvoidedGrams: createdProducts[1].ecoImpact.plasticAvoidedGrams * 2,
          carbonSavedKg: createdProducts[1].ecoImpact.carbonSavedKg * 2,
        },
      ],
      shippingAddress: {
        fullName: 'Aarav Patel',
        phone: '+91 98765 43210',
        address: '42 Green Horizon Lane, Sector 14',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
      },
      paymentMethod: 'COD',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      itemsPrice: createdProducts[0].price + createdProducts[1].price * 2,
      shippingPrice: 0,
      totalPrice: createdProducts[0].price + createdProducts[1].price * 2,
      impactSummary: {
        totalPlasticAvoidedGrams: 10400,
        totalCarbonSavedKg: 36.9,
        avgEcoScore: 95,
        reusableItemsCount: 3,
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    });

    const seedOrder2 = await Order.create({
      user: demoCustomer._id,
      orderItems: [
        {
          product: createdProducts[8]._id, // Solid shampoo
          name: createdProducts[8].name,
          quantity: 2,
          image: createdProducts[8].images[0],
          price: createdProducts[8].price,
          ecoScore: createdProducts[8].ecoScore,
          plasticAvoidedGrams: createdProducts[8].ecoImpact.plasticAvoidedGrams * 2,
          carbonSavedKg: createdProducts[8].ecoImpact.carbonSavedKg * 2,
        },
      ],
      shippingAddress: {
        fullName: 'Aarav Patel',
        phone: '+91 98765 43210',
        address: '42 Green Horizon Lane, Sector 14',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
      },
      paymentMethod: 'CARD_DEMO',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      itemsPrice: createdProducts[8].price * 2,
      shippingPrice: 99,
      totalPrice: createdProducts[8].price * 2 + 99,
      impactSummary: {
        totalPlasticAvoidedGrams: 480,
        totalCarbonSavedKg: 11.2,
        avgEcoScore: 95,
        reusableItemsCount: 0,
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    console.log('Seeded demo orders and impact records successfully!');
    return {
      productsCount: createdProducts.length,
      demoCustomer,
      demoAdmin,
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase, productsData, challengesData };

if (require.main === module) {
  require('dotenv').config({ path: '../.env' });
  const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecosphere';
  mongoose
    .connect(dbUri)
    .then(async () => {
      console.log('Connected to MongoDB. Running standalone seed...');
      await seedDatabase();
      await mongoose.disconnect();
      console.log('Seeding complete. Disconnected.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error connecting to database:', err);
      process.exit(1);
    });
}
