
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppConfig } from '../contexts/AppConfigContext';
import { apiRequest } from '../lib/api';

interface OwnerStats {
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthRevenue: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { isOwnerMode } = useAppConfig();
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('GET', '/api/owner/stats/1');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Não foi possível carregar as estatísticas');
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOwnerMode) {
      loadStats();
    }
  }, [isOwnerMode]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (isOwnerMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Visão geral do seu negócio</Text>
        </View>

        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Carregando estatísticas...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#667eea' }]}>
                  <Text style={styles.statIcon}>📅</Text>
                  <Text style={styles.statValue}>{stats?.todayBookings || 0}</Text>
                  <Text style={styles.statLabel}>Agendamentos Hoje</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#f093fb' }]}>
                  <Text style={styles.statIcon}>⏳</Text>
                  <Text style={styles.statValue}>{stats?.pendingBookings || 0}</Text>
                  <Text style={styles.statLabel}>Pendentes</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#4facfe' }]}>
                  <Text style={styles.statIcon}>✅</Text>
                  <Text style={styles.statValue}>{stats?.confirmedBookings || 0}</Text>
                  <Text style={styles.statLabel}>Confirmados</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#43e97b' }]}>
                  <Text style={styles.statIcon}>💰</Text>
                  <Text style={styles.statValue}>
                    R$ {stats?.monthRevenue ? Number(stats.monthRevenue).toFixed(2) : '0.00'}
                  </Text>
                  <Text style={styles.statLabel}>Receita do Mês</Text>
                </View>
              </View>

              <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/categories')}
                >
                  <Text style={styles.actionIcon}>🎨</Text>
                  <Text style={styles.actionText}>Categorias</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/explore')}
                >
                  <Text style={styles.actionIcon}>➕</Text>
                  <Text style={styles.actionText}>Novo Serviço</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/my-bookings')}
                >
                  <Text style={styles.actionIcon}>📋</Text>
                  <Text style={styles.actionText}>Ver Agendamentos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/gallery')}
                >
                  <Text style={styles.actionIcon}>⚙️</Text>
                  <Text style={styles.actionText}>Configurações</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bem-vindo!</Text>
        <Text style={styles.headerSubtitle}>O que você gostaria de fazer?</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity 
          style={styles.heroCard}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.heroIcon}>✂️</Text>
          <Text style={styles.heroTitle}>Agendar Serviço</Text>
          <Text style={styles.heroText}>Escolha um serviço e agende agora mesmo</Text>
        </TouchableOpacity>

        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/my-bookings')}
          >
            <Text style={styles.featureIcon}>📅</Text>
            <Text style={styles.featureTitle}>Meus Agendamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/gallery')}
          >
            <Text style={styles.featureIcon}>🖼️</Text>
            <Text style={styles.featureTitle}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/reviews')}
          >
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureTitle}>Avaliações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
});
