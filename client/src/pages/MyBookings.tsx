import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings/user'],
  });

  const { data: services = [] } = useQuery({
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

  const getServiceName = (serviceId: number) => {
    const service = services.find((s: any) => s.id === serviceId);
    return service?.name || 'Serviço';
  };

  const getProfessionalName = (professionalId: number) => {
    const prof = professionals.find((p: any) => p.id === professionalId);
    return prof?.name || 'Profissional';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'var(--success)';
      case 'completed': return 'var(--primary)';
      case 'cancelled': return 'var(--error)';
      default: return 'var(--warning)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
          Meus Agendamentos
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.125rem' }}>
          Acompanhe todos os seus agendamentos
        </p>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
              Você ainda não tem agendamentos.
            </p>
            <Link to="/services" className="btn btn-primary">
              Ver Serviços Disponíveis
            </Link>
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {bookings.map((booking: any) => (
              <div key={booking.id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                      {getServiceName(booking.serviceId)}
                    </h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {getProfessionalName(booking.professionalId)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: `${getStatusColor(booking.status)}20`,
                      color: getStatusColor(booking.status),
                    }}>
                      {getStatusText(booking.status)}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: booking.paymentStatus === 'paid' ? '#10b98120' : '#f59e0b20',
                      color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                    }}>
                      {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Data e Hora:</span>
                    <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                      {new Date(booking.bookingDate).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Valor:</span>
                    <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--success)' }}>
                      R$ {parseFloat(booking.totalAmount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600' }}>Observações:</span>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text)' }}>{booking.notes}</p>
                  </div>
                )}

                {booking.paymentStatus === 'pending' && (
                  <Link 
                    to={`/checkout/${booking.id}`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    Realizar Pagamento
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
