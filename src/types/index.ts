export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  profilePicture?: string;
  createdAt: Date;
  rating: number;
  totalTrips: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  carModel: string;
  carColor: string;
  licensePlate: string;
  phone: string;
  photo?: string;
  location: Location;
}

export interface Destination {
  id: number;
  name: string;
  price: number;
  description: string;
  time: string;
  distance: string;
  location: Location;
}

export type TripStatus = 
  | 'requesting'
  | 'driver_found'
  | 'driver_arriving'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  status: TripStatus;
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupAddress: string;
  dropoffAddress: string;
  destination: Destination;
  estimatedFare: number;
  actualFare?: number;
  fare: number;
  estimatedDuration: number;
  actualDuration?: number;
  estimatedDistance: number;
  actualDistance?: number;
  vehicleCategory: 'economy' | 'standard' | 'premium';
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  createdAt: Date;
  completedAt?: Date;
  rating?: number;
  driverInfo?: Driver;
}

export interface TripRequest {
  destination: Destination;
  pickupLocation: Location;
  pickupAddress: string;
  paymentMethod: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  TripRequest: undefined;
  TripTracking: { tripId: string };
  Profile: undefined;
  TripHistory: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface TripState {
  currentTrip: Trip | null;
  tripHistory: Trip[];
  isLoading: boolean;
  createTrip: (tripRequest: TripRequest) => Promise<void>;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  completeTrip: (tripId: string, rating: number) => void;
  cancelTrip: (tripId: string) => void;
}
