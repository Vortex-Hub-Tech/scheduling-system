export default function Landing() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container text-center" style={{ padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Sistema de Agendamento Profissional
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Agende serviços profissionais com facilidade, segurança e praticidade
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a href="/services" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem', background: 'white', color: '#667eea' }}>
            Ver Serviços
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem', maxWidth: '1000px', margin: '4rem auto 0' }}>
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>Agendamento Fácil</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Escolha o serviço, selecione data e horário de forma simples</p>
          </div>

          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>Pagamento Seguro</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Processamento de pagamento integrado e seguro via Stripe</p>
          </div>

          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>Avaliações</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Confira avaliações de outros clientes e deixe a sua</p>
          </div>
        </div>
      </div>
    </div>
  );
}
