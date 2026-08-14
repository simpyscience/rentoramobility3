import { getDestinationAssetPath } from '@/lib/data/images';

export interface City {
  slug: string;
  name: string;
  state: string;
  image: string;
}

export const CITIES: City[] = [
  { slug: 'delhi', name: 'Delhi', state: 'NCR', image: getDestinationAssetPath('delhi-jaipur') },
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', image: getDestinationAssetPath('mumbai-pune') },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', image: getDestinationAssetPath('bangalore-goa') },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', image: getDestinationAssetPath('delhi-jaipur') },
  { slug: 'udaipur', name: 'Udaipur', state: 'Rajasthan', image: getDestinationAssetPath('delhi-udaipur') },
  { slug: 'goa', name: 'Goa', state: 'Goa', image: getDestinationAssetPath('bangalore-goa') },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Punjab', image: getDestinationAssetPath('delhi-jaipur') },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', image: getDestinationAssetPath('delhi-agra') },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', image: getDestinationAssetPath('mumbai-pune') },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh', image: getDestinationAssetPath('delhi-agra') },
];

export const POPULAR_DESTINATIONS = [
  { slug: 'delhi-to-jaipur', from: 'Delhi', to: 'Jaipur', distance: '280 km', image: getDestinationAssetPath('delhi-jaipur'), description: 'The royal Pink City journey' },
  { slug: 'delhi-to-agra', from: 'Delhi', to: 'Agra', distance: '230 km', image: getDestinationAssetPath('delhi-agra'), description: 'Visit the iconic Taj Mahal' },
  { slug: 'mumbai-to-pune', from: 'Mumbai', to: 'Pune', distance: '150 km', image: getDestinationAssetPath('mumbai-pune'), description: 'Expressway weekend getaway' },
  { slug: 'bangalore-to-goa', from: 'Bangalore', to: 'Goa', distance: '560 km', image: getDestinationAssetPath('bangalore-goa'), description: 'Beach road trip adventure' },
  { slug: 'delhi-to-udaipur', from: 'Delhi', to: 'Udaipur', distance: '670 km', image: getDestinationAssetPath('delhi-udaipur'), description: 'City of Lakes retreat' },
  { slug: 'jaipur-to-udaipur', from: 'Jaipur', to: 'Udaipur', distance: '420 km', image: getDestinationAssetPath('jaipur-udaipur'), description: 'Rajasthan royal trail' },
];

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  car: string;
  date: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: 'Rentora made our family trip to Jaipur effortless. The Innova Crysta was spotless and the chauffeur was professional and punctual. Premium experience from start to finish.',
    car: 'Toyota Innova Crysta',
    date: 'August 2025',
    avatar: 'RK',
  },
  {
    id: 't2',
    name: 'Anita Desai',
    location: 'Mumbai',
    rating: 5,
    text: 'Booked the Mercedes E Class for a corporate event. Impeccable service, on-time pickup and a beautiful car. Rentora is now our go-to for all executive travel.',
    car: 'Mercedes E Class',
    date: 'July 2025',
    avatar: 'AD',
  },
  {
    id: 't3',
    name: 'Vikram Singh',
    location: 'Chandigarh',
    rating: 5,
    text: 'The BMW 5 Series for our wedding was a dream. The team understood exactly what we needed and delivered beyond expectations. Highly recommended for special occasions.',
    car: 'BMW 5 Series',
    date: 'July 2025',
    avatar: 'VS',
  },
  {
    id: 't4',
    name: 'Sneha Kapoor',
    location: 'Bangalore',
    rating: 5,
    text: 'Self-drive Honda City for a weekend in Goa. Smooth booking, transparent pricing and the car was in pristine condition. The voice assistant even helped me pick the right car!',
    car: 'Honda City',
    date: 'August 2025',
    avatar: 'SK',
  },
  {
    id: 't5',
    name: 'Arjun Reddy',
    location: 'Hyderabad',
    rating: 5,
    text: 'Fortuner for an outstation trip to the mountains. Powerful, comfortable and reliable. The pricing calculator made it easy to budget. Five stars to Rentora Mobility.',
    car: 'Toyota Fortuner',
    date: 'June 2025',
    avatar: 'AR',
  },
  {
    id: 't6',
    name: 'Karan Malhotra',
    location: 'Pune',
    rating: 5,
    text: 'The Innova Hycross is a beauty. Rented it for a corporate offsite and everyone was impressed. The booking process was seamless and the support team was very responsive.',
    car: 'Toyota Innova Hycross',
    date: 'August 2025',
    avatar: 'KM',
  },
];

export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: 'What documents do I need to rent a car?',
    a: 'For self-drive rentals, you need a valid driving licence (Indian or International), an Aadhaar card or passport for identity, and a credit/debit card for the security deposit. For chauffeur-driven rentals, only a government-issued ID is required.',
  },
  {
    q: 'Is there a minimum age requirement?',
    a: 'Yes, the minimum age for self-drive rentals is 21 years. For luxury and high-performance vehicles, the minimum age is 25 years with a valid driving licence held for at least 2 years.',
  },
  {
    q: 'What is the difference between Innova Crysta and Innova Hycross?',
    a: 'The Innova Crysta is a diesel-powered MPV known for its proven reliability and comfortable ride, ideal for long journeys. The Innova Hycross is the newer hybrid model with SUV-inspired styling, advanced safety features (ADAS), and better fuel efficiency. Both seat 7 passengers comfortably. The Hycross feels more premium and modern, while the Crysta is a tried-and-tested workhorse.',
  },
  {
    q: 'Do you provide airport pickup and drop?',
    a: 'Yes, we offer airport transfers across all major Indian airports. Our chauffeur will track your flight, wait for you at the arrivals gate with a name placard, and assist with luggage. Book in advance for a seamless experience.',
  },
  {
    q: 'Can I rent a car with a chauffeur?',
    a: 'Absolutely. Most of our fleet is available with professional, trained chauffeurs who are experienced, courteous and background-verified. Chauffeur-driven rentals include fuel for within-city use.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Free cancellation up to 24 hours before your pickup time. Cancellations within 24 hours incur a 25% fee. No-shows are charged at 50% of the booking amount. Refunds are processed within 5-7 business days.',
  },
  {
    q: 'Are there any hidden charges?',
    a: 'No hidden charges. Your quote includes the rental, insurance, and driver charges (for chauffeur-driven). Toll, parking, and interstate taxes are charged at actuals. GST is included in the displayed price.',
  },
  {
    q: 'Do you offer corporate rentals and monthly subscriptions?',
    a: 'Yes, we provide dedicated corporate rentals, monthly subscriptions, and long-term lease options for businesses. Contact us at rentoramobility@protonmail.com or +91 9958021329 / +91 7291973553 for custom corporate packages.',
  },
  {
    q: 'How do I pay for my booking?',
    a: 'You can pay online via UPI, credit/debit card, net banking, or popular wallets. A partial advance confirms your booking, with the balance payable at pickup. Corporate clients can opt for invoice-based billing.',
  },
  {
    q: 'What if the car breaks down during my trip?',
    a: 'In the rare event of a breakdown, our 24/7 roadside assistance team will arrange a replacement vehicle at no extra cost. Your journey is our priority and we ensure minimal disruption.',
  },
];

export interface ServicePage {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  startingPrice: number;
}

export const SERVICES: ServicePage[] = [
  {
    slug: 'airport-transfers',
    title: 'Airport Transfers',
    shortTitle: 'Airport Transfers',
    description: 'Seamless pickup and drop at all major Indian airports with flight tracking, meet-and-greet and luggage assistance.',
    icon: 'Plane',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['Flight tracking', 'Meet & greet service', 'Luggage assistance', '24/7 availability', 'Fixed transparent pricing', 'All major airports'],
    startingPrice: 1499,
  },
  {
    slug: 'corporate-rentals',
    title: 'Corporate Rentals',
    shortTitle: 'Corporate',
    description: 'Dedicated fleet for businesses with monthly subscriptions, executive transport and event logistics.',
    icon: 'Building2',
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['Monthly subscriptions', 'Dedicated account manager', 'Invoice billing', 'Executive sedans & SUVs', 'Bulk booking discounts', 'GST invoices'],
    startingPrice: 49999,
  },
  {
    slug: 'luxury-rentals',
    title: 'Luxury Rentals',
    shortTitle: 'Luxury',
    description: 'Chauffeur-driven BMW, Mercedes, Audi and more for special occasions, business and leisure.',
    icon: 'Crown',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['BMW, Mercedes, Audi', 'Professional chauffeurs', 'Premium interiors', 'Airport & event transport', 'Discreet & punctual', 'Custom packages'],
    startingPrice: 22000,
  },
  {
    slug: 'outstation-trips',
    title: 'Outstation Trips',
    shortTitle: 'Outstation',
    description: 'One-way and round-trip outstation travel across India with experienced drivers and comfortable vehicles.',
    icon: 'Map',
    image: 'https://images.pexels.com/photos/9462297/pexels-photo-9462297.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['One-way & round trips', 'Experienced highway drivers', 'All India tourist permit', 'Comfortable SUVs & MPVs', 'Transparent per-km pricing', 'Multi-city itineraries'],
    startingPrice: 11,
  },
  {
    slug: 'wedding-cars',
    title: 'Wedding Cars',
    shortTitle: 'Wedding',
    description: 'Make your special day unforgettable with decorated luxury and classic cars for weddings and baraat.',
    icon: 'Heart',
    image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['Decorated wedding cars', 'Luxury & vintage options', 'Chauffeur in formal attire', 'Baraat procession cars', 'Multi-day packages', 'Custom floral decoration'],
    startingPrice: 15000,
  },
  {
    slug: 'self-drive',
    title: 'Self Drive',
    shortTitle: 'Self Drive',
    description: 'Freedom to explore at your own pace with our well-maintained self-drive fleet across India.',
    icon: 'Car',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['Wide model range', 'Fully insured', 'Sanitised vehicles', 'Flexible daily/weekly pricing', 'Unlimited km options', 'Doorstep delivery'],
    startingPrice: 2200,
  },
];

export const COUPONS = [
  { code: 'FIRST10', discount: 10, label: '10% off your first booking', maxDiscount: 1000 },
  { code: 'RENTORA20', discount: 20, label: '20% off on luxury cars', maxDiscount: 5000 },
  { code: 'CORP15', discount: 15, label: '15% off corporate bookings', maxDiscount: 3000 },
  { code: 'WEEKEND5', discount: 5, label: '5% weekend special', maxDiscount: 500 },
];

export const TRUST_BADGES = [
  '100% Verified Cars',
  'Professional Chauffeurs',
  '24/7 Support',
  'Transparent Pricing',
  'Fully Insured',
  'PAN India Service',
];

export const WHY_CHOOSE_US = [
  { icon: 'ShieldCheck', title: 'Trusted & Verified', text: 'Every vehicle is inspected, sanitised and verified. Background-checked chauffeurs for your safety.' },
  { icon: 'Clock', title: '24/7 Availability', text: 'Round-the-clock support and roadside assistance. We are always there when you need us.' },
  { icon: 'IndianRupee', title: 'Transparent Pricing', text: 'No hidden charges. What you see is what you pay. GST included in every quote.' },
  { icon: 'MapPin', title: 'Pan India Coverage', text: 'Available across 120+ cities in India. From metro hubs to remote destinations.' },
  { icon: 'Car', title: 'Premium Fleet', text: 'From economical hatchbacks to luxury limousines — a car for every journey and budget.' },
  { icon: 'Headset', title: 'Voice AI Assistant', text: 'Our AI assistant helps you choose, book and plan — in English and Hindi, 24/7.' },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'innova-crysta-vs-hycross',
    title: 'Innova Crysta vs Hycross: Which One Should You Rent?',
    excerpt: 'A detailed comparison of the Toyota Innova Crysta and Innova Hycross to help you choose the right MPV for your journey.',
    date: '2025-08-10',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Car Guides',
    readTime: '6 min',
    content: 'The Toyota Innova has been the backbone of Indian family and group travel for nearly two decades. With the launch of the Innova Hycross alongside the trusted Crysta, renters now have a choice. The Crysta is a diesel-powered, proven workhorse with legendary reliability and ride comfort on long highway journeys. The Hycross is a strong hybrid with SUV-inspired styling, ADAS safety features, a panoramic sunroof and ventilated seats — it feels more premium and modern. For long outstation trips with heavy luggage, the Crysta remains an excellent choice. For city use, corporate travel and those who want the latest tech, the Hycross is the way to go. Both seat 7 comfortably and are available with professional chauffeurs from Rentora Mobility.',
  },
  {
    slug: 'best-road-trips-from-delhi',
    title: '7 Best Road Trips From Delhi in 2025',
    excerpt: 'Discover the most scenic and exciting road trips you can take from Delhi with the perfect rental car.',
    date: '2025-07-28',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/1558070/pexels-photo-1558070.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Travel',
    readTime: '8 min',
    content: 'Delhi is the perfect launchpad for incredible road trips. From the royal Pink City of Jaipur (280 km) to the Taj Mahal in Agra (230 km), the Himalayan foothills of Mussoorie and the spiritual city of Rishikesh — each route offers something unique. For mountain trips, an SUV like the Toyota Fortuner or Mahindra Scorpio N is ideal. For family trips to Rajasthan, the Innova Crysta or Hycross offers unmatched comfort. Always plan your stops, carry essentials, and book a reliable rental with an experienced highway driver for the best experience.',
  },
  {
    slug: 'corporate-car-rental-guide',
    title: 'The Complete Guide to Corporate Car Rentals in India',
    excerpt: 'Everything businesses need to know about corporate car rentals, subscriptions and executive transport.',
    date: '2025-07-15',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Corporate',
    readTime: '7 min',
    content: 'Corporate car rentals offer businesses flexibility without the overhead of owning a fleet. With monthly subscriptions, dedicated account managers, GST invoicing and a range of executive sedans and SUVs, companies can transport executives, clients and teams efficiently. Look for providers with verified chauffeurs, transparent billing and pan-India coverage. Rentora Mobility offers tailored corporate packages starting at competitive rates.',
  },
  {
    slug: 'luxury-wedding-cars',
    title: 'Choosing the Perfect Luxury Wedding Car',
    excerpt: 'Make your wedding day unforgettable with the right luxury car — from Mercedes to BMW and decorated classics.',
    date: '2025-06-30',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Weddings',
    readTime: '5 min',
    content: 'Your wedding day deserves a grand entrance. Luxury sedans like the Mercedes E Class and BMW 5 Series make a timeless statement, while the BMW 7 Series offers ultimate opulence. For the baraat, a decorated SUV like the Fortuner adds energy and presence. Always book in advance, request floral decoration, and ensure the chauffeur is in formal attire. Rentora Mobility offers curated wedding car packages across India.',
  },
  {
    slug: 'self-drive-tips-india',
    title: '10 Essential Self-Drive Tips for Indian Roads',
    excerpt: 'Stay safe and enjoy your self-drive rental with these essential tips for driving in India.',
    date: '2025-06-18',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/9462297/pexels-photo-9462297.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Guides',
    readTime: '6 min',
    content: 'Self-drive rentals give you freedom, but Indian roads require preparation. Always carry your licence and ID, obey speed limits, use seatbelts, avoid night driving on unfamiliar highways, and keep emergency contacts handy. Inspect the car before driving off, note existing damage, and understand the insurance coverage. With Rentora Mobility, every self-drive car is fully insured and well-maintained for your peace of mind.',
  },
  {
    slug: 'airport-transfer-benefits',
    title: 'Why Pre-Booking Airport Transfers is a Game-Changer',
    excerpt: 'Skip the taxi queues and travel stress-free with pre-booked airport transfers.',
    date: '2025-06-05',
    author: 'Rentora Editorial',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Travel',
    readTime: '4 min',
    content: 'Pre-booking an airport transfer eliminates the stress of finding a taxi after a long flight. Your chauffeur tracks your flight, waits at arrivals with a placard, assists with luggage and takes you directly to your destination in a clean, comfortable vehicle. With fixed transparent pricing, there are no surprises. Rentora Mobility offers airport transfers at all major Indian airports, 24/7.',
  },
];
