import { getCarAssetPath, getCarGalleryImages } from '@/lib/data/images';

export type Category =
  | 'Hatchback'
  | 'Sedan'
  | 'SUV'
  | 'Luxury'
  | 'Electric'
  | 'Economy'
  | 'Premium'
  | 'Executive Vans';

export interface CarSpec {
  passengers: number;
  fuel: string;
  transmission: string;
  mileage: string;
  ac: boolean;
  luggageCapacity?: string;
}

export interface CarReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface Car {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  pricePerDay: number;
  pricePerHour?: number;
  image: string;
  gallery: string[];
  tagline: string;
  description: string;
  specs: CarSpec;
  features: string[];
  rating: number;
  reviewCount: number;
  availability: 'Available' | 'Limited' | 'On Request';
  chauffeurAvailable: boolean;
  selfDrive: boolean;
  reviews: CarReview[];
  popular?: boolean;
  city?: string;
  fuelType?: string;
  luggageCapacity?: string;
  locations?: string[];
}

function legacyCarImage(car: { slug: string; category: string }): string {
  return getCarAssetPath({ slug: car.slug, category: car.category as Category });
}

function legacyCarGallery(car: { slug: string; category: string }): string[] {
  return getCarGalleryImages({ slug: car.slug, category: car.category as Category });
}

const LEGACY_CARS: Car[] = [
  {
    slug: 'maruti-wagonr',
    name: 'Maruti WagonR',
    brand: 'Maruti',
    category: 'Economy',
    pricePerDay: 2200,
    image: legacyCarImage({ slug: 'maruti-wagonr', category: 'Economy' }),
    gallery: [legacyCarImage({ slug: 'maruti-wagonr', category: 'Economy' })],
    tagline: 'Spacious city commuter',
    description:
      'The Maruti WagonR is a practical and economical choice for city travel and short outstation trips, offering ample headroom and excellent fuel efficiency.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Manual', mileage: '24 kmpl', ac: true },
    features: ['Power Steering', 'Airbags', 'ABS', 'Music System', 'USB Charging', 'Spacious Boot'],
    rating: 4.4,
    reviewCount: 86,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [
      { id: 'r1', author: 'Amit Sharma', rating: 5, date: '2025-07-12', text: 'Perfect for city use. Very economical and clean.', verified: true },
      { id: 'r2', author: 'Priya Nair', rating: 4, date: '2025-06-30', text: 'Comfortable for short trips. Good mileage.', verified: true },
    ],
  },
  {
    slug: 'maruti-swift',
    name: 'Maruti Swift',
    brand: 'Maruti',
    category: 'Economy',
    pricePerDay: 2600,
    image: legacyCarImage({ slug: 'maruti-swift', category: 'Economy' }),
    gallery: [legacyCarImage({ slug: 'maruti-swift', category: 'Economy' })],
    tagline: 'Stylish and peppy hatchback',
    description:
      'The Maruti Swift blends sporty styling with fuel efficiency, making it ideal for city drives and weekend getaways.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Manual', mileage: '22 kmpl', ac: true },
    features: ['Power Steering', 'Touchscreen', 'Airbags', 'ABS', 'Reverse Camera', 'Steering Controls'],
    rating: 4.5,
    reviewCount: 124,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [
      { id: 'r1', author: 'Rohit Verma', rating: 5, date: '2025-07-18', text: 'Fun to drive and great on fuel. Loved it.', verified: true },
    ],
  },
  {
    slug: 'maruti-dzire',
    name: 'Maruti Dzire',
    brand: 'Maruti',
    category: 'Economy',
    pricePerDay: 2800,
    image: legacyCarImage({ slug: 'maruti-dzire', category: 'Economy' }),
    gallery: [legacyCarImage({ slug: 'maruti-dzire', category: 'Economy' })],
    tagline: 'Compact sedan with comfort',
    description:
      'The Maruti Dzire is a popular compact sedan offering great comfort, boot space and fuel economy for families.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Manual', mileage: '23 kmpl', ac: true },
    features: ['Power Steering', 'Touchscreen', 'Airbags', 'ABS', 'Reverse Camera', 'Automatic AC'],
    rating: 4.5,
    reviewCount: 152,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Sneha Kapoor', rating: 5, date: '2025-08-01', text: 'Best sedan in this budget. Very comfortable ride.', verified: true },
    ],
  },
  {
    slug: 'hyundai-aura',
    name: 'Hyundai Aura',
    brand: 'Hyundai',
    category: 'Economy',
    pricePerDay: 2900,
    image: legacyCarImage({ slug: 'hyundai-aura', category: 'Economy' }),
    gallery: [legacyCarImage({ slug: 'hyundai-aura', category: 'Economy' })],
    tagline: 'Refined compact sedan',
    description:
      'Hyundai Aura offers a premium cabin feel with refined engines, making it a great value sedan for daily and outstation use.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Manual', mileage: '22 kmpl', ac: true },
    features: ['Power Steering', 'Touchscreen Infotainment', 'Airbags', 'ABS', 'Wireless Charging', 'Reverse Camera'],
    rating: 4.4,
    reviewCount: 98,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'honda-amaze',
    name: 'Honda Amaze',
    brand: 'Honda',
    category: 'Economy',
    pricePerDay: 3000,
    image: legacyCarImage({ slug: 'honda-amaze', category: 'Economy' }),
    gallery: [legacyCarImage({ slug: 'honda-amaze', category: 'Economy' })],
    tagline: 'Reliable family sedan',
    description:
      'The Honda Amaze delivers reliability, a spacious cabin and smooth performance — a trusted choice for families.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '19 kmpl', ac: true },
    features: ['Power Steering', 'Automatic Transmission', 'Airbags', 'ABS', 'Touchscreen', 'Cruise Control'],
    rating: 4.5,
    reviewCount: 76,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'honda-city',
    name: 'Honda City',
    brand: 'Honda',
    category: 'Premium',
    pricePerDay: 5200,
    image: legacyCarImage({ slug: 'honda-city', category: 'Premium' }),
    gallery: [legacyCarImage({ slug: 'honda-city', category: 'Premium' })],
    tagline: 'Iconic premium sedan',
    description:
      'The Honda City is an iconic premium sedan known for its refined engine, spacious interior and elegant design.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '18 kmpl', ac: true },
    features: ['Sunroof', 'Leather Seats', 'Touchscreen', 'Automatic Climate Control', 'Cruise Control', 'Airbags', 'ABS'],
    rating: 4.7,
    reviewCount: 210,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Vikram Singh', rating: 5, date: '2025-07-22', text: 'Classy and comfortable. Perfect for corporate travel.', verified: true },
    ],
  },
  {
    slug: 'toyota-hyryder',
    name: 'Toyota Hyryder',
    brand: 'Toyota',
    category: 'Premium',
    pricePerDay: 5800,
    image: legacyCarImage({ slug: 'toyota-hyryder', category: 'Premium' }),
    gallery: [legacyCarImage({ slug: 'toyota-hyryder', category: 'Premium' })],
    tagline: 'Hybrid mid-size SUV',
    description:
      'The Toyota Hyryder is a stylish hybrid SUV offering excellent fuel efficiency and a commanding driving position.',
    specs: { passengers: 5, fuel: 'Hybrid', transmission: 'Automatic', mileage: '27 kmpl', ac: true },
    features: ['Hybrid Engine', 'Sunroof', 'Panoramic Roof', '360 Camera', 'Touchscreen', 'Wireless Charging', 'Airbags', 'ABS'],
    rating: 4.6,
    reviewCount: 64,
    availability: 'Limited',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'maruti-invicto',
    name: 'Maruti Invicto',
    brand: 'Maruti',
    category: 'Premium',
    pricePerDay: 6200,
    image: legacyCarImage({ slug: 'maruti-invicto', category: 'Premium' }),
    gallery: [legacyCarImage({ slug: 'maruti-invicto', category: 'Premium' })],
    tagline: 'Premium 7-seater MPV',
    description:
      'The Maruti Invicto is a premium MPV combining strong hybrid efficiency with three-row seating and luxury finishes.',
    specs: { passengers: 7, fuel: 'Hybrid', transmission: 'Automatic', mileage: '23 kmpl', ac: true },
    features: ['Hybrid Engine', 'Captain Seats', 'Sunroof', 'Touchscreen', 'Automatic Climate Control', 'Airbags', 'ABS'],
    rating: 4.6,
    reviewCount: 41,
    availability: 'Limited',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
  {
    slug: 'toyota-innova-crysta',
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    category: 'SUV',
    pricePerDay: 4500,
    image: legacyCarImage({ slug: 'toyota-innova-crysta', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'toyota-innova-crysta', category: 'SUV' })],
    tagline: 'India\'s favourite MPV',
    description:
      'The Toyota Innova Crysta is the gold standard for family and group travel in India — renowned for comfort, reliability and ride quality on long journeys.',
    specs: { passengers: 7, fuel: 'Diesel', transmission: 'Automatic', mileage: '13 kmpl', ac: true },
    features: ['Captain Seats', 'Automatic Climate Control', 'Touchscreen', 'Reverse Camera', 'Cruise Control', 'Airbags', 'ABS', 'Premium Upholstery'],
    rating: 4.8,
    reviewCount: 540,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Rajesh Kumar', rating: 5, date: '2025-08-02', text: 'Best vehicle for family trips. Extremely comfortable and reliable.', verified: true },
      { id: 'r2', author: 'Anita Desai', rating: 5, date: '2025-07-25', text: 'Travelled Delhi to Jaipur. Smooth ride, great chauffeur.', verified: true },
    ],
  },
  {
    slug: 'toyota-innova-hycross',
    name: 'Toyota Innova Hycross',
    brand: 'Toyota',
    category: 'SUV',
    pricePerDay: 5500,
    image: legacyCarImage({ slug: 'toyota-innova-hycross', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'toyota-innova-hycross', category: 'SUV' })],
    tagline: 'Next-gen hybrid MPV',
    description:
      'The Toyota Innova Hycross is the modern successor to the Crysta — a strong hybrid MPV with SUV styling, advanced safety and premium interiors.',
    specs: { passengers: 7, fuel: 'Hybrid', transmission: 'Automatic', mileage: '16 kmpl', ac: true },
    features: ['Hybrid Engine', 'Captain Seats', 'Panoramic Sunroof', '360 Camera', 'Ventilated Seats', 'ADAS Safety', 'Touchscreen', 'Airbags', 'ABS'],
    rating: 4.8,
    reviewCount: 312,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: false,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Karan Malhotra', rating: 5, date: '2025-08-03', text: 'The Hycross is gorgeous. Feels like a luxury car. Worth every rupee.', verified: true },
    ],
  },
  {
    slug: 'toyota-fortuner',
    name: 'Toyota Fortuner',
    brand: 'Toyota',
    category: 'SUV',
    pricePerDay: 9500,
    image: legacyCarImage({ slug: 'toyota-fortuner', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'toyota-fortuner', category: 'SUV' })],
    tagline: 'Dominant full-size SUV',
    description:
      'The Toyota Fortuner is a powerful and commanding SUV, perfect for those who want presence, performance and capability both on and off road.',
    specs: { passengers: 7, fuel: 'Diesel', transmission: 'Automatic', mileage: '10 kmpl', ac: true },
    features: ['4WD', 'Leather Seats', 'Power Adjustable Driver Seat', 'Touchscreen', '360 Camera', 'Cruise Control', 'Airbags', 'ABS', 'Hill Assist'],
    rating: 4.8,
    reviewCount: 280,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Arjun Reddy', rating: 5, date: '2025-07-28', text: 'Beast of an SUV. Great for highway and mountain trips.', verified: true },
    ],
  },
  {
    slug: 'mahindra-xuv700',
    name: 'Mahindra XUV700',
    brand: 'Mahindra',
    category: 'SUV',
    pricePerDay: 6500,
    image: legacyCarImage({ slug: 'mahindra-xuv700', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'mahindra-xuv700', category: 'SUV' })],
    tagline: 'Tech-loaded flagship SUV',
    description:
      'The Mahindra XUV700 is a feature-packed SUV with ADAS safety tech, a powerful engine and a premium cabin experience.',
    specs: { passengers: 7, fuel: 'Diesel', transmission: 'Automatic', mileage: '15 kmpl', ac: true },
    features: ['ADAS Safety', 'Dual 10.25" Screens', 'Sunroof', 'Leather Seats', '360 Camera', 'Adaptive Cruise', 'Airbags', 'ABS'],
    rating: 4.7,
    reviewCount: 134,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'mahindra-scorpio-n',
    name: 'Mahindra Scorpio N',
    brand: 'Mahindra',
    category: 'SUV',
    pricePerDay: 5500,
    image: legacyCarImage({ slug: 'mahindra-scorpio-n', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'mahindra-scorpio-n', category: 'SUV' })],
    tagline: 'Rugged and capable SUV',
    description:
      'The Mahindra Scorpio N is a rugged yet refined SUV built for adventure, with strong road presence and capable performance.',
    specs: { passengers: 7, fuel: 'Diesel', transmission: 'Manual', mileage: '16 kmpl', ac: true },
    features: ['4WD Option', 'Sunroof', 'Touchscreen', 'Cruise Control', 'Airbags', 'ABS', 'Hill Descent Control'],
    rating: 4.6,
    reviewCount: 118,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'tata-safari',
    name: 'Tata Safari',
    brand: 'Tata',
    category: 'SUV',
    pricePerDay: 5800,
    image: legacyCarImage({ slug: 'tata-safari', category: 'SUV' }),
    gallery: [legacyCarImage({ slug: 'tata-safari', category: 'SUV' })],
    tagline: 'Bold 7-seater SUV',
    description:
      'The Tata Safari is a spacious and bold SUV with a 5-star safety rating, premium interiors and commanding road presence.',
    specs: { passengers: 7, fuel: 'Diesel', transmission: 'Automatic', mileage: '15 kmpl', ac: true },
    features: ['5-Star Safety', 'Sunroof', 'Captain Seats', 'Touchscreen', '360 Camera', 'Air Purifier', 'Airbags', 'ABS'],
    rating: 4.6,
    reviewCount: 92,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: true,
    reviews: [],
  },
  {
    slug: 'bmw-5-series',
    name: 'BMW 5 Series',
    brand: 'BMW',
    category: 'Luxury',
    pricePerDay: 22000,
    image: legacyCarImage({ slug: 'bmw-5-series', category: 'Luxury' }),
    gallery: [legacyCarImage({ slug: 'bmw-5-series', category: 'Luxury' })],
    tagline: 'The benchmark luxury sedan',
    description:
      'The BMW 5 Series is the ultimate executive sedan — combining dynamic performance, cutting-edge technology and understated luxury.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '13 kmpl', ac: true },
    features: ['Nappa Leather', 'Harman Kardon Audio', 'Panoramic Sunroof', 'Digital Cockpit', 'Wireless Charging', 'Adaptive LED', 'Airbags', 'ABS'],
    rating: 4.9,
    reviewCount: 76,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    popular: true,
    reviews: [
      { id: 'r1', author: 'Aditya Birla Group', rating: 5, date: '2025-07-15', text: 'Exquisite car for executive travel. Impeccable service.', verified: true },
    ],
  },
  {
    slug: 'mercedes-e-class',
    name: 'Mercedes E Class',
    brand: 'Mercedes',
    category: 'Luxury',
    pricePerDay: 24000,
    image: legacyCarImage({ slug: 'mercedes-e-class', category: 'Luxury' }),
    gallery: [legacyCarImage({ slug: 'mercedes-e-class', category: 'Luxury' })],
    tagline: 'Icon of luxury',
    description:
      'The Mercedes E Class is the epitome of luxury sedans, offering unmatched comfort, refined performance and timeless elegance.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '12 kmpl', ac: true },
    features: ['Burmester Audio', 'MBUX Infotainment', 'Panoramic Sunroof', 'Ambient Lighting', 'Wireless Charging', 'Active Safety', 'Airbags', 'ABS'],
    rating: 4.9,
    reviewCount: 68,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    popular: true,
    reviews: [],
  },
  {
    slug: 'audi-a6',
    name: 'Audi A6',
    brand: 'Audi',
    category: 'Luxury',
    pricePerDay: 23000,
    image: legacyCarImage({ slug: 'audi-a6', category: 'Luxury' }),
    gallery: [legacyCarImage({ slug: 'audi-a6', category: 'Luxury' })],
    tagline: 'Progressive luxury sedan',
    description:
      'The Audi A6 blends progressive design with sophisticated technology, delivering a refined and engaging luxury experience.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '14 kmpl', ac: true },
    features: ['Virtual Cockpit', 'Bang & Olufsen Audio', 'Matrix LED', 'Panoramic Sunroof', 'Ambient Lighting', 'Airbags', 'ABS'],
    rating: 4.8,
    reviewCount: 54,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
  {
    slug: 'bmw-7-series',
    name: 'BMW 7 Series',
    brand: 'BMW',
    category: 'Luxury',
    pricePerDay: 45000,
    image: legacyCarImage({ slug: 'bmw-7-series', category: 'Luxury' }),
    gallery: [legacyCarImage({ slug: 'bmw-7-series', category: 'Luxury' })],
    tagline: 'Flagship luxury limousine',
    description:
      'The BMW 7 Series is the pinnacle of luxury — a flagship limousine with executive rear seating, theatre screen and sublime comfort.',
    specs: { passengers: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: '10 kmpl', ac: true },
    features: ['Executive Lounge Seats', 'Theatre Screen', 'Bowers & Wilkins Audio', 'Champagne Cooler', 'Executive Lounge', 'Air Suspension', 'Airbags', 'ABS'],
    rating: 5.0,
    reviewCount: 32,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
  {
    slug: 'mercedes-gls',
    name: 'Mercedes GLS',
    brand: 'Mercedes',
    category: 'Luxury',
    pricePerDay: 48000,
    image: legacyCarImage({ slug: 'mercedes-gls', category: 'Luxury' }),
    gallery: [legacyCarImage({ slug: 'mercedes-gls', category: 'Luxury' })],
    tagline: 'The S-Class of SUVs',
    description:
      'The Mercedes GLS is a full-size luxury SUV offering three-row seating, first-class comfort and commanding presence.',
    specs: { passengers: 7, fuel: 'Petrol', transmission: 'Automatic', mileage: '9 kmpl', ac: true },
    features: ['Third Row Captain Seats', 'Burmester 3D Audio', 'MBUX', 'Air Suspension', 'Massaging Seats', 'Panoramic Roof', 'Airbags', 'ABS'],
    rating: 5.0,
    reviewCount: 28,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
  {
    slug: 'toyota-vellfire',
    name: 'Toyota Vellfire',
    brand: 'Toyota',
    category: 'Executive Vans',
    pricePerDay: 35000,
    image: legacyCarImage({ slug: 'toyota-vellfire', category: 'Executive Vans' }),
    gallery: [legacyCarImage({ slug: 'toyota-vellfire', category: 'Executive Vans' })],
    tagline: 'Ultra-luxury executive van',
    description:
      'The Toyota Vellfire is the ultimate luxury MPV with first-class captain seats, Ottoman leg rests and a serene, private cabin experience.',
    specs: { passengers: 7, fuel: 'Hybrid', transmission: 'Automatic', mileage: '16 kmpl', ac: true },
    features: ['Ottoman Captain Seats', 'Reclining Seats', 'Privacy Glass', 'JBL Audio', 'Ambient Lighting', 'Sunroof', 'Touchscreen', 'Airbags', 'ABS'],
    rating: 4.9,
    reviewCount: 45,
    availability: 'On Request',
    chauffeurAvailable: true,
    selfDrive: false,
    popular: true,
    reviews: [],
  },
  {
    slug: 'force-urbania',
    name: 'Force Urbania',
    brand: 'Force',
    category: 'Executive Vans',
    pricePerDay: 12000,
    image: legacyCarImage({ slug: 'force-urbania', category: 'Executive Vans' }),
    gallery: [legacyCarImage({ slug: 'force-urbania', category: 'Executive Vans' })],
    tagline: 'Modern luxury van',
    description:
      'The Force Urbania is a modern, spacious luxury van ideal for group travel, corporate teams and family tours with premium seating.',
    specs: { passengers: 12, fuel: 'Diesel', transmission: 'Manual', mileage: '11 kmpl', ac: true },
    features: ['Pushback Seats', 'Ambient Lighting', 'USB Charging', 'Music System', 'Large Windows', 'Airbags', 'ABS'],
    rating: 4.5,
    reviewCount: 38,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
  {
    slug: 'toyota-commuter',
    name: 'Toyota Commuter',
    brand: 'Toyota',
    category: 'Executive Vans',
    pricePerDay: 10000,
    image: legacyCarImage({ slug: 'toyota-commuter', category: 'Executive Vans' }),
    gallery: [legacyCarImage({ slug: 'toyota-commuter', category: 'Executive Vans' })],
    tagline: 'Reliable group transport',
    description:
      'The Toyota Commuter is a trusted and comfortable van for large groups, corporate shuttles and outstation tours.',
    specs: { passengers: 12, fuel: 'Diesel', transmission: 'Manual', mileage: '12 kmpl', ac: true },
    features: ['Pushback Seats', 'AC', 'Music System', 'USB Charging', 'Spacious Cabin', 'Airbags', 'ABS'],
    rating: 4.4,
    reviewCount: 52,
    availability: 'Available',
    chauffeurAvailable: true,
    selfDrive: false,
    reviews: [],
  },
];

const INVENTORY_IMAGES = [
  '/images/cars/economy.svg',
  '/images/cars/sedan.svg',
  '/images/cars/suv.svg',
  '/images/cars/premium.svg',
  '/images/cars/luxury.svg',
  '/images/cars/electric.svg',
  '/images/cars/van.svg',
  '/images/cars/sedan.svg',
  '/images/cars/luxury.svg',
  '/images/cars/premium.svg',
];

const CITY_VARIANTS = [
  { city: 'Delhi', multiplier: 1.02 },
  { city: 'Mumbai', multiplier: 1.08 },
  { city: 'Bengaluru', multiplier: 1.05 },
  { city: 'Hyderabad', multiplier: 1.03 },
  { city: 'Chennai', multiplier: 1.04 },
  { city: 'Pune', multiplier: 1.01 },
  { city: 'Jaipur', multiplier: 0.98 },
  { city: 'Kolkata', multiplier: 1 },
  { city: 'Ahmedabad', multiplier: 0.99 },
  { city: 'Kochi', multiplier: 1.01 },
];

const INVENTORY_TEMPLATES = [
  {
    brand: 'Maruti', name: 'Swift', category: 'Hatchback' as Category, basePrice: 1800, seats: 5, fuel: 'Petrol', transmission: 'Manual', luggage: '1 large bag', features: ['ABS', 'Airbags', 'Touchscreen', 'Power Steering'], tagline: 'Compact city hatchback with strong mileage', description: 'Ideal for daily commutes and quick city errands with easy parking and efficient fuel economy.' },
  {
    brand: 'Tata', name: 'Tiago', category: 'Hatchback' as Category, basePrice: 1700, seats: 5, fuel: 'Petrol', transmission: 'Manual', luggage: '1 large bag', features: ['ABS', 'Music System', 'USB Charging', 'Air Conditioning'], tagline: 'Practical and stylish for urban travel', description: 'A confident city car with comfortable interiors and smart ergonomics for everyday mobility.' },
  {
    brand: 'Hyundai', name: 'Grand i10', category: 'Hatchback' as Category, basePrice: 1900, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '1 large bag', features: ['Rear Camera', 'Auto AC', 'Touchscreen', 'Steering Controls'], tagline: 'Premium hatchback feel with effortless comfort', description: 'Perfect for urban luxury on a budget with refined cabin quality and compact dimensions.' },
  {
    brand: 'Renault', name: 'Kwid', category: 'Hatchback' as Category, basePrice: 1600, seats: 5, fuel: 'Petrol', transmission: 'Manual', luggage: '1 medium bag', features: ['Easy Parking', 'Airbags', 'Power Steering', 'USB Charging'], tagline: 'Sharp design with excellent value', description: 'A convenient choice for short city runs and low-cost daily mobility.' },
  {
    brand: 'Maruti', name: 'Dzire', category: 'Sedan' as Category, basePrice: 2200, seats: 5, fuel: 'Petrol', transmission: 'Manual', luggage: '2 medium bags', features: ['Auto AC', 'Touchscreen', 'Rear Camera', 'Cruise Control'], tagline: 'Comfort-first sedan for daily and business travel', description: 'A sleek sedan that balances comfort, reliability and efficient performance for city and highway use.' },
  {
    brand: 'Honda', name: 'Amaze', category: 'Sedan' as Category, basePrice: 2400, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 medium bags', features: ['Leather Seats', 'Touchscreen', 'ABS', 'Airbags'], tagline: 'Reliable executive sedan for professionals', description: 'Elegant, spacious and dependable for airport runs, meetings and weekend trips.' },
  {
    brand: 'Hyundai', name: 'Verna', category: 'Sedan' as Category, basePrice: 2600, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 large bags', features: ['Sunroof', 'Digital Cluster', 'Rear Camera', 'Auto AC'], tagline: 'Premium sedan with a polished cabin', description: 'A refined option for corporate travel, airport transfers and stylish city cruising.' },
  {
    brand: 'Honda', name: 'City', category: 'Sedan' as Category, basePrice: 2800, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 large bags', features: ['Sunroof', 'Bluetooth', 'Airbags', 'Camera'], tagline: 'One of India’s most loved executive sedans', description: 'Comfortable, premium and polished for business travel and leisure rides alike.' },
  {
    brand: 'Hyundai', name: 'Creta', category: 'SUV' as Category, basePrice: 3200, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 large bags', features: ['Sunroof', '360 Camera', 'Cruise Control', 'Ventilated Seats'], tagline: 'Feature-packed SUV for family comfort', description: 'A versatile SUV that offers a premium ride quality and strong road presence.' },
  {
    brand: 'Kia', name: 'Seltos', category: 'SUV' as Category, basePrice: 3400, seats: 5, fuel: 'Diesel', transmission: 'Automatic', luggage: '2 large bags', features: ['ADAS', 'Panoramic Roof', 'Wireless Charging', '360 Camera'], tagline: 'Modern SUV with a premium cabin', description: 'Built for long drives, airport transfers and weekend family outings with confidence.' },
  {
    brand: 'Mahindra', name: 'Scorpio N', category: 'SUV' as Category, basePrice: 3600, seats: 7, fuel: 'Diesel', transmission: 'Manual', luggage: '3 large bags', features: ['4WD', 'Hill Assist', 'Touchscreen', 'Airbags'], tagline: 'Rugged and commanding for highway travel', description: 'A powerful SUV for outstation trips, family holidays and rougher terrains.' },
  {
    brand: 'Toyota', name: 'Innova Crysta', category: 'SUV' as Category, basePrice: 4500, seats: 7, fuel: 'Diesel', transmission: 'Automatic', luggage: '3 large bags', features: ['Captain Seats', 'Rear AC', 'Camera', 'Premium Upholstery'], tagline: 'India’s trusted family MPV', description: 'Excellent for group journeys, airport pickups and long-distance premium travel.' },
  {
    brand: 'Toyota', name: 'Fortuner', category: 'SUV' as Category, basePrice: 5200, seats: 7, fuel: 'Diesel', transmission: 'Automatic', luggage: '3 large bags', features: ['4WD', 'Leather Seats', 'Cruise Control', 'Terrain Modes'], tagline: 'Commanding SUV with luxury-grade comfort', description: 'The preferred choice for premium road trips, executive travel and mountain escapes.' },
  {
    brand: 'Mercedes', name: 'C-Class', category: 'Luxury' as Category, basePrice: 18000, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 medium bags', features: ['Ambient Lighting', 'Burmester Audio', 'Massage Seats', 'Panoramic Roof'], tagline: 'Executive luxury in understated style', description: 'A refined chauffeur-driven luxury sedan for high-end airport and corporate travel.' },
  {
    brand: 'BMW', name: '3 Series', category: 'Luxury' as Category, basePrice: 19000, seats: 5, fuel: 'Petrol', transmission: 'Automatic', luggage: '2 medium bags', features: ['Adaptive LED', 'Leather Interior', '360 Camera', 'Wireless Charging'], tagline: 'Sporty luxury with dynamic performance', description: 'For guests who expect a premium, elegant and performance-oriented executive ride.' },
  {
    brand: 'Mercedes', name: 'E-Class', category: 'Luxury' as Category, basePrice: 22000, seats: 5, fuel: 'Diesel', transmission: 'Automatic', luggage: '2 large bags', features: ['Massage Seats', 'MBUX', 'Ambient Lighting', 'Rear Comfort'], tagline: 'Flagship comfort for the modern executive', description: 'A benchmark in premium chauffeured comfort for business and special occasions.' },
  {
    brand: 'Tata', name: 'Tiago EV', category: 'Electric' as Category, basePrice: 2300, seats: 5, fuel: 'Electric', transmission: 'Automatic', luggage: '1 medium bag', features: ['Fast Charging', 'Connected Car', 'Rear Camera', 'Regenerative Braking'], tagline: 'Clean and cost-effective electric mobility', description: 'A smart EV for city use with zero-emission travel and low running costs.' },
  {
    brand: 'Tata', name: 'Nexon EV', category: 'Electric' as Category, basePrice: 2800, seats: 5, fuel: 'Electric', transmission: 'Automatic', luggage: '2 large bags', features: ['Fast Charging', '360 Camera', 'Connected Features', 'Sunroof'], tagline: 'Practical EV for city and highway driving', description: 'A polished electric SUV for modern commuters who want efficiency and comfort.' },
  {
    brand: 'MG', name: 'ZS EV', category: 'Electric' as Category, basePrice: 3100, seats: 5, fuel: 'Electric', transmission: 'Automatic', luggage: '2 large bags', features: ['Connected Tech', 'Panoramic Roof', 'Rear Camera', 'Premium Interior'], tagline: 'Electric SUV with premium design language', description: 'Perfect for contemporary city travel with useful range and high comfort.' },
  {
    brand: 'Hyundai', name: 'Kona EV', category: 'Electric' as Category, basePrice: 3000, seats: 5, fuel: 'Electric', transmission: 'Automatic', luggage: '2 medium bags', features: ['Fast Charging', 'Smart Display', 'Rear Camera', 'Regenerative Braking'], tagline: 'Smooth and efficient electric hatchback', description: 'An excellent EV option for urban mobility, short drives and eco-conscious travellers.' },
];

const GENERATED_CARS: Car[] = [];

INVENTORY_TEMPLATES.forEach((template, index) => {
  CITY_VARIANTS.forEach((cityVariant, cityIndex) => {
    const pricePerDay = Math.round(template.basePrice * cityVariant.multiplier + cityIndex * 120);
    const pricePerHour = Math.max(500, Math.round(pricePerDay / 8));
    const availability: Car['availability'] = index % 5 === 0 ? 'Limited' : index % 7 === 0 ? 'On Request' : 'Available';
    const availableLocations = [cityVariant.city, cityIndex % 2 === 0 ? 'Noida' : 'Gurugram', cityIndex % 3 === 0 ? 'Pune' : 'Jaipur'].filter(Boolean);
    const rating = Number((4.2 + (index % 6) * 0.1 + cityIndex * 0.02).toFixed(1));
    const reviewCount = 40 + index * 7 + cityIndex * 3;
    const image = getCarAssetPath({ slug: `${template.brand.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, '-')}`, category: template.category });

    GENERATED_CARS.push({
      slug: `${template.brand.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${cityVariant.city.toLowerCase()}`,
      name: `${template.brand} ${template.name}`,
      brand: template.brand,
      category: template.category,
      pricePerDay,
      pricePerHour,
      image,
      gallery: getCarGalleryImages({ slug: `${template.brand.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, '-')}`, category: template.category }),
      tagline: template.tagline,
      description: `${template.description} Available in ${cityVariant.city} with flexible hourly and daily rentals.`,
      specs: {
        passengers: template.seats,
        fuel: template.fuel,
        transmission: template.transmission,
        mileage: template.category === 'Electric' ? '220-300 km/charge' : template.category === 'Luxury' ? '10-13 kmpl' : '18-24 kmpl',
        ac: true,
        luggageCapacity: template.luggage,
      },
      features: template.features,
      rating,
      reviewCount,
      availability,
      chauffeurAvailable: true,
      selfDrive: template.category !== 'Luxury',
      reviews: [
        { id: `r-${cityIndex}-${index}`, author: 'Verified Guest', rating: Math.round(rating), date: '2025-08-01', text: 'Excellent ride quality and spotless car.', verified: true },
      ],
      popular: index < 8,
      city: cityVariant.city,
      fuelType: template.fuel,
      luggageCapacity: template.luggage,
      locations: availableLocations,
    });
  });
});

/**
 * Enrich legacy car galleries with multiple real local photos.
 * (Keeps the explicit single-entry galleries intact if they already have
 * multiple entries, otherwise builds a deterministic real-photo gallery.)
 */
function enrichLegacyGalleries(cars: Car[]): Car[] {
  return cars.map((car) => {
    if (car.gallery.length > 1) return car;
    return {
      ...car,
      gallery: getCarGalleryImages({ slug: car.slug, category: car.category }),
    };
  });
}

export const CARS: Car[] = [...enrichLegacyGalleries(LEGACY_CARS), ...GENERATED_CARS];

export const CATEGORIES: { key: Category; label: string; description: string }[] = [
  { key: 'Hatchback', label: 'Hatchback', description: 'Efficient city runs' },
  { key: 'Sedan', label: 'Sedan', description: 'Balanced comfort and style' },
  { key: 'SUV', label: 'SUV', description: 'Space and premium road presence' },
  { key: 'Luxury', label: 'Luxury', description: 'Premium executive experience' },
  { key: 'Electric', label: 'Electric', description: 'Electric and eco-friendly' },
  { key: 'Economy', label: 'Economy', description: 'Affordable and efficient' },
  { key: 'Premium', label: 'Premium', description: 'Comfort and style' },
  { key: 'Executive Vans', label: 'Executive Vans', description: 'Group travel in comfort' },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}

export function getRelatedCars(car: Car, count = 3): Car[] {
  return CARS.filter((c) => c.category === car.category && c.slug !== car.slug).slice(0, count);
}

export function getPopularCars(): Car[] {
  return CARS.filter((c) => c.popular);
}
