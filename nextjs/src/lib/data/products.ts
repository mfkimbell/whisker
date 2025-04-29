// src/lib/data/posts.ts


export const posts = [
  {
    /* ---------- Adoption ---------- */
    slug: "kitten-care",
    title: "Kitten Care 101",
    category: "Adoption",
    excerpt: "Everything you need to welcome your new kitten.",
    image: "/adoption.png",
    date: "2023-01-07",

    /* NEW FIELDS */
    author: "Dr. Whiskers Purrington",
    readTime: "6 min read",
    content: [
      "Welcoming a new kitten into your home is equal parts exciting and nerve-wracking. From litter-box training to the first vet visit, there’s a lot to tackle in the early weeks.",
      "Start by creating a safe zone: a small room with food, water, litter, and cozy bedding. Limiting space helps kittens learn where essentials are and prevents accidents.",
      "Socialization is your secret weapon. Handle your kitten gently every day, introduce new sounds (vacuum, doorbell), and reward curiosity with treats. This builds confidence and reduces future anxiety.",
      "Finally, book that first veterinary appointment within 72 hours of adoption. Your vet will check for parasites, begin vaccinations, and microchip your new friend for lifelong identification."
    ]
  },
  {
    /* ---------- Food ---------- */
    slug: "cat-nutrition",
    title: "Cat Nutrition Hacks",
    category: "Food",
    excerpt: "Top tips to keep your cat healthy and happy.",
    image: "/nutrition.png",
    date: "2024-06-29",

    /* NEW FIELDS */
    author: "Chef Mewsli",
    readTime: "5 min read",
    content: [
      "Cats are obligate carnivores, which means protein isn’t just a preference—it’s a requirement. The trick is balancing protein quality with essential micronutrients like taurine.",
      "Rotate flavors to prevent boredom, but do it gradually. Sudden switches upset digestion. A three-day mix-in schedule (25 % new, 75 % old → 50/50 → 75/25) works wonders.",
      "Consider adding a tablespoon of water to each meal. Extra moisture supports kidney health, especially for cats that ignore the water fountain.",
      "Finally, treats should be no more than 10 % of daily calories. Opt for freeze-dried single-ingredient options over carbohydrate-laden biscuits."
    ]
  },
  {
    /* ---------- Toys ---------- */
    slug: "cat-toys",
    title: "Best Interactive Cat Toys",
    category: "Toys",
    excerpt: "Engage your cat with these stimulating toy options.",
    image: "/toy.png",
    date: "2022-05-06",

    /* NEW FIELDS */
    author: "Luna the Play-Expert",
    readTime: "4 min read",
    content: [
      "Interactive toys turn a bored sofa-panther into an agile hunter. Look for motion-activated gadgets that mimic unpredictable prey movement.",
      "Wand toys are budget-friendly classics. Vary the speed and height to keep your cat guessing, then let them ‘win’ at the end to avoid frustration.",
      "Puzzle feeders accomplish two goals: mental enrichment and portion control. Start with low-difficulty models and level up as your cat masters each design.",
      "Rotate toys weekly. A simple storage bin labeled ‘toy library’ helps you remember what’s on deck, ensuring each play session feels fresh."
    ]
  },
  {
    /* ---------- Care ---------- */
    slug: "grooming-guide",
    title: "Seasonal Grooming Guide",
    category: "Care",
    excerpt: "Keep your cat looking their best year-round.",
    image: "/brush.png",
    date: "2023-12-01",

    /* NEW FIELDS */
    author: "Fur-mom Astoria",
    readTime: "7 min read",
    content: [
      "Spring shedding season means daily brushing. Use a slicker brush to remove the woolly undercoat before it blankets your sofa.",
      "Summer calls for paw checks: asphalt can reach blistering temps. A quick tactile test—back of your hand on the pavement for 5 seconds—tells you if it’s safe.",
      "Autumn is the ideal time to schedule a dental cleaning. Holiday treats are around the corner, and a clean mouth helps prevent tartar buildup.",
      "Winter humidity drops can cause static shocks. Lightly mist a grooming glove with water or a cat-safe conditioning spray to keep fur smooth."
    ]
  }
];


export const products = [
  /* ---------- FOOD ---------- */
  {
    id: "prod1",
    brand: "Iams",
    name: "Adult Dry Cat Food, 16‑lb bag, Unprocessed",
    category: "Food",
    price: 49.0,
    originalPrice: 55.99,
    rating: 4.5,
    ratingCount: 3800,
    badge: "Best Seller",
    isDeal: true,
    promo: "Spend $100, get <b>$30</b> eGift Card",
    image: "/iams.png",
    description:
      "Fuel your feline’s everyday adventures with Iams Adult Dry Cat Food. Crafted with real chicken as the #1 ingredient, this crunchy kibble delivers balanced protein to support strong muscles, while a custom fiber blend with prebiotics keeps digestion purring smoothly. Omega‑6 fatty acids nourish skin and coat, and every bite is free from artificial preservatives, flavors, or fillers—so your cat gets wholesome, unprocessed nutrition in every bowl.",
  },
  {
    id: "prod2",
    brand: "MeowMix",
    name: "Original Choice Dry Cat Food, 22‑lb bag",
    category: "Food",
    price: 14.0,
    originalPrice: 15.0,
    rating: 4.2,
    ratingCount: 112,
    badge: "New",
    isDeal: false,
    promo: "New Customers Only: Spend $49+, Get $20 eGift Card",
    image: "/meowmix.png",
    description:
      "The classic that cats ask for by name! MeowMix Original Choice combines four fun‑shaped kibbles packed with chicken, turkey, salmon, and ocean fish flavors cats crave. Fortified with essential vitamins, minerals, and antioxidants, this budget‑friendly favorite supports strong bones, healthy vision, and a shiny coat—perfect for multi‑cat households or anyone who wants great taste without breaking the bank.",
  },
  {
    id: "prod3",
    brand: "Orijen",
    name: "Original Grain‑Free Dry Cat Food, 4‑lb bag",
    category: "Food",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    ratingCount: 1200,
    badge: null,
    isDeal: false,
    promo: null,
    image: "/original.png",
    description:
      "Inspired by nature’s diet, Orijen Original is bursting with 90% premium animal ingredients—including free‑run chicken and turkey, wild‑caught fish, and cage‑free eggs—delivering a biologically appropriate balance of protein and nutrients. Every kibble is gently coated with freeze‑dried raw for an irresistible taste cats instinctively love, while its grain‑free recipe supports lean muscle development and a healthy skin‑and‑coat glow.",
  },
  {
    id: "prod4",
    brand: "American",
    name: "Duck Recipe Grain‑Free Dry Cat Food, 12‑lb",
    category: "Food",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.8,
    ratingCount: 900,
    badge: "Sale",
    isDeal: true,
    promo: "Free Shipping on this item",
    image: "/american.png",
    description:
      "Treat sensitive stomachs to a mouth‑watering single‑protein diet with American Duck Recipe. Deboned duck delivers rich, novel‑protein goodness, while sweet potatoes provide easily digestible energy without corn, wheat, or soy. Added taurine supports heart and eye health, and a boost of omega fatty acids keeps coats plush and glossy. Perfect for picky eaters or cats with food sensitivities.",
  },

  /* ---------- TOYS ---------- */
  {
    id: "prod5",
    brand: "Frisco",
    name: "Summer Parrot Interactive Chirping Flapping Electronic Plush Cat Toy with Silvervine & Catnip",
    category: "Toys",
    price: 14.99,
    originalPrice: 16.99,
    rating: 4.4,
    ratingCount: 540,
    badge: "Best Seller",
    isDeal: true,
    promo: "Buy 2, get 15% off",
    image: "/parrot.png",
    description:
      "Bring the tropics indoors with the Frisco Summer Parrot! Powered by motion sensors, this plush pal chirps and flaps its wings when your cat pounces, triggering those natural hunting instincts. Infused with premium silvervine and catnip for extra excitement, the soft, durable fabric stands up to enthusiastic play sessions, giving your feline friend hours of feathered fun.",
  },
  {
    id: "prod6",
    brand: "Frisco",
    name: "Interactive Flopping Fish Electronic Cat Toy with Catnip",
    category: "Toys",
    price: 9.99,
    originalPrice: 14.99,
    rating: 4.1,
    ratingCount: 880,
    badge: "Deal",
    isDeal: true,
    promo: "Spend $50, save $10",
    image: "/fish.png",
    description:
      "Hook, line, and sinker—your cat won’t resist this lifelike Flopping Fish! A built‑in motion sensor makes the fish wiggle and flop when touched, enticing playful swats. The rechargeable battery means less waste and more play, and the pouch of potent catnip tucked inside cranks up the excitement. Simply remove the motor for easy USB charging and machine‑wash the plush cover to keep things fresh.",
  },
  {
    id: "prod7",
    brand: "Yeow",
    name: "Fish in Ocean Wobble & Spin Cat Tracks Cat Toy with Catnip",
    category: "Toys",
    price: 10.99,
    originalPrice: 12.99,
    rating: 4.8,
    ratingCount: 4100,
    badge: "New",
    isDeal: false,
    promo: null,
    image: "/wobble.png",
    description:
      "Make waves of fun with Yeow’s Fish in Ocean Cat Tracks! Three tiers of spinning balls and a wobbly fish topper keep inquisitive paws busy, encouraging batting, chasing, and healthy exercise—even when you’re not home. Each level locks securely to prevent rogue balls from escaping, and a sprinkle of included catnip turns playtime into a sea‑riously engaging adventure.",
  },
  {
    id: "prod8",
    brand: "Yeow",
    name: "Step‑In Cat Scratcher Toy with Catnip, Tropical Paradise",
    category: "Toys",
    price: 12.49,
    originalPrice: 14.99,
    rating: 4.3,
    ratingCount: 1600,
    badge: null,
    isDeal: false,
    promo: null,
    image: "/scratcher.png",
    description:
      "Say aloha to better scratching! This Step‑In Cat Scratcher doubles as a comfy lounge, featuring thick, layered corrugated cardboard that satisfies the urge to scratch while protecting your furniture. A vibrant tropical print brightens any room, and the generous size lets cats curl up after a satisfying session. Bonus: a packet of organic catnip is included for extra island vibes.",
  },
  {
    id: "prod9",
    brand: "PetFusion",
    name: "Frisco Summer Felt Plush, Teaser & Ball Variety Pack Cat Toy with Silvervine & Catnip, 12 count",
    category: "Toys",
    price: 11.95,
    originalPrice: 12.95,
    rating: 4.7,
    ratingCount: 5200,
    badge: "Sale",
    isDeal: true,
    promo: "Free shipping on orders $49+",
    image: "/scratcher.png",
    description:
      "Keep boredom at bay with this 12‑piece Summer Variety Pack! From feathered teaser wands to crinkly felt plush and rolling balls, there’s a toy for every mood. Each piece is stuffed with silvervine and catnip to ramp up the fun, making it ideal for multi‑cat homes or kittens who crave constant stimulation.",
  },

  /* ---------- CARE ---------- */
  {
    id: "prod10",
    brand: "Catstages",
    name: "Indoor Purrfect Petals Washable Flower Shaped Bed",
    category: "Care",
    price: 24.99,
    originalPrice: 49.0,
    rating: 4.6,
    ratingCount: 2500,
    badge: "Best Seller",
    isDeal: true,
    promo: "Save $50 + free mat",
    image: "/bed.png",
    description:
      "Bloom into comfort with the Purrfect Petals Bed! Its plush, flower‑shaped design cradles cats in soft faux‑fur petals, while the skid‑resistant base keeps naps steady on hard floors. The entire bed is machine‑washable for effortless upkeep, and its cheerful aesthetic adds a pop of color to any room’s décor.",
  },
  {
    id: "prod11",
    brand: "PetSafe",
    name: "ScoopFree SmartSpin Self‑Cleaning Cat Litter Box",
    category: "Care",
    price: 322.99,
    originalPrice: 399.99,
    rating: 4.5,
    ratingCount: 3100,
    badge: null,
    isDeal: false,
    promo: null,
    image: "/litter.png",
    description:
      "Spend less time scooping and more time cuddling! The ScoopFree SmartSpin automatically rakes waste into a sealed compartment minutes after your cat leaves, locking away odors. Connect via WiFi to monitor litter levels and track bathroom habits in real time, and enjoy up to 30 days of hands‑free freshness with leak‑proof crystal litter trays.",
  },
  {
    id: "prod12",
    brand: "Kitty City",
    name: "Claw Sleeper 17.25‑in Faux Fleece Cat Tree, Green",
    category: "Care",
    price: 257.98,
    originalPrice: 164.98,
    rating: 4.4,
    ratingCount: 7200,
    badge: "Deal",
    isDeal: true,
    promo: "Buy 2, save $15",
    image: "/tree.png",
    description:
      "Reach new heights of relaxation with the Claw Sleeper Cat Tree. A cozy faux‑fleece perch crowns the sturdy sisal‑wrapped posts, encouraging healthy scratching while offering a 17‑inch‑high lookout perfect for window watching. Dangling pom‑pom toys add playful flair, and the compact footprint slips easily into small spaces.",
  },
  {
    id: "prod13",
    brand: "Petlibro",
    name: "Automatic WiFi Dry Food Dispenser, 4‑L w/ Camera",
    category: "Care",
    price: 239.99,
    originalPrice: 189.99,
    rating: 4.2,
    ratingCount: 1400,
    badge: "New",
    isDeal: false,
    promo: "Earn 2× reward points",
    image: "/feeder.png",
    description:
      "Dinnertime just went digital! Schedule up to ten meals a day from anywhere with the Petlibro Smart Feeder, and watch your cat dine through the built‑in 1080p HD camera and two‑way audio. The 4‑liter hopper keeps food fresh with a desiccant bag, and clog‑free technology ensures kibble flows smoothly, so your pet never misses a meal.",
  },
  {
    id: "prod14",
    brand: "FurHaven",
    name: "Stainless Steel Cat Fountain, 108‑oz",
    category: "Care",
    price: 45.99,
    originalPrice: 54.99,
    rating: 4.6,
    ratingCount: 1900,
    badge: "Sale",
    isDeal: true,
    promo: "Buy this, get 25% off feeder",
    image: "/water.png",
    description:
      "Encourage better hydration with FurHaven’s 108‑oz Stainless Steel Fountain. A quiet pump sends water cascading over a shallow‑flow dish loved by whisker‑sensitive cats, while a 3‑stage charcoal and foam filter removes hair, debris, and bad tastes. The durable stainless design is dishwasher safe for fuss‑free cleaning and resists bacteria buildup better than plastic bowls.",
  },
];
