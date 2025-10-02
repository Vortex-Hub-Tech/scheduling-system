import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { apiRequest } from './lib/api';

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string;
  professional: {
    id: number;
    name: string;
    specialty: string;
  };
}

const { width } = Dimensions.get('window');
const imageWidth = (width - 48) / 2;

export default function GalleryScreen() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await apiRequest('GET', '/api/gallery/all');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        setError('Erro ao carregar galeria');
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Galeria</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {images.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={styles.emptyText}>Nenhuma imagem disponível no momento</Text>
          </View>
        ) : (
          <View style={styles.imagesGrid}>
            {images.map((item) => (
              <View key={item.id} style={styles.imageCard}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {item.caption && (
                  <Text style={styles.caption}>{item.caption}</Text>
                )}
                <Text style={styles.professionalName}>{item.professional.name}</Text>
                <Text style={styles.professionalSpecialty}>{item.professional.specialty}</Text>
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
  },
  imagesGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageCard: {
    width: imageWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: imageWidth,
    backgroundColor: '#e2e8f0',
  },
  caption: {
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  professionalName: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  professionalSpecialty: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 11,
    color: '#64748b',
  },
});
