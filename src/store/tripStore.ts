import { create } from 'zustand';
import { TripState, Trip, TripRequest, TripStatus, Driver } from '../types';

// Mock data para conductores
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    rating: 4.8,
    carModel: 'Toyota Yaris',
    carColor: 'Blanco',
    licensePlate: 'ABC-123',
    phone: '+51 987 654 321',
    location: { lat: -9.2944, lng: -75.9969 }
  },
  {
    id: '2',
    name: 'María González',
    rating: 4.9,
    carModel: 'Nissan Versa',
    carColor: 'Azul',
    licensePlate: 'XYZ-789',
    phone: '+51 987 654 322',
    location: { lat: -9.2900, lng: -75.9950 }
  }
];

// Mock data para historial de viajes
const mockTripHistory: Trip[] = [
  {
    id: 'trip-1',
    passengerId: 'current-user',
    driverId: '1',
    status: 'completed',
    pickupLocation: { lat: -9.2944, lng: -75.9969 },
    dropoffLocation: { lat: -9.2900, lng: -75.9950 },
    pickupAddress: 'Plaza Mayor de Huamanga',
    dropoffAddress: 'Universidad Nacional San Cristóbal de Huamanga',
    destination: {
      id: 1,
      name: 'Universidad Nacional San Cristóbal de Huamanga',
      price: 15.50,
      description: 'Campus universitario principal',
      time: '12-15 min',
      distance: '3.2 km',
      location: { lat: -9.2900, lng: -75.9950 }
    },
    estimatedFare: 15.50,
    fare: 15.50,
    actualFare: 15.50,
    estimatedDuration: 12,
    actualDuration: 14,
    estimatedDistance: 3.2,
    actualDistance: 3.4,
    vehicleCategory: 'economy',
    paymentMethod: 'card',
    createdAt: new Date('2024-12-15T10:30:00'),
    completedAt: new Date('2024-12-15T10:44:00'),
    rating: 5,
    driverInfo: mockDrivers[0]
  },
  {
    id: 'trip-2',
    passengerId: 'current-user',
    driverId: '2',
    status: 'completed',
    pickupLocation: { lat: -9.2900, lng: -75.9950 },
    dropoffLocation: { lat: -9.2800, lng: -75.9900 },
    pickupAddress: 'Universidad Nacional San Cristóbal de Huamanga',
    dropoffAddress: 'Centro Comercial Plaza',
    destination: {
      id: 2,
      name: 'Centro Comercial Plaza',
      price: 12.00,
      description: 'Centro comercial principal',
      time: '8-10 min',
      distance: '2.1 km',
      location: { lat: -9.2800, lng: -75.9900 }
    },
    estimatedFare: 12.00,
    fare: 12.00,
    actualFare: 12.00,
    estimatedDuration: 8,
    actualDuration: 9,
    estimatedDistance: 2.1,
    actualDistance: 2.2,
    vehicleCategory: 'economy',
    paymentMethod: 'cash',
    createdAt: new Date('2024-12-14T15:20:00'),
    completedAt: new Date('2024-12-14T15:29:00'),
    rating: 4,
    driverInfo: mockDrivers[1]
  }
];

export const useTripStore = create<TripState>((set, get) => ({
  currentTrip: null,
  tripHistory: mockTripHistory,
  isLoading: false,

  createTrip: async (tripRequest: TripRequest) => {
    set({ isLoading: true });
    try {
      // Simulación de búsqueda de conductor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Seleccionar conductor aleatorio
      const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
      
      const newTrip: Trip = {
        id: Date.now().toString(),
        passengerId: 'current-user',
        driverId: driver.id,
        status: 'driver_found',
        pickupLocation: tripRequest.pickupLocation,
        dropoffLocation: tripRequest.destination.location,
        pickupAddress: tripRequest.pickupAddress,
        dropoffAddress: tripRequest.destination.name,
        destination: tripRequest.destination,
        estimatedFare: tripRequest.destination.price,
        fare: tripRequest.destination.price,
        estimatedDuration: parseInt(tripRequest.destination.time.split('-')[0]),
        estimatedDistance: parseFloat(tripRequest.destination.distance.split(' ')[0]),
        vehicleCategory: 'economy',
        paymentMethod: tripRequest.paymentMethod as 'cash' | 'card' | 'digital_wallet',
        createdAt: new Date(),
        driverInfo: driver
      };
      
      set({ currentTrip: newTrip, isLoading: false });
      
      // Simular el flujo de estados del viaje
      setTimeout(() => {
        get().updateTripStatus(newTrip.id, 'driver_arriving');
      }, 3000);
      
      setTimeout(() => {
        get().updateTripStatus(newTrip.id, 'driver_arrived');
      }, 8000);
      
      setTimeout(() => {
        get().updateTripStatus(newTrip.id, 'in_progress');
      }, 12000);
      
      setTimeout(() => {
        get().updateTripStatus(newTrip.id, 'completed');
      }, 20000);
      
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTripStatus: (tripId: string, status: TripStatus) => {
    const currentTrip = get().currentTrip;
    if (currentTrip && currentTrip.id === tripId) {
      const updatedTrip = { ...currentTrip, status };
      set({ currentTrip: updatedTrip });
    }
  },

  completeTrip: (tripId: string, rating: number) => {
    const currentTrip = get().currentTrip;
    if (currentTrip && currentTrip.id === tripId) {
      const completedTrip = {
        ...currentTrip,
        status: 'completed' as TripStatus,
        rating,
        completedAt: new Date(),
        actualFare: currentTrip.estimatedFare,
        actualDuration: currentTrip.estimatedDuration,
        actualDistance: currentTrip.estimatedDistance
      };
      
      const tripHistory = get().tripHistory;
      set({ 
        currentTrip: null,
        tripHistory: [completedTrip, ...tripHistory]
      });
    }
  },

  cancelTrip: (tripId: string) => {
    const currentTrip = get().currentTrip;
    if (currentTrip && currentTrip.id === tripId) {
      set({ currentTrip: null });
    }
  }
}));
