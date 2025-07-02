import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore, useTripStore } from '../store';
import { RootStackParamList, Destination } from '../types';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

// Destinos predefinidos
const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Mercado Tingo María',
    price: 4,
    description: 'Centro comercial principal',
    time: '8-12 min',
    distance: '2.3 km',
    location: { lat: -9.2900, lng: -75.9950 }
  },
  {
    id: 2,
    name: 'Plaza de Armas',
    price: 3,
    description: 'Centro histórico',
    time: '5-8 min',
    distance: '1.5 km',
    location: { lat: -9.2920, lng: -75.9940 }
  },
  {
    id: 3,
    name: 'Av. Raimondi',
    price: 5,
    description: 'Avenida principal',
    time: '10-15 min',
    distance: '3.2 km',
    location: { lat: -9.2880, lng: -75.9930 }
  },
  {
    id: 4,
    name: 'Lukita',
    price: 8,
    description: 'Zona residencial',
    time: '15-20 min',
    distance: '5.8 km',
    location: { lat: -9.2800, lng: -75.9800 }
  },
];

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { currentTrip } = useTripStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Timer para la hora actual
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Determinar saludo
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Buenos días');
    } else if (hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }

    return () => clearInterval(timer);
  }, []);

  // Si hay un viaje activo, navegar a la pantalla de seguimiento
  useEffect(() => {
    if (currentTrip && currentTrip.status !== 'completed') {
      navigation.navigate('TripTracking', { tripId: currentTrip.id });
    }
  }, [currentTrip, navigation]);

  const handleRequestTrip = () => {
    navigation.navigate('TripRequest');
  };

  const handleDestinationPress = (destination: Destination) => {
    Alert.alert(
      'Solicitar Viaje',
      `¿Deseas ir a ${destination.name}?\nCosto estimado: S/ ${destination.price}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => navigation.navigate('TripRequest')
        }
      ]
    );
  };

  const renderDestinationCard = (destination: Destination) => (
    <TouchableOpacity
      key={destination.id}
      style={styles.destinationCard}
      onPress={() => handleDestinationPress(destination)}
    >
      <View style={styles.destinationInfo}>
        <View style={styles.destinationIcon}>
          <Ionicons name="location" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.destinationDetails}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationDescription}>{destination.description}</Text>
          <View style={styles.destinationMeta}>
            <Text style={styles.destinationTime}>{destination.time}</Text>
            <Text style={styles.destinationDistance}>{destination.distance}</Text>
          </View>
        </View>
        <View style={styles.destinationPrice}>
          <Text style={styles.priceText}>S/ {destination.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header de bienvenida */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>{greeting}, {user?.firstName}!</Text>
            <Text style={styles.subtitle}>¿A dónde te llevamos hoy?</Text>
          </View>
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Hora actual</Text>
            <Text style={styles.time}>
              {currentTime.toLocaleTimeString('es-PE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>

        {/* Botón principal de solicitar viaje */}
        <TouchableOpacity style={styles.mainButton} onPress={handleRequestTrip}>
          <View style={styles.mainButtonContent}>
            <View style={styles.mainButtonIcon}>
              <Ionicons name="car" size={32} color={"white"} />
            </View>
            <View style={styles.mainButtonText}>
              <Text style={styles.mainButtonTitle}>Solicitar Viaje</Text>
              <Text style={styles.mainButtonSubtitle}>Llega a tu destino de forma segura</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={"white"} />
          </View>
        </TouchableOpacity>

        {/* Ubicación actual */}
        <View style={[globalStyles.card, styles.locationCard]}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={24} color={theme.colors.success} />
            <Text style={styles.locationTitle}>Tu Ubicación Actual</Text>
          </View>
          <Text style={styles.locationAddress}>Av. Universitaria 234, Tingo María, Huánuco</Text>
        </View>

        {/* Destinos populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destinos Populares</Text>
          {DESTINATIONS.map(renderDestinationCard)}
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="car" size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.statValue}>{user?.totalTrips || 0}</Text>
            <Text style={styles.statLabel}>Viajes</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="star" size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.statValue}>{user?.rating || '5.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={20} color={theme.colors.info} />
            </View>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Min promedio</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  timeSection: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  time: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  mainButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  mainButtonText: {
    flex: 1,
  },
  mainButtonTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: "white",
    marginBottom: theme.spacing.xs,
  },
  mainButtonSubtitle: {
    fontSize: theme.fontSize.sm,
    color: "white",
    opacity: 0.9,
  },
  locationCard: {
    marginBottom: theme.spacing.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  locationAddress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  destinationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  destinationDetails: {
    flex: 1,
  },
  destinationName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  destinationDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  destinationMeta: {
    flexDirection: 'row',
  },
  destinationTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  destinationDistance: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  destinationPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default DashboardScreen;
