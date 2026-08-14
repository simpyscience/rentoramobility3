import { CARS } from '@/lib/data/cars';
import { getDestinationAssetPath } from '@/lib/data/images';

export interface DestinationTravelInfo {
  city: string;
  distanceKm: number;
  driveTime: string;
  routeInfo: string;
}

export interface Destination {
  slug: string;
  name: string;
  cityName: string;
  state: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery: string[];
  history: string;
  bestTimeToVisit: string;
  attractions: string[];
  nearbyAttractions: string[];
  restaurants: string[];
  hotels: string[];
  parking: string[];
  weatherOverview: string;
  estimatedFuelCost: string;
  travelInfo: DestinationTravelInfo[];
  recommendedCarSlugs: string[];
}

const DESTINATION_ASSET = (slug: string) => getDestinationAssetPath(slug);

export const DESTINATIONS: Destination[] = [
  {
    slug: 'delhi-jaipur',
    name: 'Delhi to Jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    shortDescription: 'A royal road trip through forts, food and desert charm.',
    description: 'The Delhi to Jaipur route combines imperial history, vibrant bazaars, and a comfortable highway drive. This is one of the most popular weekend escapes for families and executives alike.',
    heroImage: DESTINATION_ASSET('delhi-jaipur'),
    gallery: [DESTINATION_ASSET('delhi-jaipur'), DESTINATION_ASSET('delhi-jaipur')],
    history: 'Jaipur, the Pink City, was founded in 1727 by Maharaja Sawai Jai Singh II and remains one of Rajasthan’s most iconic destinations.',
    bestTimeToVisit: 'October to March for pleasant weather and desert evenings.',
    attractions: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
    nearbyAttractions: ['Nahargarh Fort', 'Albert Hall Museum', 'Jal Mahal'],
    restaurants: ['Niros', 'Peshawri Jaipur', 'Café Jaipur'],
    hotels: ['The Oberoi Rajvilas', 'Umaid Bhawan', 'Hotel Jaipur Greens'],
    parking: ['Hotel valet', 'Fort parking', 'Dedicated public parking zones near markets'],
    weatherOverview: 'Expect warm days, cool evenings, and clear skies during the peak travel season.',
    estimatedFuelCost: 'Approx. ₹1,800–₹2,400 depending on your vehicle and route.',
    travelInfo: [
      { city: 'Delhi', distanceKm: 280, driveTime: '5–6 hrs', routeInfo: 'NH48 via Gurgaon and Manesar' },
      { city: 'Gurugram', distanceKm: 260, driveTime: '4.5–5.5 hrs', routeInfo: 'Fastest highway route via NH48' },
      { city: 'Noida', distanceKm: 300, driveTime: '5.5–6.5 hrs', routeInfo: 'NH48 with a few toll plazas' },
      { city: 'Jaipur', distanceKm: 0, driveTime: 'Start point', routeInfo: 'City route via Tonk Road' },
      { city: 'Chandigarh', distanceKm: 480, driveTime: '8–9 hrs', routeInfo: 'NH152 via Ambala' },
    ],
    recommendedCarSlugs: ['toyota-innova-crysta', 'honda-city', 'toyota-fortuner'],
  },
  {
    slug: 'delhi-agra',
    name: 'Delhi to Agra',
    cityName: 'Agra',
    state: 'Uttar Pradesh',
    shortDescription: 'A timeless journey to one of India’s most iconic monuments.',
    description: 'The Delhi to Agra route is perfect for history lovers, couples and weekend explorers who want a premium yet effortless road trip.',
    heroImage: DESTINATION_ASSET('delhi-agra'),
    gallery: [DESTINATION_ASSET('delhi-agra'), DESTINATION_ASSET('delhi-agra')],
    history: 'Agra is home to the Taj Mahal, one of the world’s greatest architectural marvels and a UNESCO World Heritage Site.',
    bestTimeToVisit: 'October to March for cooler weather and clear views.',
    attractions: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri'],
    nearbyAttractions: ['Sikandra', 'Itimad-ud-Daulah', 'Guru ka Tal'],
    restaurants: ['Pinch of Spice', 'The Salt Cafe', 'Bukhara'],
    hotels: ['The Oberoi Amarvilas', 'ITC Mughal', 'Hotel Taj Resorts'],
    parking: ['Taj Mahal parking', 'Hotel valet', 'Fort parking zones'],
    weatherOverview: 'Pleasant winters and warm summers, with summer afternoons often very hot.',
    estimatedFuelCost: 'Approx. ₹1,400–₹1,900 depending on the vehicle and road conditions.',
    travelInfo: [
      { city: 'Delhi', distanceKm: 230, driveTime: '3.5–4.5 hrs', routeInfo: 'Yamuna Expressway via Noida' },
      { city: 'Gurugram', distanceKm: 250, driveTime: '4–5 hrs', routeInfo: 'Via NH44 and Yamuna Expressway' },
      { city: 'Noida', distanceKm: 210, driveTime: '3.5–4.5 hrs', routeInfo: 'Yamuna Expressway' },
      { city: 'Jaipur', distanceKm: 410, driveTime: '6.5–7.5 hrs', routeInfo: 'Via NH21 and NH44' },
      { city: 'Chandigarh', distanceKm: 450, driveTime: '7.5–8.5 hrs', routeInfo: 'Via NH44 and Delhi' },
    ],
    recommendedCarSlugs: ['honda-city', 'toyota-innova-crysta', 'bmw-5-series'],
  },
  {
    slug: 'mumbai-pune',
    name: 'Mumbai to Pune',
    cityName: 'Pune',
    state: 'Maharashtra',
    shortDescription: 'A stylish weekend escape with food, forts and city energy.',
    description: 'The Mumbai to Pune route is a favourite for business travellers and weekend adventurers. The drive is scenic, quick, and packed with premium stay options.',
    heroImage: DESTINATION_ASSET('mumbai-pune'),
    gallery: [DESTINATION_ASSET('mumbai-pune'), DESTINATION_ASSET('mumbai-pune')],
    history: 'Pune has long been a cultural and educational hub and is now one of India’s most dynamic business cities.',
    bestTimeToVisit: 'November to February for cool weather and clear views.',
    attractions: ['Lonavala', 'Sinhagad Fort', 'Shaniwar Wada', 'Dagdusheth Temple'],
    nearbyAttractions: ['Khandala', 'Lavasa', 'Mulshi Lake'],
    restaurants: ['Asteras', 'The Sassy Spoon', 'Maharaja'],
    hotels: ['JW Marriott Pune', 'The Westin Pune', 'The St. Regis Pune'],
    parking: ['Mall parking', 'Hotel valet', 'Highway rest area parking'],
    weatherOverview: 'Cooler than Mumbai, especially in winter, with monsoon greenery making the route exceptionally scenic.',
    estimatedFuelCost: 'Approx. ₹1,000–₹1,600 depending on your car class and stopovers.',
    travelInfo: [
      { city: 'Mumbai', distanceKm: 150, driveTime: '3–4 hrs', routeInfo: 'Expressway via Pune-Mumbai Expressway' },
      { city: 'Gurugram', distanceKm: 1310, driveTime: '20–22 hrs', routeInfo: 'Long-distance route via NH48' },
      { city: 'Noida', distanceKm: 1350, driveTime: '21–23 hrs', routeInfo: 'Pan-India highway route' },
      { city: 'Jaipur', distanceKm: 1030, driveTime: '16–17 hrs', routeInfo: 'Via NH48 and NH52' },
      { city: 'Chandigarh', distanceKm: 1620, driveTime: '24–26 hrs', routeInfo: 'Long-distance highway route' },
    ],
    recommendedCarSlugs: ['toyota-innova-crysta', 'honda-city', 'mercedes-e-class'],
  },
  {
    slug: 'bangalore-goa',
    name: 'Bangalore to Goa',
    cityName: 'Goa',
    state: 'Goa',
    shortDescription: 'An adventure-filled coastal drive with beaches and sunset stops.',
    description: 'The Bangalore to Goa route is beloved for its relaxed pace, scenic viewpoints, and easy beachside getaway energy.',
    heroImage: DESTINATION_ASSET('bangalore-goa'),
    gallery: [DESTINATION_ASSET('bangalore-goa'), DESTINATION_ASSET('bangalore-goa')],
    history: 'Goa has a rich cultural legacy shaped by Portuguese influence and a long heritage as a coastal trading hub.',
    bestTimeToVisit: 'November to February for the best weather and beach evenings.',
    attractions: ['Baga Beach', 'Fort Aguada', 'Anjuna Beach', 'Old Goa'],
    nearbyAttractions: ['Chapora Fort', 'Dudhsagar Falls', 'Vagator'],
    restaurants: ['The Fisherman’s Wharf', 'The Black Sheep Bistro', 'Mambos'],
    hotels: ['Taj Fort Aguada', 'Leela Goa', 'The Postcard Moira'],
    parking: ['Beach parking lots', 'Hotel valet', 'Town parking zones'],
    weatherOverview: 'Warm and tropical, with the best comfort during the winter season.',
    estimatedFuelCost: 'Approx. ₹2,400–₹3,400 depending on the route and vehicle size.',
    travelInfo: [
      { city: 'Bangalore', distanceKm: 560, driveTime: '8.5–10 hrs', routeInfo: 'NH48 via Hubballi and Belagavi' },
      { city: 'Gurugram', distanceKm: 1980, driveTime: '30–32 hrs', routeInfo: 'Long highway route' },
      { city: 'Noida', distanceKm: 2040, driveTime: '31–33 hrs', routeInfo: 'Pan-India highway path' },
      { city: 'Jaipur', distanceKm: 1780, driveTime: '27–29 hrs', routeInfo: 'Via NH48 and NH52' },
      { city: 'Chandigarh', distanceKm: 2160, driveTime: '32–34 hrs', routeInfo: 'Extended highway route' },
    ],
    recommendedCarSlugs: ['toyota-fortuner', 'mahindra-xuv700', 'bmw-5-series'],
  },
  {
    slug: 'delhi-udaipur',
    name: 'Delhi to Udaipur',
    cityName: 'Udaipur',
    state: 'Rajasthan',
    shortDescription: 'A royal road trip into the City of Lakes and heritage charm.',
    description: 'The Delhi to Udaipur stretch is a wonderful choice for travellers seeking lakeside luxury, palace views, and grand road-trip comfort.',
    heroImage: DESTINATION_ASSET('delhi-udaipur'),
    gallery: [DESTINATION_ASSET('delhi-udaipur'), DESTINATION_ASSET('delhi-udaipur')],
    history: 'Udaipur’s palaces and lakes made it one of the most romantic destinations in Rajasthan.',
    bestTimeToVisit: 'October to March for cool temperatures and clear skies.',
    attractions: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon ki Bari'],
    nearbyAttractions: ['Monsoon Palace', 'Fateh Sagar', 'Ahar'],
    restaurants: ['Ambrai', 'Jheel’s Ginger', 'Natraj Dining Hall'],
    hotels: ['The Oberoi Udaivilas', 'Taj Lake Palace', 'Hotel Fateh Garh'],
    parking: ['Hotel valet', 'Lake-facing parking', 'Commercial parking near old city'],
    weatherOverview: 'Pleasant winters and warm afternoons, ideal for sightseeing and evening drives.',
    estimatedFuelCost: 'Approx. ₹2,400–₹3,200 depending on the route, stops and car size.',
    travelInfo: [
      { city: 'Delhi', distanceKm: 670, driveTime: '10.5–12 hrs', routeInfo: 'Via NH48 and NH58' },
      { city: 'Gurugram', distanceKm: 650, driveTime: '10–11.5 hrs', routeInfo: 'Fastest route via NH48' },
      { city: 'Noida', distanceKm: 690, driveTime: '11–12.5 hrs', routeInfo: 'Via NH48 and Jaipur route' },
      { city: 'Jaipur', distanceKm: 390, driveTime: '6–7 hrs', routeInfo: 'Via NH48 and NH79' },
      { city: 'Chandigarh', distanceKm: 760, driveTime: '12–13.5 hrs', routeInfo: 'Via NH48 and NH58' },
    ],
    recommendedCarSlugs: ['toyota-fortuner', 'toyota-innova-crysta', 'mercedes-e-class'],
  },
  {
    slug: 'jaipur-udaipur',
    name: 'Jaipur to Udaipur',
    cityName: 'Udaipur',
    state: 'Rajasthan',
    shortDescription: 'A heritage-rich route through palaces, lakes and desert landscapes.',
    description: 'The Jaipur to Udaipur path is perfect for travellers who want a premium road trip with scenic stops and royal hospitality.',
    heroImage: DESTINATION_ASSET('jaipur-udaipur'),
    gallery: [DESTINATION_ASSET('jaipur-udaipur'), DESTINATION_ASSET('jaipur-udaipur')],
    history: 'This route links two of Rajasthan’s most celebrated cities, each with deep-rooted royal heritage and architecture.',
    bestTimeToVisit: 'October to March for comfortable travel and open-air sightseeing.',
    attractions: ['Amber Fort', 'Lake Pichola', 'Jag Mandir', 'Hawa Mahal'],
    nearbyAttractions: ['Kumbhalgarh Fort', 'Ranakpur', 'Ahar'],
    restaurants: ['The Baradari', 'Tavern', 'Jheel’s Ginger'],
    hotels: ['The Leela Palace Udaipur', 'Hotel The Royal Retreat', 'Hotel Fateh Sagar'],
    parking: ['Hotel parking', 'City palace parking', 'Lakefront parking'],
    weatherOverview: 'Expect dry, sunny days and cool nights during the best travel months.',
    estimatedFuelCost: 'Approx. ₹1,800–₹2,600 depending on your route and stops.',
    travelInfo: [
      { city: 'Jaipur', distanceKm: 390, driveTime: '6–7 hrs', routeInfo: 'NH48 and NH79 via Chittorgarh' },
      { city: 'Gurugram', distanceKm: 520, driveTime: '8–9 hrs', routeInfo: 'Via Jaipur route and NH48' },
      { city: 'Noida', distanceKm: 560, driveTime: '8.5–9.5 hrs', routeInfo: 'Via NH48 and Jaipur route' },
      { city: 'Delhi', distanceKm: 670, driveTime: '10.5–12 hrs', routeInfo: 'Via NH48 and NH58' },
      { city: 'Chandigarh', distanceKm: 780, driveTime: '12.5–14 hrs', routeInfo: 'Via NH48 and NH58' },
    ],
    recommendedCarSlugs: ['toyota-innova-crysta', 'mahindra-xuv700', 'toyota-fortuner'],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((destination) => destination.slug === slug);
}

export function getFeaturedDestinations(count = 4): Destination[] {
  return DESTINATIONS.slice(0, count);
}

export function getDestinationRecommendedCars(destination: Destination): ReturnType<typeof CARS.filter> {
  return CARS.filter((car) => destination.recommendedCarSlugs.includes(car.slug));
}
