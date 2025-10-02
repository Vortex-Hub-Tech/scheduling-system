import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiRequest } from './lib/api';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  professional: {
    id: number;
    name: string;
    specialty: string;
  };
}

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await apiRequest('GET', '/api/reviews/all');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setError('Erro ao carregar avaliações');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getUserName = (user: Review['user']) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email.split('@')[0];
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
        <Text style={styles.title}>Avaliações</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>Nenhuma avaliação disponível no momento</Text>
          </View>
        ) : (
          <View style={styles.reviewsContainer}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.userName}>{getUserName(review.user)}</Text>
                    <Text style={styles.professionalInfo}>
                      {review.professional.name} - {review.professional.specialty}
                    </Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>{renderStars(review.rating)}</Text>
                    <Text style={styles.ratingNumber}>{review.rating}/5</Text>
                  </View>
                </View>

                {review.comment && (
                  <Text style={styles.comment}>{review.comment}</Text>
                )}

                <Text style={styles.date}>
                  {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
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
  reviewsContainer: {
    padding: 16,
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  professionalInfo: {
    fontSize: 12,
    color: '#2563eb',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  stars: {
    fontSize: 16,
    marginBottom: 2,
  },
  ratingNumber: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
