import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data: professionals = [], isLoading } = useQuery({
    queryKey: ['/api/professionals'],
  });

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bem-vindo ao Sistema de Agendamentos
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            Escolha entre nossos serviços profissionais e agende com facilidade
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <Link to="/services" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✂️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Ver Serviços</h3>
            <p style={{ color: 'var(--text-light)' }}>Explore todos os serviços disponíveis</p>
          </Link>

          <Link to="/gallery" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Galeria</h3>
            <p style={{ color: 'var(--text-light)' }}>Veja nosso portfólio de trabalhos</p>
          </Link>

          <Link to="/reviews" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Avaliações</h3>
            <p style={{ color: 'var(--text-light)' }}>Confira o que dizem nossos clientes</p>
          </Link>

          <Link to="/my-bookings" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Meus Agendamentos</h3>
            <p style={{ color: 'var(--text-light)' }}>Acompanhe seus agendamentos</p>
          </Link>
        </div>

        {professionals.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>
              Profissionais
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {professionals.map((prof: any) => (
                <Link key={prof.id} to={`/professional/${prof.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {prof.profileImage && (
                    <img src={prof.profileImage} alt={prof.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                  )}
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{prof.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{prof.specialty}</p>
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>{prof.description?.substring(0, 100)}...</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
