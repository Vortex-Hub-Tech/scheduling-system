import { useQuery } from '@tanstack/react-query';

export default function Reviews() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['/api/reviews'],
  });

  const { data: professionals = [] } = useQuery({
    queryKey: ['/api/professionals'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    enabled: false,
  });

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const getProfessionalName = (professionalId: number) => {
    const prof = professionals.find((p: any) => p.id === professionalId);
    return prof?.name || 'Profissional';
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
          Avaliações dos Clientes
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.125rem' }}>
          Veja o que nossos clientes têm a dizer sobre nossos serviços
        </p>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐</div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
              Ainda não há avaliações. Seja o primeiro a avaliar nossos serviços!
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {reviews.map((review: any) => (
              <div key={review.id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {renderStars(review.rating)}
                    </div>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                      {getProfessionalName(review.professionalId)}
                    </p>
                  </div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && (
                  <p style={{ color: 'var(--text)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
