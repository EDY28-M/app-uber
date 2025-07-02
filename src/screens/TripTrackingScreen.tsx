import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTripStore } from '../store';
import { RootStackParamList, TripStatus } from '../types';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

type TripTrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripTracking'>;
type TripTrackingScreenRouteProp = RouteProp<RootStackParamList, 'TripTracking'>;

interface Props {
  navigation: TripTrackingScreenNavigationProp;
  route: TripTrackingScreenRouteProp;
}

const TripTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { currentTrip, completeTrip, cancelTrip } = useTripStore();
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!currentTrip) {
      navigation.goBack();
      return;
    }

    // Simular progreso basado en el estado del viaje
    const updateProgress = () => {
      switch (currentTrip.status) {
        case 'requesting':
          setProgress(10);
          break;
        case 'driver_found':
          setProgress(25);
          break;
        case 'driver_arriving':
          setProgress(50);
          break;
        case 'driver_arrived':
          setProgress(75);
          break;
        case 'in_progress':
          setProgress(90);
          break;
        case 'completed':
          setProgress(100);
          break;
        default:
          setProgress(0);
      }
    };

    updateProgress();
  }, [currentTrip, navigation]);

  useEffect(() => {
    if (currentTrip?.status === 'completed') {
      // Auto-redirigir después de completar el viaje
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 5000);
    }
  }, [currentTrip?.status, navigation]);

  const handleCallDriver = () => {
    if (currentTrip?.driverInfo?.phone) {
      Linking.openURL(`tel:${currentTrip.driverInfo.phone}`);
    }
  };

  const handleCancelTrip = () => {
    Alert.alert(
      'Cancelar Viaje',
      '¿Estás seguro que deseas cancelar el viaje?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            if (currentTrip) {
              cancelTrip(currentTrip.id);
              navigation.navigate('Dashboard');
            }
          }
        }
      ]
    );
  };

  const handleCompleteTrip = () => {
    if (currentTrip && rating > 0) {
      completeTrip(currentTrip.id, rating);
    }
  };

  const handleRating = (stars: number) => {
    setRating(stars);
  };

  const renderStarRating = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>Califica tu experiencia</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? theme.colors.warning : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStatusContent = () => {
    if (!currentTrip) return null;

    switch (currentTrip.status) {
      case 'requesting':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.loadingIndicator}>
              <Ionicons name="car" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.statusTitle}>Buscando conductor...</Text>
            <Text style={styles.statusSubtitle}>Conectándote con conductores cercanos</Text>
            
            <View style={styles.searchInfo}>
              <Text style={styles.searchText}>🔍 Analizando conductores disponibles</Text>
              <Text style={styles.searchSubtext}>Se encontraron 3 conductores en tu área</Text>
            </View>
          </View>
        );

      case 'driver_found':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.successIndicator}>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
            </View>
            <Text style={styles.statusTitle}>¡Viaje Confirmado! ✅</Text>
            <Text style={styles.statusSubtitle}>Tu conductor está en camino hacia tu ubicación</Text>
            
            {currentTrip.driverInfo && (
              <View style={styles.driverCard}>
                <View style={styles.driverHeader}>
                  <View style={styles.driverAvatar}>
                    <Ionicons name="person" size={32} color={theme.colors.primary} />
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{currentTrip.driverInfo.name}</Text>
                    <View style={styles.driverRating}>
                      <Ionicons name="star" size={16} color={theme.colors.warning} />
                      <Text style={styles.ratingText}>{currentTrip.driverInfo.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.etaText}>Llega en 8 min</Text>
                </View>
                
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleText}>
                    {currentTrip.driverInfo.carModel} • {currentTrip.driverInfo.carColor}
                  </Text>
                  <Text style={styles.plateText}>{currentTrip.driverInfo.licensePlate}</Text>
                </View>
                
                <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                  <Ionicons name="call" size={20} color={"white"} />
                  <Text style={styles.callButtonText}>Llamar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'driver_arriving':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.movingIndicator}>
              <Ionicons name="car" size={48} color={theme.colors.info} />
            </View>
            <Text style={styles.statusTitle}>🚗 Conductor en Camino</Text>
            <Text style={styles.statusSubtitle}>
              {currentTrip.driverInfo?.name} se dirige hacia tu ubicación
            </Text>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Progreso de llegada</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>ETA: {Math.max(1, 8 - Math.floor(progress / 12))} min</Text>
            </View>
            
            {currentTrip.driverInfo && (
              <View style={styles.driverQuickInfo}>
                <Text style={styles.quickInfoText}>
                  {currentTrip.driverInfo.name} • {currentTrip.driverInfo.carModel} • {currentTrip.driverInfo.licensePlate}
                </Text>
                <TouchableOpacity style={styles.quickCallButton} onPress={handleCallDriver}>
                  <Ionicons name="call" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'driver_arrived':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.arrivedIndicator}>
              <Ionicons name="location" size={48} color={theme.colors.success} />
            </View>
            <Text style={styles.statusTitle}>🎉 ¡Conductor ha Llegado!</Text>
            <Text style={styles.statusSubtitle}>
              {currentTrip.driverInfo?.name} está en tu ubicación esperándote
            </Text>
            
            <View style={styles.arrivalAlert}>
              <Ionicons name="notifications" size={24} color={theme.colors.warning} />
              <Text style={styles.alertText}>¡Prepárate para salir!</Text>
            </View>
            
            {currentTrip.driverInfo && (
              <View style={styles.vehicleAlert}>
                <Text style={styles.vehicleAlertTitle}>🚗 Busca este vehículo:</Text>
                <Text style={styles.vehicleAlertText}>
                  {currentTrip.driverInfo.carModel} {currentTrip.driverInfo.carColor}
                </Text>
                <Text style={styles.plateAlertText}>{currentTrip.driverInfo.licensePlate}</Text>
                
                <View style={styles.contactButtons}>
                  <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                    <Ionicons name="call" size={20} color={"white"} />
                    <Text style={styles.callButtonText}>Llamar Ahora</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );

      case 'in_progress':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.progressIndicator}>
              <Ionicons name="car" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.statusTitle}>🚗 En Camino al Destino</Text>
            <Text style={styles.statusSubtitle}>
              Disfruta tu viaje hacia {currentTrip.dropoffAddress}
            </Text>
            
            <View style={styles.tripProgress}>
              <Text style={styles.progressTitle}>Progreso del viaje</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
                <View style={styles.carIcon}>
                  <Ionicons name="car" size={16} color={"white"} />
                </View>
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Origen</Text>
                <Text style={styles.progressLabel}>Destino</Text>
              </View>
            </View>
            
            <View style={styles.tripInfo}>
              <View style={styles.tripInfoRow}>
                <Text style={styles.tripInfoLabel}>Tiempo restante:</Text>
                <Text style={styles.tripInfoValue}>
                  {Math.max(1, currentTrip.estimatedDuration - Math.floor(progress / 10))} min
                </Text>
              </View>
              <View style={styles.tripInfoRow}>
                <Text style={styles.tripInfoLabel}>Conductor:</Text>
                <Text style={styles.tripInfoValue}>{currentTrip.driverInfo?.name}</Text>
              </View>
              <View style={styles.tripInfoRow}>
                <Text style={styles.tripInfoLabel}>Costo:</Text>
                <Text style={styles.tripInfoValue}>S/ {currentTrip.estimatedFare}</Text>
              </View>
            </View>
          </View>
        );

      case 'completed':
        return (
          <View style={styles.statusContainer}>
            <View style={styles.completedIndicator}>
              <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
            </View>
            <Text style={styles.statusTitle}>¡Viaje Finalizado! 🎉</Text>
            <Text style={styles.statusSubtitle}>Has llegado exitosamente a tu destino</Text>
            
            <View style={styles.tripSummary}>
              <Text style={styles.summaryTitle}>Resumen del Viaje</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Desde:</Text>
                <Text style={styles.summaryValue}>{currentTrip.pickupAddress}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hasta:</Text>
                <Text style={styles.summaryValue}>{currentTrip.dropoffAddress}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Conductor:</Text>
                <Text style={styles.summaryValue}>{currentTrip.driverInfo?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duración:</Text>
                <Text style={styles.summaryValue}>{currentTrip.estimatedDuration} min</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Pagado:</Text>
                <Text style={styles.totalValue}>S/ {currentTrip.estimatedFare}</Text>
              </View>
            </View>
            
            {renderStarRating()}
            
            <TouchableOpacity
              style={[
                globalStyles.button,
                styles.completeButton,
                rating === 0 && styles.disabledButton
              ]}
              onPress={handleCompleteTrip}
              disabled={rating === 0}
            >
              <Text style={globalStyles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  if (!currentTrip) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.centerContent, { flex: 1 }]}>
          <Text style={styles.errorText}>No hay viaje activo</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        {/* Progress bar */}
        <View style={styles.topProgressBar}>
          <View style={[styles.topProgressFill, { width: `${progress}%` }]} />
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {renderStatusContent()}
        </View>
        
        {/* Footer with actions */}
        {currentTrip.status !== 'completed' && currentTrip.status !== 'requesting' && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelTrip}
            >
              <Text style={styles.cancelButtonText}>Cancelar Viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topProgressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
  },
  topProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  successIndicator: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  movingIndicator: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.info + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  arrivedIndicator: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressIndicator: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  completedIndicator: {
    marginBottom: theme.spacing.lg,
  },
  statusTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  searchInfo: {
    backgroundColor: theme.colors.info + '20',
    borderColor: theme.colors.info + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  searchText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  searchSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  driverCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  etaText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.success,
  },
  vehicleInfo: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  vehicleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  plateText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  callButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    color: "white",
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    marginLeft: theme.spacing.sm,
  },
  progressSection: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  driverQuickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '100%',
  },
  quickInfoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  quickCallButton: {
    padding: theme.spacing.sm,
  },
  arrivalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    borderColor: theme.colors.warning + '40',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  alertText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  vehicleAlert: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  vehicleAlertTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  vehicleAlertText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  plateAlertText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    fontFamily: 'monospace',
    marginBottom: theme.spacing.lg,
  },
  contactButtons: {
    width: '100%',
  },
  tripProgress: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  carIcon: {
    position: 'absolute',
    right: 4,
    top: -4,
    width: 16,
    height: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  tripInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '100%',
  },
  tripInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  tripInfoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  tripInfoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  tripSummary: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
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
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right',
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
  ratingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  ratingTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  cancelButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: "white",
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
});

export default TripTrackingScreen;
