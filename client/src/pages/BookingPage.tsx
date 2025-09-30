
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

type BookingStep = 'datetime' | 'contact' | 'verification' | 'confirmation';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);

  const { data: service, isLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}`],
  });

  const { data: professional } = useQuery({
    queryKey: service ? [`/api/professionals/${service.professionalId}`] : [],
    enabled: !!service,
  });

  const { data: availableSlots = [] } = useQuery({
    queryKey: service ? [`/api/available-slots/${service.professionalId}/${serviceId}`] : [],
    enabled: !!service,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/bookings', data);
      if (!res.ok) throw new Error('Failed to create booking');
      return res.json();
    },
    onSuccess: (booking) => {
      setBookingId(booking.id);
      sendVerificationCode.mutate(customerPhone);
    },
  });

  const sendVerificationCode = useMutation({
    mutationFn: async (phone: string) => {
      const res = await apiRequest('POST', '/api/send-verification', { phone });
      if (!res.ok) throw new Error('Failed to send verification code');
      return res.json();
    },
    onSuccess: () => {
      setCurrentStep('verification');
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const res = await apiRequest('POST', '/api/verify-phone', { phone, code });
      if (!res.ok) throw new Error('Invalid verification code');
      return res.json();
    },
    onSuccess: () => {
      setCurrentStep('confirmation');
    },
  });

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toDateString();
    return availableSlots.some((slot: any) => 
      new Date(slot.slotDate).toDateString() === dateStr
    );
  };

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return availableSlots.filter((slot: any) => 
      new Date(slot.slotDate).toDateString() === dateStr
    );
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '1rem' }}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isAvailable = isDateAvailable(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => !isPast && isAvailable && setSelectedDate(date)}
          disabled={isPast || !isAvailable}
          style={{
            padding: '1rem',
            border: 'none',
            borderRadius: '50%',
            background: isSelected ? 'var(--success)' : isAvailable ? 'var(--primary-light)' : 'transparent',
            color: isSelected ? 'white' : isAvailable ? 'var(--success)' : isPast ? 'var(--text-light)' : 'var(--text)',
            fontWeight: isSelected || isToday ? '700' : isAvailable ? '600' : '400',
            cursor: !isPast && isAvailable ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            width: '3rem',
            height: '3rem',
            opacity: isPast ? 0.5 : 1,
            transition: 'all 0.2s',
            border: isToday ? '2px solid var(--primary)' : 'none',
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleDateTimeSubmit = () => {
    if (!selectedSlot) {
      alert('Por favor, selecione um horário disponível');
      return;
    }
    setCurrentStep('contact');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Por favor, preencha nome e telefone');
      return;
    }

    createBookingMutation.mutate({
      serviceId: parseInt(serviceId!),
      professionalId: service.professionalId,
      slotId: selectedSlot.id,
      customerName,
      customerPhone,
      customerEmail,
      totalAmount: parseFloat(service.price),
      notes,
    });
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Por favor, digite o código de 6 dígitos');
      return;
    }

    verifyCodeMutation.mutate({
      phone: customerPhone,
      code: verificationCode,
    });
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Serviço não encontrado</h2>
      </div>
    );
  }

  const selectedDateSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Progress indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          {['datetime', 'contact', 'verification', 'confirmation'].map((step, index) => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep === step || ['contact', 'verification', 'confirmation'].includes(currentStep) && index < ['datetime', 'contact', 'verification', 'confirmation'].indexOf(currentStep) ? 'var(--primary)' : 'var(--surface)',
                color: currentStep === step || ['contact', 'verification', 'confirmation'].includes(currentStep) && index < ['datetime', 'contact', 'verification', 'confirmation'].indexOf(currentStep) ? 'white' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                border: currentStep === step ? '3px solid var(--primary)' : '2px solid var(--border)',
              }}>
                {index + 1}
              </div>
              <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {step === 'datetime' && 'Data/Hora'}
                {step === 'contact' && 'Contato'}
                {step === 'verification' && 'Verificação'}
                {step === 'confirmation' && 'Confirmação'}
              </span>
            </div>
          ))}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            height: '2px',
            background: 'var(--border)',
            zIndex: 0,
          }} />
        </div>

        <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            {service.name}
          </h3>
          {professional && (
            <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.75rem' }}>
              {professional.name}
            </p>
          )}
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            {service.description}
          </p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '1.125rem' }}>
            <div>
              <span style={{ color: 'var(--text-light)' }}>Duração: </span>
              <strong>{service.duration} minutos</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)' }}>Valor: </span>
              <strong style={{ color: 'var(--success)', fontSize: '1.25rem' }}>
                R$ {parseFloat(service.price).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        {/* Step 1: Date and Time Selection */}
        {currentStep === 'datetime' && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Selecione Data e Horário
            </h3>
            
            {/* Calendar */}
            <div style={{ marginBottom: '2rem' }}>
              {/* Calendar Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.5rem', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    color: 'var(--text)'
                  }}
                >
                  ←
                </button>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.5rem', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    color: 'var(--text)'
                  }}
                >
                  →
                </button>
              </div>

              {/* Day names */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {dayNames.map(day => (
                  <div key={day} style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-light)' }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {renderCalendar()}
              </div>
            </div>

            {/* Selected date and time slots */}
            {selectedDate && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.125rem' }}>
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                
                {selectedDateSlots.length === 0 ? (
                  <p style={{ color: 'var(--text-light)', padding: '1rem', textAlign: 'center' }}>
                    Não há horários disponíveis para esta data.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {selectedDateSlots.map((slot: any) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '0.75rem',
                          border: selectedSlot?.id === slot.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          background: selectedSlot?.id === slot.id ? 'var(--primary-light)' : 'var(--background)',
                          color: selectedSlot?.id === slot.id ? 'var(--primary)' : 'var(--text)',
                          fontWeight: selectedSlot?.id === slot.id ? '600' : '400',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {new Date(slot.slotDate).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSlot && (
              <button 
                onClick={handleDateTimeSubmit}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Continuar
              </button>
            )}
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 'contact' && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Informações de Contato
            </h3>
            
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Nome Completo *</label>
                <input
                  type="text"
                  className="input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Telefone/WhatsApp *</label>
                <input
                  type="tel"
                  className="input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  placeholder="(11) 99999-9999"
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  Enviaremos um código de verificação via SMS para este número
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">E-mail (opcional)</label>
                <input
                  type="email"
                  className="input"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Observações (opcional)</label>
                <textarea
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Alguma observação sobre o agendamento?"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setCurrentStep('datetime')}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Voltar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? 'Processando...' : 'Enviar Código SMS'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Phone Verification */}
        {currentStep === 'verification' && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Verificação do Telefone
            </h3>
            
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>
              Enviamos um código de 6 dígitos para <strong>{customerPhone}</strong>
            </p>

            <form onSubmit={handleVerificationSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Código de Verificação</label>
                <input
                  type="text"
                  className="input"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }}
                  maxLength={6}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => sendVerificationCode.mutate(customerPhone)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  disabled={sendVerificationCode.isPending}
                >
                  {sendVerificationCode.isPending ? 'Enviando...' : 'Reenviar'}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={verifyCodeMutation.isPending || verificationCode.length !== 6}
                >
                  {verifyCodeMutation.isPending ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--success)' }}>
                Agendamento Confirmado!
              </h3>
              
              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                <h4 style={{ marginBottom: '1rem' }}>Detalhes do Agendamento:</h4>
                <p><strong>Serviço:</strong> {service.name}</p>
                <p><strong>Profissional:</strong> {professional?.name}</p>
                <p><strong>Data e Hora:</strong> {selectedSlot && new Date(selectedSlot.slotDate).toLocaleString('pt-BR')}</p>
                <p><strong>Valor:</strong> R$ {parseFloat(service.price).toFixed(2)}</p>
                <p><strong>Contato:</strong> {customerPhone}</p>
              </div>

              <div style={{ padding: '1rem', background: '#e6f3ff', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                <p style={{ color: '#0066cc', fontSize: '0.875rem' }}>
                  📱 Você receberá um lembrete via WhatsApp 2 dias antes do seu agendamento.
                </p>
              </div>

              <button 
                onClick={() => navigate('/services')}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Fazer Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
