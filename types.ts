
export type BookingCycle = 'Day' | 'Week' | 'Month' | 'Year';

export interface Property {
  id: string;
  title: string;
  type: 'Hostel' | 'Flat' | 'Room' | 'Stay' | 'PG';
  location: string;
  city: string;
  price: Record<BookingCycle, number>;
  description: string;
  amenities: string[];
  ownerName: string;
  ownerWhatsApp: string;
  upiId: string;
  images: string[];
  videoUrl?: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  nearbyHubs: string[]; // Coaching institutes, colleges, offices
}

export type AppMode = 'Find' | 'List';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Owner' | 'Admin';
}
