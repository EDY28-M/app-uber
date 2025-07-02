import React, { useState } from 'react';
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

import { useTripStore } from '../store';
import { RootStackParamList, Destination } from '../types';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

type TripRequestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripRequest'>;

interface Props {
  navigation: TripRequestScreenNavigationProp;
}

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

const TripRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const { createTrip, isLoading } = useTripStore();

  const handleRequestTrip = async () => {
    if (!selectedDestination) {
      Alert.alert('Error', 'Por favor selecciona un destino');
      return;
    }

    try {
      await createTrip({
        destination: selectedDestination,
        pickupLocation: { lat: -9.2944, lng: -75.9969 }, // Ubicación actual simulada
        pickupAddress: 'Av. Universitaria 234, Tingo María, Huánuco',
        paymentMethod: selectedPayment,
      });

      navigation.navigate('TripTracking', { tripId: 'current' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo solicitar el viaje');
    }
  };

  const renderDestinationOption = (destination: Destination) => (
    <TouchableOpacity
      key={destination.id}
      style={[
        styles.destinationOption,
        selectedDestination?.id === destination.id && styles.selectedDestination
      ]}
      onPress={() => setSelectedDestination(destination)}
    >
      <View style={styles.destinationContent}>
        <View style={styles.destinationIcon}>
          <Ionicons 
            name="location" 
            size={24} 
            color={selectedDestination?.id === destination.id ? theme.colors.primary : theme.colors.textSecondary} 
          />
        </View>
        <View style={styles.destinationDetails}>
          <Text style={[
            styles.destinationName,
            selectedDestination?.id === destination.id && styles.selectedText
          ]}>
            {destination.name}
          </Text>
          <Text style={styles.destinationDescription}>{destination.description}</Text>
          <View style={styles.destinationMeta}>
            <Text style={styles.metaText}>{destination.time}</Text>
            <Text style={styles.metaText}>{destination.distance}</Text>
          </View>
        </View>
        <View style={styles.destinationPrice}>
          <Text style={[
            styles.priceText,
            selectedDestination?.id === destination.id && styles.selectedPrice
          ]}>
            S/ {destination.price}
          </Text>
        </View>
      </View>
      {selectedDestination?.id === destination.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderPaymentOption = (method: string, icon: string, label: string) => (
    <TouchableOpacity
      key={method}
      style={[
        styles.paymentOption,
        selectedPayment === method && styles.selectedPayment
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <Ionicons 
        name={icon as any} 
        size={24} 
        color={selectedPayment === method ? theme.colors.primary : theme.colors.textSecondary} 
      />
      <Text style={[
        styles.paymentText,
        selectedPayment === method && styles.selectedPaymentText
      ]}>
        {label}
      </Text>
      {selectedPayment === method && (
        <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Origen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Origen</Text>
          <View style={styles.originCard}>
            <View style={styles.originIcon}>
              <Ionicons name="location" size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.originText}>Av. Universitaria 234, Tingo María, Huánuco</Text>
          </View>
        </View>

        {/* Destinos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona tu destino</Text>
          {DESTINATIONS.map(renderDestinationOption)}
        </View>

        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          {renderPaymentOption('cash', 'cash', 'Efectivo')}
          {renderPaymentOption('card', 'card', 'Tarjeta')}
          {renderPaymentOption('digital_wallet', 'wallet', 'Billetera digital')}
        </View>

        {/* Resumen */}
        {selectedDestination && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumen del viaje</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Destino:</Text>
              <Text style={styles.summaryValue}>{selectedDestination.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiempo estimado:</Text>
              <Text style={styles.summaryValue}>{selectedDestination.time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Distancia:</Text>
              <Text style={styles.summaryValue}>{selectedDestination.distance}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Costo total:</Text>
              <Text style={styles.totalValue}>S/ {selectedDestination.price}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón de confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.confirmButton,
            (!selectedDestination || isLoading) && styles.disabledButton
          ]}
          onPress={handleRequestTrip}
          disabled={!selectedDestination || isLoading}
        >
          <Text style={globalStyles.buttonText}>
            {isLoading ? 'Solicitando viaje...' : 'Confirmar Viaje'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
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
  originCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '20',
    borderColor: theme.colors.success + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  originIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  originText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  destinationOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  selectedDestination: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  destinationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
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
  selectedText: {
    color: theme.colors.primary,
  },
  destinationDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  destinationMeta: {
    flexDirection: 'row',
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  destinationPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  selectedPrice: {
    color: theme.colors.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  selectedPayment: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  paymentText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  selectedPaymentText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  summary: {
    backgroundColor: theme.colors.info + '10',
    borderColor: theme.colors.info + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  totalRow: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  confirmButton: {
    height: 50,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default TripRequestScreen;
