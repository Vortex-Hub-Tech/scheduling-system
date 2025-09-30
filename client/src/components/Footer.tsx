export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '2rem 0',
      marginTop: '4rem',
    }}>
      <div className="container text-center">
        <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          © {new Date().getFullYear()} Sistema de Agendamento Profissional
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
          Gerenciamento completo de serviços e agendamentos
        </p>
      </div>
    </footer>
  );
}
