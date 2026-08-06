export type Category =
  | 'Economy'
  | 'Premium'
  | 'SUV'
  | 'Luxury'
  | 'Executive Vans';

export interface CarSpec {
  passengers: number;
  fuel: string;
  transmission: string;
  mileage: string;
  ac: boolean;
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
}

export const CARS: Car[] = [
  {
    slug: 'maruti-wagonr',
    name: 'Maruti WagonR',
    brand: 'Maruti',
    category: 'Economy',
    pricePerDay: 2200,
    image:
      'https://images.pexels.com/photos/17196481/pexels-photo-17196481.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/17196481/pexels-photo-17196481.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/16375964/pexels-photo-16375964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/16375964/pexels-photo-16375964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/2126219/pexels-photo-2126219.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/2126219/pexels-photo-2126219.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3860052/pexels-photo-3860052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3860052/pexels-photo-3860052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/10019909/pexels-photo-10019909.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/10019909/pexels-photo-10019909.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/2126219/pexels-photo-2126219.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/2126219/pexels-photo-2126219.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/12345684/pexels-photo-12345684.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/12345684/pexels-photo-12345684.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/10112505/pexels-photo-10112505.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/10112505/pexels-photo-10112505.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/5872937/pexels-photo-5872937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/5872937/pexels-photo-5872937.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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
    image:
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [
      'https://images.pexels.com/photos/18581043/pexels-photo-18581043.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
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

export const CATEGORIES: { key: Category; label: string; description: string }[] = [
  { key: 'Economy', label: 'Economy', description: 'Affordable and efficient' },
  { key: 'Premium', label: 'Premium', description: 'Comfort and style' },
  { key: 'SUV', label: 'SUV', description: 'Space and power' },
  { key: 'Luxury', label: 'Luxury', description: 'The finest experience' },
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
