import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export default function Header() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/logout');
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', textDecoration: 'none', color: 'var(--primary)' }}>
          Booking System
        </Link>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Início</Link>
          <Link to="/services" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Serviços</Link>
          <Link to="/gallery" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Galeria</Link>
          <Link to="/reviews" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Avaliações</Link>
          <Link to="/my-bookings" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Meus Agendamentos</Link>
          {isAdmin && (
            <>
              <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>Admin</Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Sair Admin
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}