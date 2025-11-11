import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { isOwner, logout } = useAuth();

  const handleWhatsApp = () => {
    const phone = '5547996885117';
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os serviços.');
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${message}`);
  };

  const handleOwnerAccess = () => {
    if (isOwner) {
      logout();
    } else {
      router.push('/owner-login');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>
          Escolha entre nossos serviços profissionais e agende com facilidade
        </Text>
        <TouchableOpacity style={styles.ownerButton} onPress={handleOwnerAccess}>
          <Text style={styles.ownerText}>
            {isOwner ? '🚪 Sair do modo proprietário' : '🔐 Sou proprietário'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/services')}
        >
          <Text style={styles.cardIcon}>✂️</Text>
          <Text style={styles.cardTitle}>Ver Serviços</Text>
          <Text style={styles.cardDescription}>
            Explore todos os serviços disponíveis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/gallery')}
        >
          <Text style={styles.cardIcon}>🖼️</Text>
          <Text style={styles.cardTitle}>Galeria</Text>
          <Text style={styles.cardDescription}>
            Veja nosso portfólio de trabalhos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/reviews')}
        >
          <Text style={styles.cardIcon}>⭐</Text>
          <Text style={styles.cardTitle}>Avaliações</Text>
          <Text style={styles.cardDescription}>
            Confira o que dizem nossos clientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/my-bookings')}
        >
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Meus Agendamentos</Text>
          <Text style={styles.cardDescription}>
            Veja seus agendamentos
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
        <Text style={styles.whatsappIcon}>💬</Text>
        <Text style={styles.whatsappText}>Fale Conosco</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  ownerButton: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ownerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 3,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25d366',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsappIcon: {
    fontSize: 24,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
