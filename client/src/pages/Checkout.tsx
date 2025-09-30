import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '../lib/queryClient';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

function CheckoutForm({ booking }: { booking: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-bookings`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Erro ao processar pagamento');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <PaymentElement />
      </div>
      {error && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={!stripe || processing}
      >
        {processing ? 'Processando...' : `Pagar R$ ${parseFloat(booking.totalAmount).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings/user'],
  });

  const booking = bookings.find((b: any) => b.id === parseInt(bookingId || '0'));

  const { data: service } = useQuery({
    queryKey: booking ? [`/api/services/${booking.serviceId}`] : [],
    enabled: !!booking,
  });

  const { data: professional } = useQuery({
    queryKey: booking ? [`/api/professionals/${booking.professionalId}`] : [],
    enabled: !!booking,
  });

  useEffect(() => {
    if (bookingId) {
      apiRequest('POST', '/api/create-payment-intent', {
        amount: booking?.totalAmount || 0,
        bookingId: parseInt(bookingId),
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          setPaymentError(err.message || 'Erro ao inicializar pagamento');
        });
    }
  }, [bookingId, booking]);

  if (!stripePromise) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>⚠️ Pagamento Não Configurado</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            O sistema de pagamento ainda não foi configurado. Entre em contato com o administrador.
          </p>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-outline">
            Voltar para Agendamentos
          </button>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Erro no Pagamento</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{paymentError}</p>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-outline">
            Voltar para Agendamentos
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !clientSecret) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
          Pagamento
        </h1>

        <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Resumo do Agendamento
          </h3>
          {service && (
            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Serviço:</strong> {service.name}
            </div>
          )}
          {professional && (
            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Profissional:</strong> {professional.name}
            </div>
          )}
          {booking && (
            <>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Data e Hora:</strong>{' '}
                {new Date(booking.bookingDate).toLocaleString('pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </div>
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid var(--border)',
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'var(--success)',
              }}>
                Total: R$ {parseFloat(booking.totalAmount).toFixed(2)}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Informações de Pagamento
          </h3>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm booking={booking} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
