/**
 * Rentora Mobility — Blog content (pure, client-safe)
 *
 * Contains the article data, types and pure helpers only. No Node APIs
 * (fs/path) are imported here so this module is safe to import from client
 * components (e.g. the blog listing filter). Server-only image resolution
 * lives in ./blog.ts.
 */

export type BlogCategory = 'Car Rental Guide' | 'Travel Tips' | 'Employee Shuttle';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Car Rental Guide',
  'Travel Tips',
  'Employee Shuttle',
];

/** Logical category -> actual folder name under /public/images/blog */
export const BLOG_CATEGORY_FOLDERS: Record<BlogCategory, string> = {
  'Car Rental Guide': 'carrental-guide',
  'Travel Tips': 'travel- tips',
  'Employee Shuttle': 'employee-shuttle',
};

export const BLOG_AUTHOR = 'Rentora Mobility Editorial Team';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  author: string;
  featured?: boolean;
  content: BlogBlock[];
}

/**
 * Encode a public image path for use in an <img src>. Handles spaces,
 * parentheses and non-ASCII characters (é, –, emoji) safely.
 */
export function blogImageSrc(publicPath: string): string {
  return encodeURI(publicPath);
}

export const BLOG_POSTS: BlogPost[] = [
  /* ============================ CAR RENTAL GUIDE ============================ */
  {
    slug: 'how-to-choose-the-right-rental-car',
    title: 'How to Choose the Right Rental Car for Your Journey',
    category: 'Car Rental Guide',
    excerpt:
      'From family road trips to airport transfers, the right vehicle makes the journey comfortable and stress-free. Here is a practical way to decide.',
    heroImage: '/images/blog/carrental-guide/How To Start A Car Rental Business Guide And Tips.jfif',
    heroAlt: 'Rentora Mobility car rental planning and guide',
    publishedAt: '2025-09-10',
    readingTime: '7 min read',
    author: BLOG_AUTHOR,
    featured: true,
    content: [
      {
        type: 'p',
        text: 'Choosing a rental car is less about picking the newest model and more about matching the vehicle to your trip. A little planning before you book helps you avoid surprises at pickup and keeps the journey comfortable for everyone travelling with you.',
      },
      { type: 'h2', text: 'Start with the number of travellers' },
      {
        type: 'p',
        text: 'Count passengers and luggage before anything else. A compact hatchback is ideal for two people with light bags, while a sedan or SUV suits a small family. For larger groups, an MPV such as the Toyota Innova Crysta or Hycross seats seven with space for suitcases.',
      },
      {
        type: 'ul',
        items: [
          '1–2 travellers with cabin luggage: hatchback or compact sedan',
          'Small family (3–4): sedan or compact SUV',
          'Group of 5–7: MPV / Innova-class vehicle',
          'Lots of luggage: prefer a boot-friendly sedan or SUV over a small hatchback',
        ],
      },
      { type: 'h2', text: 'Match the vehicle to the journey type' },
      {
        type: 'p',
        text: 'City travel, airport transfers and weddings favour comfort and easy access. Long outstation drives reward a vehicle with highway stability and good fuel efficiency. If you are unsure, our team can recommend a model once we know your route and dates.',
      },
      {
        type: 'callout',
        title: 'A quick rule of thumb',
        text: 'When in doubt, choose slightly more space than you think you need. A comfortable cabin and room for bags makes every part of the trip easier.',
      },
      { type: 'h2', text: 'Self-drive or chauffeur-driven?' },
      {
        type: 'p',
        text: 'If you hold a valid driving licence and enjoy driving, self-drive gives flexibility. For airport runs, weddings or relaxed group travel, a professional chauffeur keeps everyone at ease. Both options are covered in our separate guide on chauffeur-driven versus self-drive rentals.',
      },
      {
        type: 'p',
        text: 'Once you have a shortlist, check availability for your dates and confirm the vehicle before payment. A clear booking is the simplest way to make sure the car you expect is the car you get.',
      },
    ],
  },
  {
    slug: 'what-to-check-before-booking-a-rental-car',
    title: 'What to Check Before Booking a Rental Car',
    category: 'Car Rental Guide',
    excerpt:
      'A few checks before you confirm a booking can save time and avoid confusion later. Use this practical pre-booking checklist.',
    heroImage:
      '/images/blog/carrental-guide/How to Start a Profitable Car Rental Business – Your Road to Success!.jfif',
    heroAlt: 'Car rental booking preparation and planning',
    publishedAt: '2025-10-05',
    readingTime: '6 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Most booking issues are easy to avoid with a short checklist. Before you pay, take a few minutes to confirm the details that matter for a smooth pickup and return.',
      },
      { type: 'h2', text: 'Confirm the essentials' },
      {
        type: 'ul',
        items: [
          'Pickup and drop-off locations and times are correct',
          'The selected vehicle matches your group size and luggage',
          'The total price includes what you expect (rental, applicable taxes, chauffeur where relevant)',
          'The booking reference and contact details are accurate',
        ],
      },
      { type: 'h2', text: 'Documents and requirements' },
      {
        type: 'p',
        text: 'For self-drive rentals, keep a valid driving licence and a government-issued ID ready. For chauffeur-driven trips, only an ID is needed for passengers. Confirming requirements in advance avoids delays at pickup.',
      },
      {
        type: 'callout',
        title: 'Read the policies first',
        text: 'Our Cancellation and Refund Policies explain charges by timing and how refunds are handled. A quick read before booking helps you plan with confidence.',
      },
      { type: 'h2', text: 'Plan the handover' },
      {
        type: 'p',
        text: 'Share your flight or train details for airport transfers so the chauffeur can track arrival. For self-drive, agree the pickup point and inspect the vehicle together at the start. A clear handover makes the return just as simple.',
      },
    ],
  },
  {
    slug: 'chauffeur-driven-vs-self-drive-rentals',
    title: 'Chauffeur-Driven vs Self-Drive Rentals',
    category: 'Car Rental Guide',
    excerpt:
      'Both ways to rent have their place. This guide compares self-drive and chauffeur-driven options so you can pick what suits your trip.',
    heroImage: '/images/blog/carrental-guide/Corporate Travel Agency - YYZ Travel Corporate.jpg',
    heroAlt: 'Corporate car rental and travel desk',
    publishedAt: '2025-11-12',
    updatedAt: '2026-01-20',
    readingTime: '8 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Rentora Mobility offers both self-drive and chauffeur-driven rentals. The right choice depends on who is travelling, the kind of trip, and how much you want to relax along the way.',
      },
      { type: 'h2', text: 'How they compare' },
      {
        type: 'table',
        headers: ['Aspect', 'Self-Drive', 'Chauffeur-Driven'],
        rows: [
          ['Who drives', 'You drive', 'A professional chauffeur drives'],
          ['Best for', 'Flexible plans, experienced drivers', 'Airport transfers, events, relaxed group travel'],
          ['Licence needed', 'Valid driving licence required', 'Not required for passengers'],
          ['Local knowledge', 'Your own planning', 'Experienced local drivers'],
          ['Ideal trips', 'Road trips, outstation travel', 'City commutes, corporate, weddings'],
        ],
      },
      { type: 'h2', text: 'When self-drive works best' },
      {
        type: 'p',
        text: 'If you enjoy driving and want full control of the schedule, self-drive is a great fit for outstation road trips and weekend getaways. You get a well-maintained vehicle and the freedom to stop where you like.',
      },
      { type: 'h2', text: 'When a chauffeur helps most' },
      {
        type: 'p',
        text: 'For airport pickups, weddings, corporate travel or when the group simply wants to relax, a trained chauffeur takes the stress out of driving and parking. It is also a calm option after a long flight.',
      },
      {
        type: 'callout',
        text: 'Still deciding? Tell us your route and group size and we will suggest the option that fits best.',
      },
    ],
  },

  /* ============================ TRAVEL TIPS ============================ */
  {
    slug: 'how-to-prepare-for-a-comfortable-road-trip',
    title: 'How to Prepare for a Comfortable Road Trip',
    category: 'Travel Tips',
    excerpt:
      'A comfortable road trip is mostly about preparation. Practical steps to plan your route, pack well and travel easy.',
    heroImage: '/images/blog/travel- tips/kedarnath.jpg',
    heroAlt: 'Scenic mountain road trip destination in India',
    publishedAt: '2025-08-22',
    readingTime: '7 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Road trips are memorable because of the journey, not just the destination. A bit of preparation keeps the drive comfortable for everyone in the car.',
      },
      { type: 'h2', text: 'Plan the route and stops' },
      {
        type: 'p',
        text: 'Mark your key stops before you leave — fuel, food, rest breaks and an overnight point if the drive is long. Sharing the plan with someone at home is a simple safety habit.',
      },
      {
        type: 'ul',
        items: [
          'Check road and weather conditions for your dates',
          'Plan a break every 2–3 hours of driving',
          'Keep emergency contacts and roadside assistance handy',
          'Share the live location with a family member for long drives',
        ],
      },
      { type: 'h2', text: 'Pack for comfort' },
      {
        type: 'p',
        text: 'Carry water, light snacks, a small first-aid kit, phone chargers and any medication. Layers of clothing help when temperatures change through the day, especially in hills.',
      },
      {
        type: 'callout',
        title: 'Before you drive off',
        text: 'A quick vehicle check — tyres, fuel, lights and documents — takes a few minutes and prevents most roadside surprises.',
      },
      { type: 'h2', text: 'Travel at a steady pace' },
      {
        type: 'p',
        text: 'A relaxed, steady pace is safer and more enjoyable than rushing. Build buffer time into the plan so delays do not become stress.',
      },
    ],
  },
  {
    slug: 'practical-tips-for-planning-a-long-distance-journey',
    title: 'Practical Tips for Planning a Long-Distance Journey',
    category: 'Travel Tips',
    excerpt:
      'Long-distance travel rewards good planning. Use these practical tips to organise a smooth multi-day journey.',
    heroImage:
      '/images/blog/travel- tips/Agra Travel Goals! Beautiful Places to Visit for First-Timers.jpg',
    heroAlt: 'Popular travel destination in India',
    publishedAt: '2025-09-30',
    readingTime: '6 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'A long-distance journey feels easier when the big decisions are made before you leave. Think about the route, the stops and what everyone needs along the way.',
      },
      { type: 'h2', text: 'Build a realistic day-by-day plan' },
      {
        type: 'p',
        text: 'Estimate driving hours honestly and avoid packing too much into one day. A calmer schedule means you actually enjoy the places you visit.',
      },
      {
        type: 'ol',
        items: [
          'Choose overnight halts near the places you want to see',
          'Book stays and transport in advance for peak seasons',
          'Keep one flexible day for rest or unplanned stops',
          'Note parking and vehicle rules at each stop',
        ],
      },
      { type: 'h2', text: 'Keep documents and money organised' },
      {
        type: 'p',
        text: 'Carry IDs, booking confirmations and a little cash for tolls and small stops. A single folder or phone note for confirmations saves time at every checkpoint.',
      },
      {
        type: 'callout',
        text: 'For chauffeur-driven long trips, share the plan with the driver in advance so pickup times and halts are agreed.',
      },
      { type: 'h2', text: 'Prepare for the unexpected' },
      {
        type: 'p',
        text: 'Weather, traffic and closures happen. A flexible plan and a charged phone keep small changes from becoming big problems.',
      },
    ],
  },
  {
    slug: 'travel-planning-tips-for-families-and-groups',
    title: 'Travel Planning Tips for Families and Groups',
    category: 'Travel Tips',
    excerpt:
      'Travelling with family or a group needs a little extra coordination. Simple tips to keep everyone comfortable and happy.',
    heroImage: '/images/blog/travel- tips/download (29).jpg',
    heroAlt: 'Travel and journey planning visual',
    publishedAt: '2025-12-15',
    readingTime: '6 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Group travel is more fun when the logistics are settled early. A shared plan helps everyone know what to expect and reduces last-minute confusion.',
      },
      { type: 'h2', text: 'Choose a vehicle that fits the group' },
      {
        type: 'p',
        text: 'Count seats and luggage carefully. An MPV or SUV keeps the group together and leaves room for bags, which matters more on multi-day trips than it does on a short drive.',
      },
      {
        type: 'ul',
        items: [
          'Agree the route and must-see stops together',
          'Assign one person to track bookings and timings',
          'Pack a small shared kit: water, wipes, snacks, charger',
          'Plan kid- and senior-friendly breaks on long drives',
        ],
      },
      { type: 'h2', text: 'Keep food and rest simple' },
      {
        type: 'p',
        text: 'Research a few reliable food stops in advance and keep flexibility for delays. Regular breaks make long drives easier for children and older travellers.',
      },
      {
        type: 'callout',
        title: 'One calm tip',
        text: 'A slightly earlier start often means lighter traffic and cooler roads — easier for everyone, especially in summer.',
      },
    ],
  },

  /* ============================ EMPLOYEE SHUTTLE ============================ */
  {
    slug: 'why-employee-shuttle-services-matter-for-businesses',
    title: 'Why Employee Shuttle Services Matter for Businesses',
    category: 'Employee Shuttle',
    excerpt:
      'Reliable employee transport supports punctuality, safety and daily wellbeing. A look at why businesses invest in shuttle services.',
    heroImage: '/images/blog/employee-shuttle/Corporate Transportation Excellence.jpg',
    heroAlt: 'Corporate transportation and employee shuttle',
    publishedAt: '2025-07-18',
    readingTime: '6 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Employee transportation is a quiet driver of productivity. A dependable shuttle removes the stress of daily commuting and helps teams start the day on time and in good shape.',
      },
      { type: 'h2', text: 'Punctuality and predictability' },
      {
        type: 'p',
        text: 'Fixed routes and schedules mean employees are not at the mercy of crowded public transport or unreliable cabs. Predictable arrivals help shifts, meetings and overall planning.',
      },
      {
        type: 'ul',
        items: [
          'Fewer late arrivals from commute delays',
          'A safer, tracked travel option for staff',
          'Less fatigue before the workday begins',
          'One vendor to manage instead of many ad-hoc rides',
        ],
      },
      { type: 'h2', text: 'Safety and accountability' },
      {
        type: 'p',
        text: 'A managed shuttle with verified drivers and tracked vehicles gives both employers and employees confidence about daily travel, especially for early or late shifts.',
      },
      {
        type: 'callout',
        text: 'For many businesses, a shuttle is less a perk and more a part of reliable operations.',
      },
    ],
  },
  {
    slug: 'planning-reliable-employee-transportation',
    title: 'Planning Reliable Employee Transportation',
    category: 'Employee Shuttle',
    excerpt:
      'Good shuttle planning comes down to routes, timing and the right vehicles. A practical framework for businesses.',
    heroImage: '/images/blog/employee-shuttle/Explore Black Car Now’s Full Luxury Fleet.jpg',
    heroAlt: 'Premium rental fleet for corporate transport',
    publishedAt: '2025-10-20',
    readingTime: '7 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'Reliable employee transport is designed, not improvised. A short planning exercise upfront prevents most daily issues.',
      },
      { type: 'h2', text: 'Map the real commute' },
      {
        type: 'p',
        text: 'Start from where employees actually live. Cluster pickup points along a few main corridors rather than chasing hundreds of unique addresses. This keeps rides efficient and on time.',
      },
      {
        type: 'ol',
        items: [
          'Collect home-location clusters from your team',
          'Define 2–4 main corridors with fixed stops',
          'Set departure windows that suit shift times',
          'Review routes monthly as the team changes',
        ],
      },
      { type: 'h2', text: 'Match vehicles to the route' },
      {
        type: 'p',
        text: 'Sedans suit small executive moves; larger MPVs and SUVs work for team shuttles. Comfortable, well-maintained vehicles matter more than appearance for daily use.',
      },
      {
        type: 'callout',
        title: 'Track and review',
        text: 'Simple tracking and a feedback channel let you fix a slow stop or a missed pickup quickly, before it becomes a pattern.',
      },
    ],
  },
  {
    slug: 'how-corporate-shuttle-services-improve-daily-commutes',
    title: 'How Corporate Shuttle Services Can Improve Daily Commutes',
    category: 'Employee Shuttle',
    excerpt:
      'Daily commutes shape how a team feels about work. Corporate shuttles can make that everyday journey calmer and more useful.',
    heroImage: '/images/blog/employee-shuttle/download (6)-images-19.jpg',
    heroAlt: 'Comfortable chauffeur-driven car for employee transport',
    publishedAt: '2025-11-25',
    readingTime: '6 min read',
    author: BLOG_AUTHOR,
    content: [
      {
        type: 'p',
        text: 'The daily commute is the part of work people rarely look forward to. A managed shuttle can turn that time into something steadier and less draining.',
      },
      { type: 'h2', text: 'Less stress, more routine' },
      {
        type: 'p',
        text: 'Knowing a vehicle will arrive on schedule removes a daily variable. Employees can read, rest or prepare for the day instead of negotiating traffic and bookings.',
      },
      {
        type: 'ul',
        items: [
          'A predictable start and end to the workday',
          'Reduced reliance on multiple transport apps',
          'A safer option for early and late shifts',
          'One billing relationship for finance to manage',
        ],
      },
      { type: 'h2', text: 'A better first impression for new hires' },
      {
        type: 'p',
        text: 'A organised transport option signals that a company plans for its people. It is a small detail that new employees notice in their first week.',
      },
      {
        type: 'callout',
        text: 'Start with one corridor, measure satisfaction, then expand routes as the programme proves its value.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Pure query helpers (no fs / Node APIs)                            */
/* ------------------------------------------------------------------ */

export function getBlogPostsRaw(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostRaw(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

/** Related articles: same category first, then other categories. Never returns the post itself. */
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = BLOG_POSTS.find((p) => p.slug === slug);
  if (!current) return BLOG_POSTS.slice(0, count);
  const sameCat = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === current.category);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...others].slice(0, count);
}

export function getFeaturedPostRaw(): BlogPost | null {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0] ?? null;
}
