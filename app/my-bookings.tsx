import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiRequest } from './lib/api';

interface Booking {
  id: number;
  bookingDate: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  service: {
    name: string;
    duration: number;
  };
  professional: {
    name: string;
    specialty: string;
  };
}

export default function MyBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const loadBookings = async () => {
    if (!searchPhone) {
      Alert.alert('Atenção', 'Digite seu telefone para buscar seus agendamentos');
      return;
    }

    const cleanPhone = searchPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Erro', 'Telefone inválido. Digite um telefone válido.');
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    try {
      setError(null);
      const res = await apiRequest('GET', `/api/bookings/phone/${encodeURIComponent(cleanPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError('Nenhum agendamento encontrado para este telefone');
        setBookings([]);
      }
    } catch (err: any) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#2563eb';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#f59e0b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Agendamentos</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
      >
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Digite seu telefone para buscar seus agendamentos:</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Telefone (47999999999)"
            value={searchPhone}
            onChangeText={setSearchPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={loadBookings}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar Agendamentos</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && hasSearched && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {hasSearched && bookings.length === 0 && !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.exploreButtonText}>Ver Serviços</Text>
            </TouchableOpacity>
          </View>
        ) : hasSearched && bookings.length > 0 ? (
          <View style={styles.bookingsContainer}>
            {bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.serviceName}>{booking.service.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <Text style={styles.detailRow}>
                    👨‍💼 {booking.professional.name} - {booking.professional.specialty}
                  </Text>
                  <Text style={styles.detailRow}>
                    📅 {new Date(booking.bookingDate).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.detailRow}>
                    🕐 {new Date(booking.bookingDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.detailRow}>
                    ⏱️ {booking.service.duration} minutos
                  </Text>
                  <Text style={styles.detailRow}>
                    💰 R$ {parseFloat(booking.totalAmount).toFixed(2)}
                  </Text>
                </View>

                {booking.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>📝 Observações:</Text>
                    <Text style={styles.notesText}>{booking.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 16,
  },
  backIconText: {
    fontSize: 28,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingsContainer: {
    padding: 16,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    fontSize: 14,
    color: '#64748b',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#1e293b',
  },
});
