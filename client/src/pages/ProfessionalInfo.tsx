import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function ProfessionalInfo() {
  const { id } = useParams();

  const { data: professional, isLoading } = useQuery({
    queryKey: [`/api/professionals/${id}`],
  });

  const { data: services = [] } = useQuery({
    queryKey: [`/api/services/professional/${id}`],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/reviews/professional/${id}`],
    enabled: !!id,
  });

  const { data: galleryImages = [] } = useQuery({
    queryKey: [`/api/gallery/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Profissional não encontrado</h2>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: professional.profileImage ? '300px 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
            {professional.profileImage && (
              <img 
                src={professional.profileImage} 
                alt={professional.name}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '0.75rem' }}
              />
            )}
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {professional.name}
              </h1>
              <p style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                {professional.specialty}
              </p>
              {professional.description && (
                <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                  {professional.description}
                </p>
              )}
              
              {reviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{renderStars(parseFloat(averageRating))}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)' }}>
                    {averageRating}
                  </span>
                  <span style={{ color: 'var(--text-light)' }}>
                    ({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})
                  </span>
                </div>
              )}

              {professional.phone && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Telefone:</strong> {professional.phone}
                </div>
              )}
              {professional.email && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Email:</strong> {professional.email}
                </div>
              )}
              {professional.address && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <strong>Endereço:</strong> {professional.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {services.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Serviços Oferecidos
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {services.map((service: any) => (
                <div key={service.id} className="card">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                    {service.name}
                  </h3>
                  {service.description && (
                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                      {service.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-light)' }}>{service.duration} min</span>
                    <span style={{ color: 'var(--success)', fontSize: '1.25rem', fontWeight: '700' }}>
                      R$ {parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                  <Link to={`/booking/${service.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                    Agendar
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Galeria
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {galleryImages.map((image: any) => (
                <div key={image.id} style={{ overflow: 'hidden', borderRadius: '0.75rem' }}>
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption || 'Gallery image'} 
                    style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Avaliações
            </h2>
            {reviews.slice(0, 5).map((review: any) => (
              <div key={review.id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{renderStars(review.rating)}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && (
                  <p style={{ color: 'var(--text)', lineHeight: '1.6' }}>{review.comment}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
