import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: professionals = [] } = useQuery({
    queryKey: ['/api/professionals'],
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

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
          Serviços Disponíveis
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.125rem' }}>
          Escolha o serviço ideal para você e agende agora mesmo
        </p>

        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
              Nenhum serviço disponível no momento.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {services.map((service: any) => (
              <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text)' }}>
                    {service.name}
                  </h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    {getProfessionalName(service.professionalId)}
                  </p>
                  {service.description && (
                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.6' }}>
                      {service.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)' }}>Duração:</span>
                      <strong style={{ marginLeft: '0.5rem', color: 'var(--text)' }}>
                        {service.duration} min
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)' }}>Preço:</span>
                      <strong style={{ marginLeft: '0.5rem', color: 'var(--success)', fontSize: '1.125rem' }}>
                        R$ {parseFloat(service.price).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
                <Link 
                  to={`/booking/${service.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  Agendar Agora
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
