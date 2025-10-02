import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../lib/api';

export default function ServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await apiRequest('GET', '/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        setError('Erro ao carregar serviços');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nossos Serviços</Text>
      </View>

      {services.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum serviço disponível no momento</Text>
        </View>
      ) : (
        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => router.push({
                pathname: '/service-details',
                params: { id: service.id }
              })}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.servicePrice}>R$ {parseFloat(service.price).toFixed(2)}</Text>
                <Text style={styles.serviceDuration}>⏱️ {service.duration} min</Text>
              </View>
              <Text style={styles.viewDetails}>Ver detalhes →</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
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
    padding: 24,
  },
  header: {
    padding: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  servicesContainer: {
    padding: 16,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#64748b',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  viewDetails: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
});
