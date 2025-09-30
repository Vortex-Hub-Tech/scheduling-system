import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/AdminLogin';

function AdminHome() {
  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });
  const { data: services = [] } = useQuery({ queryKey: ['/api/services'] });
  const { data: bookings = [] } = useQuery({ queryKey: ['/api/bookings'] });
  const { data: reviews = [] } = useQuery({ queryKey: ['/api/reviews'] });

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Painel Administrativo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{professionals.length}</div>
          <div style={{ fontSize: '1.125rem' }}>Profissionais</div>
        </div>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✂️</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{services.length}</div>
          <div style={{ fontSize: '1.125rem' }}>Serviços</div>
        </div>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📅</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{bookings.length}</div>
          <div style={{ fontSize: '1.125rem' }}>Agendamentos</div>
        </div>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{reviews.length}</div>
          <div style={{ fontSize: '1.125rem' }}>Avaliações</div>
        </div>
      </div>
    </div>
  );
}

function ManageProfessionals() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', specialty: '', description: '', email: '', phone: '', address: '', profileImage: ''
  });

  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/professionals', data);
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const res = await apiRequest('PUT', `/api/professionals/${id}`, data);
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/professionals/${id}`);
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
    },
  });

  const resetForm = () => {
    setEditing(null);
    setFormData({ name: '', specialty: '', description: '', email: '', phone: '', address: '', profileImage: '' });
  };

  const handleEdit = (prof: any) => {
    setEditing(prof);
    setFormData(prof);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Gerenciar Profissionais</h2>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Editar' : 'Adicionar'} Profissional</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <input className="input" placeholder="Nome*" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <input className="input" placeholder="Especialidade*" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} required />
          <input className="input" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <input className="input" placeholder="Telefone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <textarea className="input" style={{ marginTop: '1rem' }} placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
        <input className="input" style={{ marginTop: '1rem' }} placeholder="Endereço" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
        <input className="input" style={{ marginTop: '1rem' }} placeholder="URL da Imagem de Perfil" value={formData.profileImage} onChange={e => setFormData({ ...formData, profileImage: e.target.value })} />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary">{editing ? 'Atualizar' : 'Criar'}</button>
          {editing && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {professionals.map((prof: any) => (
          <div key={prof.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{prof.name}</h4>
              <p style={{ color: 'var(--text-light)' }}>{prof.specialty}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(prof)} className="btn btn-outline">Editar</button>
              <button onClick={() => deleteMutation.mutate(prof.id)} className="btn" style={{ background: 'var(--error)', color: 'white' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageBusinessHours() {
  const queryClient = useQueryClient();
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [businessHours, setBusinessHours] = useState([
    { dayOfWeek: 0, startTime: '', endTime: '', isActive: false }, // Domingo
    { dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isActive: true }, // Segunda
    { dayOfWeek: 2, startTime: '09:00', endTime: '19:00', isActive: true }, // Terça
    { dayOfWeek: 3, startTime: '09:00', endTime: '19:00', isActive: true }, // Quarta
    { dayOfWeek: 4, startTime: '09:00', endTime: '19:00', isActive: true }, // Quinta
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true }, // Sexta
    { dayOfWeek: 6, startTime: '', endTime: '', isActive: false }, // Sábado
  ]);

  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });

  const { data: existingHours = [] } = useQuery({
    queryKey: selectedProfessional ? [`/api/business-hours/${selectedProfessional}`] : [],
    enabled: !!selectedProfessional,
    onSuccess: (data) => {
      if (data.length > 0) {
        const updatedHours = businessHours.map(day => {
          const existing = data.find((h: any) => h.dayOfWeek === day.dayOfWeek);
          return existing ? existing : day;
        });
        setBusinessHours(updatedHours);
      }
    },
  });

  const saveBusinessHoursMutation = useMutation({
    mutationFn: async (hours: any[]) => {
      const res = await apiRequest('POST', `/api/business-hours/${selectedProfessional}`, { hours });
      if (!res.ok) throw new Error('Failed to save business hours');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/business-hours/${selectedProfessional}`] });
      alert('Horários de funcionamento salvos com sucesso!');
    },
  });

  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime' | 'isActive', value: any) => {
    setBusinessHours(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const handleSave = () => {
    if (!selectedProfessional) {
      alert('Selecione um profissional');
      return;
    }

    const activeHours = businessHours.filter(hour => hour.isActive);
    saveBusinessHoursMutation.mutate(activeHours);
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Gerenciar Horários de Funcionamento</h2>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Definir Horários</h3>

        <div style={{ marginBottom: '2rem' }}>
          <select className="input" value={selectedProfessional} onChange={e => setSelectedProfessional(e.target.value)}>
            <option value="">Selecione o Profissional</option>
            {professionals.map((prof: any) => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
        </div>

        {selectedProfessional && (
          <div>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {businessHours.map((day, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--bg-light)', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: '600' }}>{dayNames[day.dayOfWeek]}</div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={day.isActive}
                      onChange={e => handleTimeChange(index, 'isActive', e.target.checked)}
                    />
                    Ativo
                  </label>

                  <input
                    type="time"
                    className="input"
                    value={day.startTime}
                    onChange={e => handleTimeChange(index, 'startTime', e.target.value)}
                    disabled={!day.isActive}
                    placeholder="Abertura"
                  />

                  <input
                    type="time"
                    className="input"
                    value={day.endTime}
                    onChange={e => handleTimeChange(index, 'endTime', e.target.value)}
                    disabled={!day.isActive}
                    placeholder="Fechamento"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saveBusinessHoursMutation.isPending}
            >
              {saveBusinessHoursMutation.isPending ? 'Salvando...' : 'Salvar Horários'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ManageAvailableSlots() {
  const queryClient = useQueryClient();
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [generateDays, setGenerateDays] = useState(7);

  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });
  const { data: services = [] } = useQuery({ queryKey: ['/api/services'] });

  const filteredServices = services.filter((service: any) => 
    selectedProfessional ? service.professionalId === parseInt(selectedProfessional) : false
  );

  const { data: availableSlots = [] } = useQuery({
    queryKey: selectedProfessional && selectedService ? [`/api/available-slots/${selectedProfessional}/${selectedService}`] : [],
    enabled: !!(selectedProfessional && selectedService),
  });

  const createSlotsMutation = useMutation({
    mutationFn: async (slots: any[]) => {
      const promises = slots.map(slot => 
        apiRequest('POST', '/api/available-slots', slot)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/available-slots/${selectedProfessional}/${selectedService}`] });
      setTimeSlots([]);
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: number) => {
      const res = await apiRequest('DELETE', `/api/available-slots/${slotId}`);
      if (!res.ok) throw new Error('Failed to delete slot');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/available-slots/${selectedProfessional}/${selectedService}`] });
    },
  });

  const generateSlotsMutation = useMutation({
    mutationFn: async ({ professionalId, serviceId, date }: any) => {
      const res = await apiRequest('POST', `/api/generate-slots/${professionalId}/${serviceId}`, { date });
      if (!res.ok) throw new Error('Failed to generate slots');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/available-slots/${selectedProfessional}/${selectedService}`] });
      alert('Horários gerados com sucesso!');
    },
  });

  const generateSlotsForDays = async () => {
    if (!selectedProfessional || !selectedService) {
      alert('Selecione profissional e serviço');
      return;
    }

    const startDate = selectedDate ? new Date(selectedDate) : new Date();
    
    for (let i = 0; i < generateDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      try {
        await generateSlotsMutation.mutateAsync({
          professionalId: parseInt(selectedProfessional),
          serviceId: parseInt(selectedService),
          date: currentDate.toISOString(),
        });
      } catch (error) {
        console.error(`Error generating slots for ${currentDate.toDateString()}:`, error);
      }
    }
  };

  const handleCreateSlots = () => {
    if (!selectedProfessional || !selectedService || timeSlots.length === 0) return;

    createSlotsMutation.mutate(timeSlots);
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Gerenciar Horários Disponíveis</h2>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Criar Novos Horários</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <select className="input" value={selectedProfessional} onChange={e => setSelectedProfessional(e.target.value)}>
            <option value="">Selecione o Profissional</option>
            {professionals.map((prof: any) => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>

          <select className="input" value={selectedService} onChange={e => setSelectedService(e.target.value)} disabled={!selectedProfessional}>
            <option value="">Selecione o Serviço</option>
            {filteredServices.map((service: any) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>

          <input 
            type="date" 
            className="input" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Data Inicial</label>
            <input 
              type="date" 
              className="input" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Quantidade de Dias</label>
            <input type="number" className="input" value={generateDays} onChange={e => setGenerateDays(parseInt(e.target.value))} min="1" max="30" />
          </div>
        </div>

        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e6f3ff', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#0066cc', margin: 0 }}>
            📅 Os horários serão gerados automaticamente baseados nos horários de funcionamento configurados para este profissional.
          </p>
        </div>

        <button 
          onClick={generateSlotsForDays} 
          className="btn btn-primary" 
          disabled={generateSlotsMutation.isPending || !selectedProfessional || !selectedService}
        >
          {generateSlotsMutation.isPending ? 'Gerando...' : `Gerar Horários para ${generateDays} dias`}
        </button>
      </div>

      {selectedProfessional && selectedService && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Horários Existentes</h3>
          {availableSlots.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>Nenhum horário disponível encontrado.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {availableSlots.map((slot: any) => (
                <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: '600' }}>
                      {new Date(slot.slotDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ marginLeft: '1rem' }}>
                      {new Date(slot.slotDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {slot.isBooked && (
                      <span style={{ marginLeft: '1rem', color: 'var(--error)', fontSize: '0.875rem' }}>(Reservado)</span>
                    )}
                  </div>
                  {!slot.isBooked && (
                    <button 
                      onClick={() => deleteSlotMutation.mutate(slot.id)}
                      className="btn"
                      style={{ background: 'var(--error)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ManageServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    professionalId: '', name: '', description: '', price: '', duration: ''
  });

  const { data: services = [] } = useQuery({ queryKey: ['/api/services'] });
  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/services', data);
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const res = await apiRequest('PUT', `/api/services/${id}`, data);
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/services/${id}`);
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
    },
  });

  const resetForm = () => {
    setEditing(null);
    setFormData({ professionalId: '', name: '', description: '', price: '', duration: '' });
  };

  const handleEdit = (service: any) => {
    setEditing(service);
    setFormData(service);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, professionalId: parseInt(formData.professionalId), price: parseFloat(formData.price), duration: parseInt(formData.duration) };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Gerenciar Serviços</h2>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Editar' : 'Adicionar'} Serviço</h3>
        <select className="input" value={formData.professionalId} onChange={e => setFormData({ ...formData, professionalId: e.target.value })} required>
          <option value="">Selecione o Profissional</option>
          {professionals.map((prof: any) => (
            <option key={prof.id} value={prof.id}>{prof.name}</option>
          ))}
        </select>
        <input className="input" style={{ marginTop: '1rem' }} placeholder="Nome do Serviço*" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
        <textarea className="input" style={{ marginTop: '1rem' }} placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <input className="input" type="number" step="0.01" placeholder="Preço (R$)*" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
          <input className="input" type="number" placeholder="Duração (minutos)*" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary">{editing ? 'Atualizar' : 'Criar'}</button>
          {editing && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {services.map((service: any) => (
          <div key={service.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{service.name}</h4>
              <p style={{ color: 'var(--text-light)' }}>R$ {parseFloat(service.price).toFixed(2)} - {service.duration} min</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(service)} className="btn btn-outline">Editar</button>
              <button onClick={() => deleteMutation.mutate(service.id)} className="btn" style={{ background: 'var(--error)', color: 'white' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageBookings() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: bookings = [] } = useQuery({ queryKey: ['/api/bookings'] });
  const { data: services = [] } = useQuery({ queryKey: ['/api/services'] });
  const { data: professionals = [] } = useQuery({ queryKey: ['/api/professionals'] });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const res = await apiRequest('PUT', `/api/bookings/${id}`, data);
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
  });

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

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    updateBookingMutation.mutate({
      id: bookingId,
      data: { status: newStatus }
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Gerenciar Agendamentos</h2>

      <div style={{ marginBottom: '2rem' }}>
        <select className="input" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredBookings.map((booking: any) => (
          <div key={booking.id} className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {getServiceName(booking.serviceId)}
                </h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                  {getProfessionalName(booking.professionalId)}
                </p>
              </div>

              <div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Cliente</p>
                <p style={{ fontSize: '0.875rem' }}>{booking.customerName || 'Não informado'}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{booking.customerPhone}</p>
                {booking.customerEmail && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{booking.customerEmail}</p>
                )}
              </div>

              <div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Data e Hora</p>
                <p style={{ fontSize: '0.875rem' }}>
                  {new Date(booking.bookingDate).toLocaleDateString('pt-BR')}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {new Date(booking.bookingDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Valor</p>
                <p style={{ fontSize: '1.125rem', color: 'var(--success)', fontWeight: '700' }}>
                  R$ {parseFloat(booking.totalAmount).toFixed(2)}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                  Pagamento: {booking.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Status:</span>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  backgroundColor: getStatusColor(booking.status),
                  color: 'white'
                }}>
                  {booking.status === 'pending' ? 'Pendente' : 
                   booking.status === 'confirmed' ? 'Confirmado' :
                   booking.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
                {booking.phoneVerified && (
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--success)',
                    color: 'white'
                  }}>
                    ✓ Telefone verificado
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      className="btn"
                      style={{ background: 'var(--success)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      Confirmar
                    </button>
                    <button 
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      className="btn"
                      style={{ background: 'var(--error)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'completed')}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Marcar como Concluído
                  </button>
                )}
              </div>
            </div>

            {booking.notes && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Observações:</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{booking.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin" className="btn btn-outline">Dashboard</Link>
          <Link to="/admin/professionals" className="btn btn-outline">Profissionais</Link>
          <Link to="/admin/services" className="btn btn-outline">Serviços</Link>
          <Link to="/admin/business-hours" className="btn btn-outline">Horários de Funcionamento</Link>
          <Link to="/admin/slots" className="btn btn-outline">Horários Disponíveis</Link>
          <Link to="/admin/bookings" className="btn btn-outline">Agendamentos</Link>
        </div>

        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/professionals" element={<ManageProfessionals />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/business-hours" element={<ManageBusinessHours />} />
          <Route path="/slots" element={<ManageAvailableSlots />} />
          <Route path="/bookings" element={<ManageBookings />} />
        </Routes>
      </div>
    </div>
  );
}