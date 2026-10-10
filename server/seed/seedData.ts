export const sampleUsers = [
  {
    name: 'Aarav Mehta',
    email: 'aarav@desikart.in',
    password: 'Password@123',
    phone: '9820198201',
    role: 'user',
    addresses: [
      {
        fullName: 'Aarav Mehta',
        phone: '9820198201',
        street: 'Flat 402, Sea Green Heights, Worli Sea Face',
        landmark: 'Near Worli Dairy',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400018',
        addressType: 'Home',
        isDefault: true
      },
      {
        fullName: 'Aarav Mehta',
        phone: '9820198201',
        street: 'Level 7, Maker Chambers IV, Nariman Point',
        landmark: 'Opposite State Bank Bhavan',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400021',
        addressType: 'Work',
        isDefault: false
      }
    ]
  },
  {
    name: 'Priya Nair',
    email: 'priya@desikart.in',
    password: 'Password@123',
    phone: '9845098450',
    role: 'user',
    addresses: [
      {
        fullName: 'Priya Nair',
        phone: '9845098450',
        street: 'Villa 14, Palm Meadows, Whitefield',
        landmark: 'Near Forum Shantiniketan',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        addressType: 'Home',
        isDefault: true
      }
    ]
  },
  {
    name: 'Vikram Reddy (Admin)',
    email: 'admin@desikart.in',
    password: 'Admin@123',
    phone: '9849098490',
    role: 'admin',
    addresses: [
      {
        fullName: 'Vikram Reddy',
        phone: '9849098490',
        street: 'Plot 82, Road No 36, Jubilee Hills',
        landmark: 'Near Peddamma Temple',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        addressType: 'Home',
        isDefault: true
      }
    ]
  }
];

export const sampleProducts = [
  // Category 1: Ethnic Wear & Apparel
  {
    title: 'Pure Kanjeevaram Silk Saree with Gold Zari Border',
    slug: 'pure-kanjeevaram-silk-saree-crimson-gold',
    category: 'Ethnic Wear & Apparel',
    price: 14999,
    mrp: 24999,
    discountPercent: 40,
    rating: 4.9,
    numReviews: 128,
    brand: 'Nalli Heritage Weaves',
    origin: 'Kanchipuram, Tamil Nadu',
    inStock: true,
    stockCount: 14,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handwoven in pure mulberry silk with certified Silk Mark. Intricate Korvai temple borders adorned with real 2G gold electroplated zari motifs. Ideal for Diwali, weddings, and auspicious festivities.',
    highlights: ['100% Pure Mulberry Silk', 'Silk Mark Certified', 'Handloom Woven in Kanchipuram', 'Includes matching unstitched blouse piece (0.8m)'],
    tags: ['saree', 'kanjeevaram', 'silk', 'wedding', 'ethnic', 'festive'],
    specifications: {
      'Fabric': 'Pure Silk with Gold Zari',
      'Length': '6.3 Metres (with Blouse)',
      'Weave Type': 'Kanchipuram Handloom',
      'Care': 'Dry Clean Only',
      'Occasion': 'Bridal / Festive'
    },
    reviews: [
      {
        userName: 'Sneha Kulkarni',
        city: 'Pune',
        rating: 5,
        comment: 'Ekdum shandar saree! The zari shine is subtle and regal. Wore it for Diwali pooja and everyone gave compliments.',
        date: '02/10/2026'
      },
      {
        userName: 'Priya Nair',
        city: 'Bengaluru',
        rating: 5,
        comment: 'Heavy pure silk, exactly like bought from high-end boutiques in Mylapore. Worth every rupee.',
        date: '28/09/2026'
      }
    ]
  },
  {
    title: 'Lucknowi Chikankari Hand-Embroidered Kurta Set',
    slug: 'lucknowi-chikankari-hand-embroidered-kurta-set',
    category: 'Ethnic Wear & Apparel',
    price: 2499,
    mrp: 4999,
    discountPercent: 50,
    rating: 4.8,
    numReviews: 215,
    brand: 'Awadh Karigari',
    origin: 'Lucknow, Uttar Pradesh',
    inStock: true,
    stockCount: 30,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic handcrafted Chikan embroidery on airy georgette fabric. Features traditional Bakhiya and Phanda stitches done by master artisans in Old Lucknow. Comes with matching modal palazzo pants.',
    highlights: ['Fine Georgette with Cotton Inner', 'Traditional Hand Embroidery', 'Breathable & Lightweight', 'Includes Kurta, Inner Slip & Palazzo'],
    tags: ['kurta', 'chikankari', 'lucknow', 'ethnic', 'summer', 'festive'],
    specifications: {
      'Fabric': 'Fine Georgette with Cotton Slip',
      'Sleeve Length': 'Three-Quarter Sleeves',
      'Embroidery': 'Bakhiya & Phanda Stitches',
      'Fit': 'Regular Straight Cut',
      'Wash Care': 'Gentle Hand Wash'
    },
    reviews: [
      {
        userName: 'Ananya Das',
        city: 'Kolkata',
        rating: 5,
        comment: 'Intricate stitching, looks so graceful! The matching palazzo is very comfortable. Super fast delivery.',
        date: '04/10/2026'
      },
      {
        userName: 'Rohan Iyer',
        city: 'Mumbai',
        rating: 4,
        comment: 'Gifted this to my mother, she loved the soft texture and subtle Lucknowi motifs.',
        date: '25/09/2026'
      }
    ]
  },
  {
    title: 'Rajasthani Handcrafted Leather Mojari Juttis',
    slug: 'rajasthani-handcrafted-leather-mojari-juttis',
    category: 'Ethnic Wear & Apparel',
    price: 1299,
    mrp: 2199,
    discountPercent: 41,
    rating: 4.7,
    numReviews: 94,
    brand: 'Marwar Crafts',
    origin: 'Jodhpur, Rajasthan',
    inStock: true,
    stockCount: 22,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-stitched genuine leather juttis with traditional brass and copper thread work. Cushioned double-padded insole ensures bite-free comfort during festive dance and long family functions.',
    highlights: ['100% Genuine Camel Leather', 'Double Cushioning Insole', 'Anti-Bite Velvet Lined Counter', 'Durable Handmade Stitching'],
    tags: ['juttis', 'mojari', 'shoes', 'footwear', 'rajasthan', 'ethnic'],
    specifications: {
      'Upper Material': 'Embroidered Leather',
      'Sole Material': 'Pure Vegetable Tanned Leather',
      'Closure': 'Slip-On',
      'Pattern': 'Traditional Rajasthani Dabka',
      'Fit': 'True to Size'
    },
    reviews: [
      {
        userName: 'Gurpreet Singh',
        city: 'Chandigarh',
        rating: 5,
        comment: 'Very comfortable soles, no shoe bite at all! Looks killer with my pathani suit.',
        date: '01/10/2026'
      }
    ]
  },
  {
    title: 'Jaipuri Bandhani Cotton Anarkali Dress with Dupatta',
    slug: 'jaipuri-bandhani-cotton-anarkali-dress',
    category: 'Ethnic Wear & Apparel',
    price: 1899,
    mrp: 3499,
    discountPercent: 46,
    rating: 4.6,
    numReviews: 76,
    brand: 'Gulabi Nagari',
    origin: 'Jaipur, Rajasthan',
    inStock: true,
    stockCount: 18,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vibrant tie-and-dye Bandhej pattern crafted on 60x60 pure cotton. Features flared kalis with Gota Patti trims on border and neck.',
    highlights: ['Pure 60x60 Cambric Cotton', 'Authentic Bandhej Dyeing', 'Gota Patti Detailing', 'Full Flared Anarkali Silhouette'],
    tags: ['bandhani', 'anarkali', 'jaipur', 'cotton', 'dress'],
    specifications: {
      'Fabric': '100% Breathable Cotton',
      'Length': '48 Inches',
      'Neckline': 'Sweetheart with Gota',
      'Care': 'First Wash Dry Clean'
    },
    reviews: [
      {
        userName: 'Aarav Mehta',
        city: 'Mumbai',
        rating: 5,
        comment: 'Bright festive colours! Purchased for sister, fits flawlessly according to the size chart.',
        date: '03/10/2026'
      }
    ]
  },

  // Category 2: Ayurvedic & Wellness
  {
    title: 'Kashmiri Kesar Pure Saffron Threads (1g Grade A1)',
    slug: 'kashmiri-kesar-pure-saffron-threads-1g',
    category: 'Ayurvedic & Wellness',
    price: 749,
    mrp: 1199,
    discountPercent: 38,
    rating: 4.9,
    numReviews: 340,
    brand: 'Pampore Royal Spice',
    origin: 'Pampore, Kashmir',
    inStock: true,
    stockCount: 50,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Directly sourced from the saffron fields of Pampore Valley. Deep crimson Mongra stigma threads delivering intense golden hue and intoxicating aroma. Lab tested for Crocin levels above 220.',
    highlights: ['100% Pure Mongra Saffron', 'GI Tagged Origin (Pampore)', 'High Crocin & Safranal Content', 'Hermetically Sealed Glass Vial'],
    tags: ['saffron', 'kesar', 'kashmir', 'ayurveda', 'wellness', 'organic'],
    specifications: {
      'Form': 'Whole Dried Stigmas',
      'Quantity': '1 Gram',
      'Shelf Life': '24 Months',
      'Grade': 'A1 Premium Mongra'
    },
    reviews: [
      {
        userName: 'Priya Nair',
        city: 'Bengaluru',
        rating: 5,
        comment: 'Just two strands turn kheer into divine saffron gold! Khushboo is out of this world.',
        date: '05/10/2026'
      },
      {
        userName: 'Imran Qureshi',
        city: 'Lucknow',
        rating: 5,
        comment: 'Real Kashmiri saffron, tested in warm water and colour released slowly as expected of authentic kesar.',
        date: '29/09/2026'
      }
    ]
  },
  {
    title: 'Himalayan Shilajit Resin with Fulvic Acid (20g)',
    slug: 'himalayan-shilajit-resin-fulvic-acid-20g',
    category: 'Ayurvedic & Wellness',
    price: 1499,
    mrp: 2499,
    discountPercent: 40,
    rating: 4.8,
    numReviews: 189,
    brand: 'VedaShakti Herbs',
    origin: 'Kullu, Himachal Pradesh',
    inStock: true,
    stockCount: 35,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Purified via traditional Shodhana method using Triphala decoction. Harvested above 16,000 feet in the Himalayan crags. Enriched with over 80 trace ionic minerals and 75%+ fulvic acid for stamina and mental clarity.',
    highlights: ['75%+ Lab Tested Fulvic Acid', 'Traditional Shodhana Purification', 'Includes Gold Dosage Spoon', 'Zero Heavy Metals, NABL Lab Certified'],
    tags: ['shilajit', 'ayurveda', 'energy', 'immunity', 'himalayan'],
    specifications: {
      'Form': 'Pure Viscous Resin',
      'Quantity': '20 Grams (Approx. 60 Servings)',
      'Storage': 'Store in cool dry place',
      'Dosage': 'Pea-sized amount in lukewarm milk or water'
    },
    reviews: [
      {
        userName: 'Vikram Reddy',
        city: 'Hyderabad',
        rating: 5,
        comment: 'Daily energy levels have skyrocketed. Authentic earthy taste and dissolves smoothly in warm milk.',
        date: '04/10/2026'
      }
    ]
  },
  {
    title: 'Ayurvedic Chyawanprash Supreme with Gold & Silver Bhasma (500g)',
    slug: 'ayurvedic-chyawanprash-supreme-gold-silver-500g',
    category: 'Ayurvedic & Wellness',
    price: 599,
    mrp: 899,
    discountPercent: 33,
    rating: 4.7,
    numReviews: 210,
    brand: 'Dhanvantari Rasashala',
    origin: 'Haridwar, Uttarakhand',
    inStock: true,
    stockCount: 40,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Made with fresh organic Amlas cooked in pure Desi Cow Ghee and sweetened with raw wild honey and organic jaggery. Fortified with Swarna and Rajat Bhasma for seasonal immunity.',
    highlights: ['Fresh Wild Amla Base', 'A2 Desi Cow Ghee Infused', 'Sugar-Free: Jaggery & Honey Only', '48 Potent Ayurvedic Herbs'],
    tags: ['chyawanprash', 'immunity', 'ayurveda', 'amla', 'wellness'],
    specifications: {
      'Net Weight': '500 Grams',
      'Key Herb': 'Emblica Officinalis (Amla)',
      'Sweetener': 'Organic Gur & Wild Honey'
    },
    reviews: [
      {
        userName: 'Aarav Mehta',
        city: 'Mumbai',
        rating: 5,
        comment: 'No artificial sugar taste. Kids take it willingly with milk in the morning. Great winter protection.',
        date: '01/10/2026'
      }
    ]
  },
  {
    title: 'Kerala Forest Pure Wild Raw Honey (500g Glass Jar)',
    slug: 'kerala-forest-pure-wild-raw-honey-500g',
    category: 'Ayurvedic & Wellness',
    price: 449,
    mrp: 650,
    discountPercent: 31,
    rating: 4.8,
    numReviews: 165,
    brand: 'Western Ghats Tribals',
    origin: 'Wayanad, Kerala',
    inStock: true,
    stockCount: 60,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unprocessed, unheated, single-origin multi-floral honey collected from rock bee hives in the dense evergreen forests of Wayanad. Naturally rich in bee pollen and propolis.',
    highlights: ['NMR Tested 100% Pure', 'Unpasteurised & Unfiltered', 'Supports Tribal Bee Harvesters', 'Packed in Glass Jar'],
    tags: ['honey', 'kerala', 'raw', 'organic', 'wild'],
    specifications: {
      'Net Weight': '500 Grams',
      'Origin': 'Wayanad Evergreen Canopies',
      'Consistency': 'Dense & Naturally Crystallising'
    },
    reviews: [
      {
        userName: 'Sneha Kulkarni',
        city: 'Pune',
        rating: 5,
        comment: 'Rich smoky floral aroma. Far better than supermarket commercial syrups!',
        date: '27/09/2026'
      }
    ]
  },

  // Category 3: Spices & Dry Fruits
  {
    title: 'Kashmiri Mamra Almonds (500g High Oil Content)',
    slug: 'kashmiri-mamra-almonds-500g',
    category: 'Spices & Dry Fruits',
    price: 1199,
    mrp: 1799,
    discountPercent: 33,
    rating: 4.9,
    numReviews: 290,
    brand: 'Kashmir Valley Orchards',
    origin: 'Pulwama, Kashmir',
    inStock: true,
    stockCount: 45,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Concave-shaped organic Mamra Badam loaded with natural almond oil (up to 50%). Zero cholesterol, rich in Vitamin E. Soak 5 almonds overnight for optimal cognitive health.',
    highlights: ['100% Original Kashmiri Mamra', 'Not chemically polished', 'Highest natural oil content', 'Vacuum sealed nitrogen pouch'],
    tags: ['almonds', 'badam', 'kashmir', 'dryfruits', 'healthy'],
    specifications: {
      'Weight': '500 Grams',
      'Oil Content': '48% – 52%',
      'Shelf Life': '9 Months',
      'Taste': 'Sweet & Nutty'
    },
    reviews: [
      {
        userName: 'Priya Nair',
        city: 'Bengaluru',
        rating: 5,
        comment: 'Mamra badam oil leaves a sheen on your fingers when cracked. Crunchy and sweet, not a single bitter one.',
        date: '03/10/2026'
      }
    ]
  },
  {
    title: 'Malabar Black Peppercorns & Green Cardamom Festive Box',
    slug: 'malabar-black-peppercorns-cardamom-festive-box',
    category: 'Spices & Dry Fruits',
    price: 699,
    mrp: 1099,
    discountPercent: 36,
    rating: 4.8,
    numReviews: 145,
    brand: 'Spice Coast Heritage',
    origin: 'Idukki, Kerala',
    inStock: true,
    stockCount: 38,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1599909624555-9b291c136367?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Includes 250g bold Tellicherry Garbled Extra Bold (TGSEB) black peppercorns and 100g 8mm Alleppey green cardamom pods. Packed in airtight brass-foil canisters.',
    highlights: ['Tellicherry Extra Bold Peppercorns', '8mm Green Cardamom Pods', 'Sun-Dried & Hand Sorted', 'Intense Piperine and Cineole'],
    tags: ['spices', 'cardamom', 'pepper', 'kerala', 'masala'],
    specifications: {
      'Net Contents': '250g Pepper + 100g Cardamom',
      'Grade': 'TGSEB & 8mm Bold',
      'Harvest Year': 'Current Season'
    },
    reviews: [
      {
        userName: 'Imran Qureshi',
        city: 'Lucknow',
        rating: 5,
        comment: 'The aroma when you crack open the elaichi pod fills the entire kitchen. Perfect for Awadhi biryani!',
        date: '02/10/2026'
      }
    ]
  },
  {
    title: 'Roasted Cashews with Jodhpur Mirchi & Himalayan Pink Salt (350g)',
    slug: 'roasted-cashews-jodhpur-mirchi-pink-salt-350g',
    category: 'Spices & Dry Fruits',
    price: 499,
    mrp: 750,
    discountPercent: 33,
    rating: 4.7,
    numReviews: 180,
    brand: 'Royal Marwar Dry Fruits',
    origin: 'Mangalore / Jodhpur',
    inStock: true,
    stockCount: 55,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1536591375315-1b836890ba4e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'W240 grade whole cashew nuts slowly roasted in brass kadhai without palm oil. Seasoned with fiery Mathania chili flakes and crushed Himalayan rock salt.',
    highlights: ['Zero Palm Oil Roasting', 'W240 Jumbo Cashew Kernels', 'Mathania Red Chilli Seasoning', 'Zip-lock Standup Pouch'],
    tags: ['cashew', 'kaju', 'snacks', 'namkeen', 'festive'],
    specifications: {
      'Weight': '350 Grams',
      'Cashew Grade': 'W240 Whole',
      'Allergen Info': 'Contains Tree Nuts'
    },
    reviews: [
      {
        userName: 'Aarav Mehta',
        city: 'Mumbai',
        rating: 5,
        comment: 'Chatpata and super fresh crunch. Ended up finishing half the packet on evening chai!',
        date: '04/10/2026'
      }
    ]
  },
  {
    title: 'Darjeeling First Flush Single Estate Vintage Tin (100g)',
    slug: 'darjeeling-first-flush-single-estate-tin-100g',
    category: 'Spices & Dry Fruits',
    price: 899,
    mrp: 1399,
    discountPercent: 36,
    rating: 4.9,
    numReviews: 110,
    brand: 'Makaibari Heritage',
    origin: 'Darjeeling, West Bengal',
    inStock: true,
    stockCount: 30,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The Champagne of Teas. Plucked in early spring from misty slopes at 4,000 feet. Light muscatel notes with a delicate amber liquor and lingering floral sweetness.',
    highlights: ['Certified Biodynamic Estate', 'First Spring Flush Harvest', 'Whole Leaf FTGFOP1 Grade', 'Collectible Vintage Metal Caddy'],
    tags: ['tea', 'chai', 'darjeeling', 'organic', 'beverage'],
    specifications: {
      'Weight': '100 Grams',
      'Leaf Grade': 'FTGFOP1 Loose Leaf',
      'Brewing Time': '3-4 Minutes at 85°C'
    },
    reviews: [
      {
        userName: 'Ananya Das',
        city: 'Kolkata',
        rating: 5,
        comment: 'Pure elegance in a cup. Do not add milk or sugar—drink it plain to appreciate the floral muscatel bouquet.',
        date: '01/10/2026'
      }
    ]
  },

  // Category 4: Handicrafts & Home Decor
  {
    title: 'Moradabad Brass Peacock Diya Urli Set (Handcrafted)',
    slug: 'moradabad-brass-peacock-diya-urli-set',
    category: 'Handicrafts & Home Decor',
    price: 2199,
    mrp: 3999,
    discountPercent: 45,
    rating: 4.8,
    numReviews: 142,
    brand: 'Peetal Nagari Crafts',
    origin: 'Moradabad, Uttar Pradesh',
    inStock: true,
    stockCount: 20,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1606744888344-493238955dd5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy solid brass urli bowl featuring hand-engraved dancing peacock handles and 5 detachable diya oil lamps. Fill with water and float marigold petals for Diwali and Griha Pravesh.',
    highlights: ['Solid Virgin Brass (Weight: 2.1 kg)', 'Antique Golden Lacquer Coating', 'Traditional Moradabad Metal Casting', 'Tarnish Resistant Finish'],
    tags: ['urli', 'brass', 'diya', 'diwali', 'home decor', 'puja'],
    specifications: {
      'Material': '100% Solid Brass',
      'Diameter': '12 Inches',
      'Weight': '2100 Grams',
      'Cleaning': 'Pitambari powder or lemon with cloth'
    },
    reviews: [
      {
        userName: 'Sneha Kulkarni',
        city: 'Pune',
        rating: 5,
        comment: 'Heavyweight brass, gorgeous peacock details! Made our Diwali living room look grand and peaceful.',
        date: '04/10/2026'
      }
    ]
  },
  {
    title: 'Blue Pottery Hand-Painted Ceramic Floral Vase (Jaipur Craft)',
    slug: 'blue-pottery-hand-painted-ceramic-floral-vase',
    category: 'Handicrafts & Home Decor',
    price: 1149,
    mrp: 1899,
    discountPercent: 39,
    rating: 4.7,
    numReviews: 88,
    brand: 'Jaipur Blue Artisans',
    origin: 'Jaipur, Rajasthan',
    inStock: true,
    stockCount: 25,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Turquoise and cobalt blue hand-painted vase made with quartz stone powder, raw glass, and multani mitti without clay. Traditional Persian floral motifs fired at low heat.',
    highlights: ['GI Tagged Jaipur Blue Pottery', 'Hand-Painted Floral Motifs', 'Lead-Free Glaze', '10 Inches Height'],
    tags: ['pottery', 'vase', 'jaipur', 'home decor', 'handicraft'],
    specifications: {
      'Height': '10 Inches',
      'Material': 'Quartz Stone, Fuller Earth & Glass',
      'Color Palette': 'Cobalt Blue & Turquoise'
    },
    reviews: [
      {
        userName: 'Priya Nair',
        city: 'Bengaluru',
        rating: 5,
        comment: 'Arrived very safely packed in thermocol. The shade of blue brings life to my dining table console.',
        date: '29/09/2026'
      }
    ]
  },
  {
    title: 'Dhokra Brass Tribal Art Figurine (Bastar Heritage)',
    slug: 'dhokra-brass-tribal-art-figurine-bastar',
    category: 'Handicrafts & Home Decor',
    price: 1699,
    mrp: 2799,
    discountPercent: 39,
    rating: 4.9,
    numReviews: 64,
    brand: 'Bastar Tribal Collective',
    origin: 'Bastar, Chhattisgarh',
    inStock: true,
    stockCount: 15,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Created using the 4,000-year-old lost-wax casting technique dating back to the Indus Valley civilization. Each figurine is individually hand-moulded with beeswax threads so no two pieces are identical.',
    highlights: ['Lost-Wax Casting Technique', '100% Unique Collector Piece', 'Supports Indigenous Bastar Artisans', 'Sturdy Solid Metal Base'],
    tags: ['dhokra', 'tribal', 'brass', 'art', 'sculpture'],
    specifications: {
      'Height': '8.5 Inches',
      'Weight': '850 Grams',
      'Material': 'Bell Metal & Brass'
    },
    reviews: [
      {
        userName: 'Rohan Iyer',
        city: 'Mumbai',
        rating: 5,
        comment: 'A piece of Indian history on my bookshelf. The rustic texture and primitive form is mesmerizing.',
        date: '26/09/2026'
      }
    ]
  },
  {
    title: 'Hand-Tufted Kashmiri Wool Floral Carpet (4x6 ft)',
    slug: 'hand-tufted-kashmiri-wool-floral-carpet-4x6',
    category: 'Handicrafts & Home Decor',
    price: 7499,
    mrp: 12999,
    discountPercent: 42,
    rating: 4.8,
    numReviews: 52,
    brand: 'Chinar Rugs',
    origin: 'Srinagar, Kashmir',
    inStock: true,
    stockCount: 8,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven with New Zealand blend wool on cotton warp. Classic Kashmiri Paisley and Chinar leaf patterns with plush 0.75-inch pile depth that feels cloud-soft underfoot.',
    highlights: ['High Density Hand-Tufted Pile', 'Zero Shedding Treatment', 'Non-Slip Latex Backing', 'Rich Jewel Tones'],
    tags: ['carpet', 'rug', 'kashmir', 'wool', 'decor'],
    specifications: {
      'Dimensions': '4 feet x 6 feet (120x180 cm)',
      'Pile Height': '18 mm',
      'Yarn': '80% Wool, 20% Silken Viscose'
    },
    reviews: [
      {
        userName: 'Vikram Reddy',
        city: 'Hyderabad',
        rating: 5,
        comment: 'Super soft under bare feet and transformed our formal drawing room completely. Excellent quality.',
        date: '03/10/2026'
      }
    ]
  },

  // Category 5: Mobiles & Gadgets
  {
    title: 'BharatPad Pro 5G Ultra Smartphone (12GB+256GB, 108MP)',
    slug: 'bharatpad-pro-5g-ultra-smartphone-12gb-256gb',
    category: 'Mobiles & Gadgets',
    price: 24999,
    mrp: 32999,
    discountPercent: 24,
    rating: 4.7,
    numReviews: 480,
    brand: 'BharatTech India',
    origin: 'Noida, Uttar Pradesh',
    inStock: true,
    stockCount: 40,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed and assembled in India under Make in India initiative. 6.78" 120Hz AMOLED curved display, 108MP OIS triple camera, 5000mAh battery with 67W Turbo Flash Charge. Supports all 14 Indian 5G bands and NavIC GPS.',
    highlights: ['ISRO NavIC Satellite Navigation', '120Hz Curved FHD+ AMOLED Display', '67W Turbo Flash Charger in Box', 'Made in India with 2-Year Warranty'],
    tags: ['smartphone', 'mobile', '5g', 'gadgets', 'tech'],
    specifications: {
      'Display': '6.78-inch 120Hz Curved AMOLED',
      'Processor': 'Octa-core 5G 4nm Processor',
      'Camera': '108MP (OIS) + 8MP Ultrawide + 2MP Macro',
      'Battery': '5000 mAh with 67W Charger',
      'RAM / Storage': '12GB LPDDR5 / 256GB UFS 3.1'
    },
    reviews: [
      {
        userName: 'Aarav Mehta',
        city: 'Mumbai',
        rating: 5,
        comment: 'Bohot zabardast phone! 120Hz display is buttery smooth and camera clicks crisp photos even at night.',
        date: '05/10/2026'
      },
      {
        userName: 'Gurpreet Singh',
        city: 'Chandigarh',
        rating: 4,
        comment: 'Battery lasts full 1.5 days with heavy Jio 5G usage. NavIC GPS locks location within 2 seconds.',
        date: '02/10/2026'
      }
    ]
  },
  {
    title: 'BoAt SonicBass Wireless ANC Earbuds (Tricolour Edition)',
    slug: 'boat-sonicbass-wireless-anc-earbuds-tricolour',
    category: 'Mobiles & Gadgets',
    price: 1699,
    mrp: 3999,
    discountPercent: 58,
    rating: 4.6,
    numReviews: 310,
    brand: 'boAt Lifestyle',
    origin: 'Bengaluru, Karnataka',
    inStock: true,
    stockCount: 65,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Equipped with 32dB Active Noise Cancellation and Quad-Mics with ENx technology for crystal clear calling on crowded Mumbai local trains. 50 hours of total playback with ASAP Charge (10 mins = 150 mins).',
    highlights: ['32dB Hybrid Active Noise Cancellation', '50 Hours Mega Battery Life', '11mm Bionic Bass Drivers', 'IPX5 Water & Sweat Resistance'],
    tags: ['earbuds', 'audio', 'boat', 'anc', 'wireless', 'bluetooth'],
    specifications: {
      'Driver Size': '11mm Titanium Coated',
      'Noise Cancellation': 'Up to 32dB Hybrid ANC',
      'Bluetooth': 'v5.3 with Fast Pair',
      'Battery Playtime': '10 hrs per bud + 40 hrs case'
    },
    reviews: [
      {
        userName: 'Rohan Iyer',
        city: 'Mumbai',
        rating: 5,
        comment: 'ANC cuts out bus and local train rumble completely. Heavy bass just the way Bollywood songs need!',
        date: '01/10/2026'
      }
    ]
  },
  {
    title: 'DesiCharge 20000mAh 33W Fast Power Bank with LED Display',
    slug: 'desicharge-20000mah-33w-fast-power-bank',
    category: 'Mobiles & Gadgets',
    price: 1299,
    mrp: 2499,
    discountPercent: 48,
    rating: 4.8,
    numReviews: 195,
    brand: 'Ambrane India',
    origin: 'Sonipat, Haryana',
    inStock: true,
    stockCount: 50,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1609592426860-264ce4990c60?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy duty high density lithium polymer power bank with Power Delivery (PD) and Quick Charge 3.0. Charges iPhones to 50% in 30 mins and can charge 3 devices simultaneously with 12 layers of circuit protection.',
    highlights: ['33W Two-Way Fast Charging', 'Digital Numerical LED Battery % Meter', 'Charges 3 Devices Simultaneously', 'Flight Approved for Domestic Travel'],
    tags: ['powerbank', 'charger', 'battery', 'travel', 'gadgets'],
    specifications: {
      'Capacity': '20,000 mAh (74Wh)',
      'Output Ports': '2x USB-A + 1x Type-C PD',
      'Protection': '12-Layer Smart Protection'
    },
    reviews: [
      {
        userName: 'Vikram Reddy',
        city: 'Hyderabad',
        rating: 5,
        comment: 'Charged my phone twice and iPad once on an overnight train trip, still had 30% battery left!',
        date: '28/09/2026'
      }
    ]
  },
  {
    title: 'Noise Pulse Smartwatch with Blood Oxygen & Hindi UI',
    slug: 'noise-pulse-smartwatch-blood-oxygen-hindi-ui',
    category: 'Mobiles & Gadgets',
    price: 1999,
    mrp: 4499,
    discountPercent: 56,
    rating: 4.6,
    numReviews: 240,
    brand: 'Noise India',
    origin: 'Gurugram, Haryana',
    inStock: true,
    stockCount: 35,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: '1.85-inch vibrant TFT display with 550 nits peak brightness. Bluetooth calling with high fidelity speaker, 100+ sports modes, 24x7 Heart Rate & SpO2 monitoring, and regional Indian language interface support.',
    highlights: ['Bluetooth Calling with Dial Pad', 'Hindi & English Dual Language UI', '100+ Cloud Watch Faces', '7-Day Battery Life on Single Charge'],
    tags: ['smartwatch', 'fitness', 'noise', 'wearables', 'bluetooth'],
    specifications: {
      'Screen': '1.85-inch TFT LCD (550 Nits)',
      'Waterproof': 'IP68 Certified',
      'Battery': '7 Days Typical Usage',
      'Sensors': 'Optical HR, SpO2, Accelerometer'
    },
    reviews: [
      {
        userName: 'Sneha Kulkarni',
        city: 'Pune',
        rating: 5,
        comment: 'Hindi language support helped my parents use it easily. Steps count and BP/SpO2 readings are accurate.',
        date: '03/10/2026'
      }
    ]
  },

  // Category 6: Fitness & Daily Essentials
  {
    title: 'Pure Khadi Cotton Yoga Mat with Natural Anti-Skid Rubber Base',
    slug: 'pure-khadi-cotton-yoga-mat-anti-skid-rubber',
    category: 'Fitness & Daily Essentials',
    price: 899,
    mrp: 1599,
    discountPercent: 44,
    rating: 4.8,
    numReviews: 122,
    brand: 'Sattva Yoga Weaves',
    origin: 'Varanasi, Uttar Pradesh',
    inStock: true,
    stockCount: 30,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven from handspun organic Khadi cotton with sweat absorption properties that improve grip as you sweat. Backed by natural tree rubber that sticks firmly to marble and tiled Indian floors.',
    highlights: ['Natural Tree Rubber Underside', 'Sweat-Absorbent Organic Khadi Weave', 'Machine Washable Cotton Layer', 'Includes Cotton Shoulder Carry Strap'],
    tags: ['yoga', 'fitness', 'khadi', 'mat', 'wellness'],
    specifications: {
      'Size': '72 x 24 Inches (6 ft)',
      'Thickness': '5 mm',
      'Top Material': '100% Khadi Cotton',
      'Base': 'Natural Vulcanised Rubber'
    },
    reviews: [
      {
        userName: 'Priya Nair',
        city: 'Bengaluru',
        rating: 5,
        comment: 'No toxic plastic smell like cheap PVC mats. Grip during surya namaskar is incredible!',
        date: '02/10/2026'
      }
    ]
  },
  {
    title: 'Ayurvedic Pure Copper Water Bottle (1000ml Hammered Finish)',
    slug: 'ayurvedic-pure-copper-water-bottle-1000ml-hammered',
    category: 'Fitness & Daily Essentials',
    price: 799,
    mrp: 1299,
    discountPercent: 38,
    rating: 4.7,
    numReviews: 175,
    brand: 'Tambe Ka Shuddhata',
    origin: 'Mathura, Uttar Pradesh',
    inStock: true,
    stockCount: 45,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Jointless pure copper vessel hand-hammered by traditional Thathera coppersmiths. Storing water overnight charges it with natural copper ions (Tamra Jal) known in Ayurveda to balance Tridosha.',
    highlights: ['99.7% Pure Certified Copper', 'Leak-Proof Silicone Seal Cap', 'Jointless Seamless Construction', 'Hand-Hammered Diamond Texture'],
    tags: ['copper', 'bottle', 'water', 'ayurveda', 'fitness', 'health'],
    specifications: {
      'Capacity': '1000 ml (1 Litre)',
      'Weight': '290 Grams',
      'Finish': 'Glossy Lacquered Exterior, Raw Copper Interior'
    },
    reviews: [
      {
        userName: 'Aarav Mehta',
        city: 'Mumbai',
        rating: 5,
        comment: 'Leak proof! Carry it to the gym daily. The water tastes noticeably crisp and fresh.',
        date: '04/10/2026'
      }
    ]
  },
  {
    title: 'DesiGhee Organic A2 Bilona Gir Cow Ghee (500ml Glass Jar)',
    slug: 'desighee-organic-a2-bilona-gir-cow-ghee-500ml',
    category: 'Fitness & Daily Essentials',
    price: 1099,
    mrp: 1499,
    discountPercent: 27,
    rating: 4.9,
    numReviews: 310,
    brand: 'Gir Gau Shala',
    origin: 'Junagadh, Gujarat',
    inStock: true,
    stockCount: 35,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Traditional Vedic Bilona method made from cultured curd of grass-fed free-grazing Gir cows, churned both clockwise and anti-clockwise. Slow cooked over wood fire for authentic golden granular Danedaar texture.',
    highlights: ['100% Authentic A2 Beta-Casein', 'Handcrafted Vedic Bilona Churned', 'Rich Golden Granular (Danedaar) Texture', 'Glass Jar Vacuum Sealed'],
    tags: ['ghee', 'a2', 'bilona', 'organic', 'cow', 'food', 'ayurveda'],
    specifications: {
      'Volume': '500 ml',
      'Cow Breed': 'Purebred Gir Cows',
      'Process': 'Whole Milk Curd -> Butter -> Ghee'
    },
    reviews: [
      {
        userName: 'Sneha Kulkarni',
        city: 'Pune',
        rating: 5,
        comment: 'Pooore ghar mein khushboo phel jati hai jab dal tadka banta hai! Asli gaon wala ghee.',
        date: '05/10/2026'
      }
    ]
  },
  {
    title: 'Handloom Cotton Daily Indigo Dabu Print Kurta Shirt',
    slug: 'handloom-cotton-daily-indigo-dabu-print-kurta-shirt',
    category: 'Fitness & Daily Essentials',
    price: 799,
    mrp: 1399,
    discountPercent: 43,
    rating: 4.6,
    numReviews: 95,
    brand: 'Dabu Roots',
    origin: 'Akola, Rajasthan',
    inStock: true,
    stockCount: 40,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Mud-resist Dabu hand-block printed using natural fermented indigo dye. Crafted in relaxed comfort-fit silhouette with coconut shell buttons and mandarin collar for casual office or daily wear.',
    highlights: ['100% Handloom Breathable Cotton', 'Natural Plant-Based Indigo Dye', 'Real Coconut Shell Buttons', 'Mandarin Band Collar with Roll-Up Sleeves'],
    tags: ['shirt', 'kurta', 'indigo', 'cotton', 'men', 'daily'],
    specifications: {
      'Material': '100% Soft Handloom Cotton',
      'Fit': 'Comfort Fit',
      'Pattern': 'Geometric Dabu Mud Block Print',
      'Care': 'Wash dark colors separately'
    },
    reviews: [
      {
        userName: 'Rohan Iyer',
        city: 'Mumbai',
        rating: 5,
        comment: 'Perfect for humid weather. The indigo shade looks very earthy and stylish with jeans or chinos.',
        date: '30/09/2026'
      }
    ]
  }
];
