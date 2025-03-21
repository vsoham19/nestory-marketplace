
import { Property } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa with Ocean View',
    description: 'This stunning modern villa offers panoramic ocean views, a spacious open floor plan, and high-end finishes throughout. Featuring a gourmet kitchen, infinity pool, and multiple outdoor living spaces perfect for entertaining.',
    price: 2450000,
    address: '123 Coastal Drive',
    city: 'Malibu',
    state: 'CA',
    zipCode: '90265',
    type: 'house',
    status: 'for-sale',
    bedrooms: 5,
    bathrooms: 4.5,
    area: 4200,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Ocean View', 'Infinity Pool', 'Smart Home System', 'Wine Cellar', 'Home Theater'
    ],
    createdAt: new Date('2023-05-15'),
    userId: 'user1',
  },
  {
    id: '2',
    title: 'Downtown Luxury Penthouse',
    description: 'Exclusive penthouse in the heart of downtown with floor-to-ceiling windows showcasing panoramic city views. Features include a chef\'s kitchen, private rooftop terrace, and 24-hour concierge service.',
    price: 1850000,
    address: '789 Sky Tower',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    type: 'apartment',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'City View', 'Private Terrace', 'Concierge', 'Gym', 'Security'
    ],
    createdAt: new Date('2023-06-20'),
    userId: 'user2',
  },
  {
    id: '3',
    title: 'Historic Brownstone with Garden',
    description: 'Meticulously restored historic brownstone featuring original architectural details combined with modern amenities. Includes a charming private garden, chef\'s kitchen, and full-floor primary suite.',
    price: 3200000,
    address: '456 Heritage Lane',
    city: 'Boston',
    state: 'MA',
    zipCode: '02116',
    type: 'house',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 3.5,
    area: 3600,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Historic Details', 'Private Garden', 'Fireplace', 'Wine Cellar', 'Library'
    ],
    createdAt: new Date('2023-07-10'),
    userId: 'user3',
  },
  {
    id: '4',
    title: 'Contemporary Waterfront Condo',
    description: 'Sleek and modern waterfront condo with spectacular views. Features include upscale finishes, floor-to-ceiling windows, and an expansive balcony perfect for entertaining.',
    price: 5200,
    address: '101 Harbor View Drive',
    city: 'Miami',
    state: 'FL',
    zipCode: '33131',
    type: 'condo',
    status: 'for-rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    images: [
      'https://images.unsplash.com/photo-1551361415-69c87624334f?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1560185008-a33f5c7b1844?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Waterfront', 'Pool', 'Gym', 'Concierge', 'Parking'
    ],
    createdAt: new Date('2023-08-05'),
    userId: 'user4',
  },
  {
    id: '5',
    title: 'Secluded Mountain Retreat',
    description: 'Escape to this magnificent mountain retreat offering privacy and stunning views. The home features exposed timber beams, stone fireplaces, and a wraparound deck perfect for enjoying the surrounding nature.',
    price: 1750000,
    address: '555 Mountain View Road',
    city: 'Aspen',
    state: 'CO',
    zipCode: '81611',
    type: 'house',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Mountain View', 'Hot Tub', 'Fireplace', 'Game Room', 'Hiking Trails'
    ],
    createdAt: new Date('2023-09-12'),
    userId: 'user5',
  },
  {
    id: '6',
    title: 'Urban Industrial Loft',
    description: 'Stylish industrial loft in a converted warehouse featuring high ceilings, exposed brick walls, and original timber beams. Includes modern upgrades like a chef\'s kitchen and luxury bathroom.',
    price: 3800,
    address: '200 Warehouse District',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60607',
    type: 'apartment',
    status: 'for-rent',
    bedrooms: 1,
    bathrooms: 1.5,
    area: 1650,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1494203484021-3c454daf695d?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Industrial Features', 'High Ceilings', 'Open Floor Plan', 'Stainless Appliances', 'In-unit Laundry'
    ],
    createdAt: new Date('2023-10-18'),
    userId: 'user6',
  },
  {
    id: '7',
    title: 'Suburban Family Home with Pool',
    description: 'Well-maintained family home in a quiet suburban neighborhood. Featuring a spacious backyard with in-ground pool, updated kitchen, and comfortable family room perfect for gatherings.',
    price: 850000,
    address: '322 Oak Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    type: 'house',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 2.5,
    area: 2600,
    images: [
      'https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Swimming Pool', 'Fenced Yard', 'Updated Kitchen', 'Home Office', 'Patio'
    ],
    createdAt: new Date('2023-11-05'),
    userId: 'user7',
  },
  {
    id: '8',
    title: 'Coastal Cottage with Beach Access',
    description: 'Charming coastal cottage just steps from the beach. This delightful property features a cozy interior with a beach-inspired design, enclosed porch, and private garden path to the shore.',
    price: 1200000,
    address: '78 Shoreline Drive',
    city: 'Santa Barbara',
    state: 'CA',
    zipCode: '93101',
    type: 'house',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Beach Access', 'Ocean View', 'Porch', 'Garden', 'Fireplace'
    ],
    createdAt: new Date('2023-11-20'),
    userId: 'user8',
  },
  {
    id: '9',
    title: 'Luxury Townhouse in Historic District',
    description: 'Elegant townhouse in the heart of the historic district combining classic architecture with modern luxury. Features include high ceilings, premium finishes, and a charming private courtyard.',
    price: 1350000,
    address: '45 Heritage Row',
    city: 'Charleston',
    state: 'SC',
    zipCode: '29401',
    type: 'townhouse',
    status: 'for-sale',
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2200,
    images: [
      'https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Historic District', 'Courtyard', 'Gourmet Kitchen', 'Crown Molding', 'Hardwood Floors'
    ],
    createdAt: new Date('2023-12-01'),
    userId: 'user9',
  },
  {
    id: '10',
    title: 'Modern Eco-Friendly Smart Home',
    description: 'Cutting-edge eco-friendly home featuring solar power, energy-efficient design, and integrated smart home technology. This modern residence offers sustainable living without sacrificing luxury or comfort.',
    price: 1650000,
    address: '888 Tech Boulevard',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98112',
    type: 'house',
    status: 'for-sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    images: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600585154526-990dced4db3d?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Solar Panels', 'Smart Home System', 'Energy Efficient', 'Rainwater Collection', 'Electric Car Charger'
    ],
    createdAt: new Date('2023-12-15'),
    userId: 'user10',
  },
  {
    id: '11',
    title: 'Waterfront Estate with Private Dock',
    description: 'Luxurious waterfront estate on a private peninsula with panoramic water views. This expansive property includes a private dock, boat lift, infinity pool, and meticulously landscaped grounds.',
    price: 5800000,
    address: '1 Peninsula Place',
    city: 'Naples',
    state: 'FL',
    zipCode: '34102',
    type: 'house',
    status: 'for-sale',
    bedrooms: 6,
    bathrooms: 7.5,
    area: 8500,
    images: [
      'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Waterfront', 'Private Dock', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Guest House'
    ],
    createdAt: new Date('2024-01-05'),
    userId: 'user11',
  },
  {
    id: '12',
    title: 'Ultra-Modern Architectural Masterpiece',
    description: 'Award-winning architectural marvel featuring clean lines, walls of glass, and seamless indoor-outdoor living. This stunning contemporary home offers unparalleled design and luxury finishes throughout.',
    price: 7200000,
    address: '2500 Canyon View Drive',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    type: 'house',
    status: 'for-sale',
    bedrooms: 5,
    bathrooms: 6,
    area: 6800,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&q=75&fit=crop&w=1000',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&q=75&fit=crop&w=1000'
    ],
    features: [
      'Panoramic Views', 'Infinity Pool', 'Home Automation', 'Media Room', 'Gym', 'Wine Room'
    ],
    createdAt: new Date('2024-01-15'),
    userId: 'user12',
  },
];
