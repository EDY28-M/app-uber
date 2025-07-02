import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTripStore } from '../store/tripStore';
import { Trip, TripStatus } from '../types';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const getStatusColor = (status: TripStatus) => {
  switch (status) {
    case 'completed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    case 'in_progress':
      return theme.colors.info;
    default:
      return theme.colors.textSecondary;
  }
};

const getStatusText = (status: TripStatus) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'in_progress':
      return 'In Progress';
    case 'driver_arriving':
      return 'Driver Arriving';
    case 'driver_arrived':
      return 'Driver Arrived';
    case 'driver_found':
      return 'Driver Found';
    case 'requesting':
      return 'Requesting';
    default:
      return status;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function TripHistoryScreen() {
  const { tripHistory } = useTripStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filteredTrips = tripHistory.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const FilterButton = ({ title, value, isActive }: {
    title: string;
    value: 'all' | 'completed' | 'cancelled';
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TripCard = ({ trip }: { trip: Trip }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripRoute}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: theme.colors.success }]} />
            <Text style={styles.addressText} numberOfLines={1}>
              {trip.pickupAddress}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: theme.colors.error }]} />
            <Text style={styles.addressText} numberOfLines={1}>
              {trip.destination.name}
            </Text>
          </View>
        </View>
        <View style={styles.tripMeta}>
          <Text style={styles.tripDate}>{formatDate(trip.createdAt)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.driverInfo}>
          <Image
            source={{
              uri: trip.driverInfo?.photo || 'https://via.placeholder.com/40x40/007AFF/FFFFFF?text=D'
            }}
            style={styles.driverPhoto}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{trip.driverInfo?.name}</Text>
            <View style={styles.driverRating}>
              <Ionicons name="star" size={12} color={theme.colors.warning} />
              <Text style={styles.ratingText}>{trip.driverInfo?.rating}</Text>
              <Text style={styles.carInfo}>
                • {trip.driverInfo?.carColor} {trip.driverInfo?.carModel}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tripStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{trip.destination.time}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{trip.destination.distance}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="card-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{formatCurrency(trip.fare)}</Text>
          </View>
        </View>

        {trip.rating && (
          <View style={styles.tripRating}>
            <Text style={styles.ratingLabel}>Your rating:</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= trip.rating! ? "star" : "star-outline"}
                  size={16}
                  color={theme.colors.warning}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>No trips yet</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all' 
          ? 'Start your first trip to see it here'
          : `No ${filter} trips found`
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trip History</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <FilterButton title="All" value="all" isActive={filter === 'all'} />
          <FilterButton title="Completed" value="completed" isActive={filter === 'completed'} />
          <FilterButton title="Cancelled" value="cancelled" isActive={filter === 'cancelled'} />
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{tripHistory.length}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {formatCurrency(tripHistory.reduce((sum, trip) => sum + trip.fare, 0))}
            </Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {tripHistory.filter(trip => trip.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Trip List */}
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TripCard trip={item} />}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  filterButtonTextActive: {
    color: '"white"',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  tripCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    marginBottom: theme.spacing.md,
  },
  tripRoute: {
    marginBottom: theme.spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginLeft: 4,
    marginVertical: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tripDetails: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  driverPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  carInfo: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  tripRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  stars: {
    flexDirection: 'row',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
