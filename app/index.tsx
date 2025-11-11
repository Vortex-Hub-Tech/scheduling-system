
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppConfig } from './contexts/AppConfigContext';

export default function HomeScreen() {
  const router = useRouter();
  const { isOwnerMode } = useAppConfig();

  const clientCards = [
    {
      id: 'services',
      title: 'Serviços',
      icon: '✂️',
      description: 'Veja todos os serviços disponíveis',
      route: '/(tabs)/explore',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 'booking',
      title: 'Agendar',
      icon: '📅',
      description: 'Faça seu agendamento',
      route: '/(tabs)/explore',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'my-bookings',
      title: 'Meus Agendamentos',
      icon: '📋',
      description: 'Consulte seus agendamentos',
      route: '/my-bookings',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'gallery',
      title: 'Galeria',
      icon: '🖼️',
      description: 'Veja nossos trabalhos',
      route: '/gallery',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const ownerCards = [
    {
      id: 'services',
      title: 'Gerenciar Serviços',
      icon: '✂️',
      description: 'Adicionar, editar ou remover serviços',
      route: '/(tabs)/explore',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 'professionals',
      title: 'Profissionais',
      icon: '👥',
      description: 'Gerenciar profissionais',
      route: '/(tabs)',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'bookings',
      title: 'Agendamentos',
      icon: '📅',
      description: 'Ver todos os agendamentos',
      route: '/my-bookings',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'hours',
      title: 'Horários',
      icon: '🕐',
      description: 'Configurar horários de trabalho',
      route: '/(tabs)',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const cards = isOwnerMode ? ownerCards : clientCards;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isOwnerMode ? '👨‍💼 Modo Proprietário' : '🎯 Bem-vindo!'}
        </Text>
        <Text style={styles.subtitle}>
          {isOwnerMode 
            ? 'Gerencie seu negócio' 
            : 'Agende seus serviços com facilidade'}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { 
                  backgroundColor: card.gradient[0],
                  marginTop: index % 2 === 0 ? 0 : 20,
                }
              ]}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </View>
              <View style={styles.cardArrow}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoTitle}>Rápido e Fácil</Text>
            <Text style={styles.infoText}>
              {isOwnerMode 
                ? 'Gerencie tudo em um só lugar'
                : 'Agende em poucos cliques'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔔</Text>
            <Text style={styles.infoTitle}>Notificações</Text>
            <Text style={styles.infoText}>
              {isOwnerMode
                ? 'Receba alertas de novos agendamentos'
                : 'Lembretes automáticos'}
            </Text>
          </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    minHeight: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#f0f0f0',
    lineHeight: 18,
  },
  cardArrow: {
    alignItems: 'flex-end',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
