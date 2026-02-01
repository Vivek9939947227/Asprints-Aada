
import { Property } from './types';

export const CITIES = ['Delhi', 'Patna', 'Kota', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chandigarh', 'Lucknow', 'Jaipur'];

export const AMENITIES = [
  'WiFi', 'AC', 'Power Backup', 'Laundry', 'Attached Washroom', 
  'Geyser', 'Security', 'CCTV', 'RO Water', 'Parking', 'Gym', 'Meals Included'
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Comfortable Student PG near Allen Samarth',
    type: 'PG',
    location: 'Indra Vihar, Kota',
    city: 'Kota',
    price: { Day: 500, Week: 3000, Month: 8500, Year: 95000 },
    description: 'Perfect for students preparing for JEE/NEET. Walking distance from Allen. Calm environment with 24/7 library access.',
    amenities: ['WiFi', 'Power Backup', 'Security', 'Meals Included', 'RO Water'],
    ownerName: 'Rajesh Sharma',
    ownerWhatsApp: '919876543210',
    upiId: 'rajesh@okaxis',
    images: [
      'https://images.unsplash.com/photo-1555854817-5b2260d15050?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    lat: 25.1388,
    lng: 75.8362,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 124,
    nearbyHubs: ['Allen Samarth', 'Resonance', 'Bansal Classes']
  },
  {
    id: '2',
    title: 'Luxury 2BHK Flat for Professionals',
    type: 'Flat',
    location: 'Boring Road, Patna',
    city: 'Patna',
    price: { Day: 2500, Week: 12000, Month: 25000, Year: 280000 },
    description: 'Fully furnished luxury flat in the heart of Patna. Ideal for job seekers and working professionals.',
    amenities: ['AC', 'Gym', 'Parking', 'WiFi', 'Laundry'],
    ownerName: 'Amit Singh',
    ownerWhatsApp: '919999988888',
    upiId: 'amitsingh@ybl',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    ],
    lat: 25.6174,
    lng: 85.1228,
    isAvailable: true,
    rating: 4.5,
    reviewsCount: 45,
    nearbyHubs: ['Patna Women\'s College', 'AN College', 'Maurya Lok']
  },
  {
    id: '3',
    title: 'Budget Friendly Hostel near North Campus',
    type: 'Hostel',
    location: 'Vijay Nagar, Delhi',
    city: 'Delhi',
    price: { Day: 400, Week: 2500, Month: 7000, Year: 80000 },
    description: 'Cheap and best hostel for DU students. Clean rooms and great connectivity to Metro.',
    amenities: ['WiFi', 'Security', 'Attached Washroom', 'RO Water'],
    ownerName: 'Suman Lata',
    ownerWhatsApp: '918888877777',
    upiId: 'sumanlata@paytm',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555854817-5b2260d15050?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lat: 28.6946,
    lng: 77.2033,
    isAvailable: true,
    rating: 4.2,
    reviewsCount: 210,
    nearbyHubs: ['Delhi University North Campus', 'Hansraj College', 'Miranda House']
  }
];
