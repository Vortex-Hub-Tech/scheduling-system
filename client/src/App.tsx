import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiRequest } from './lib/queryClient';
import { useAuth } from './hooks/useAuth';

import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import Landing from './pages/Landing';
import Home from './pages/Home';
import Services from './pages/Services';
import BookingPage from './pages/BookingPage';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import ProfessionalInfo from './pages/ProfessionalInfo';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await apiRequest("GET", queryKey[0] as string);
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error(`401: Unauthorized`);
          }
          throw new Error(`${res.status}: ${await res.text()}`);
        }
        return res.json();
      },
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking/:serviceId" element={<BookingPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/professional/:id" element={<ProfessionalInfo />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/checkout/:bookingId" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
}