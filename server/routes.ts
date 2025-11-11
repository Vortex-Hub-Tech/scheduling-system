import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupAuth, isAuthenticated, isAdmin } from "./auth.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Admin status check
  app.get('/api/admin/status', (req, res) => {
    const isAdminUser = !!(req.session as any)?.isAdmin;
    res.json({ isAdmin: isAdminUser });
  });

  app.get('/api/professionals', async (_req, res) => {
    try {
      const professionals = await storage.getAllProfessionals();
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  app.get('/api/professionals/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const professional = await storage.getProfessional(id);
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      res.json(professional);
    } catch (error) {
      console.error("Error fetching professional:", error);
      res.status(500).json({ message: "Failed to fetch professional" });
    }
  });

  app.post('/api/professionals', isAdmin, async (req, res) => {
    try {
      const professional = await storage.createProfessional(req.body);
      res.status(201).json(professional);
    } catch (error) {
      console.error("Error creating professional:", error);
      res.status(500).json({ message: "Failed to create professional" });
    }
  });

  app.put('/api/professionals/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const professional = await storage.updateProfessional(id, req.body);
      res.json(professional);
    } catch (error) {
      console.error("Error updating professional:", error);
      res.status(500).json({ message: "Failed to update professional" });
    }
  });

  app.delete('/api/professionals/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProfessional(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting professional:", error);
      res.status(500).json({ message: "Failed to delete professional" });
    }
  });

  app.get('/api/services', async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/professional/:professionalId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const services = await storage.getServicesByProfessional(professionalId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post('/api/services', isAdmin, async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put('/api/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateService(id, req.body);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  app.get('/api/available-slots/:professionalId/:serviceId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const serviceId = parseInt(req.params.serviceId);
      const date = req.query.date ? new Date(req.query.date as string) : undefined;

      const slots = await storage.getAvailableSlots(professionalId, serviceId, date);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  app.post('/api/available-slots', isAdmin, async (req, res) => {
    try {
      const slotData = {
        ...req.body,
        slotDate: new Date(req.body.slotDate),
      };
      const slot = await storage.createAvailableSlot(slotData);
      res.status(201).json(slot);
    } catch (error) {
      console.error("Error creating available slot:", error);
      res.status(500).json({ message: "Failed to create available slot" });
    }
  });

  app.delete('/api/available-slots/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAvailableSlot(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting available slot:", error);
      res.status(500).json({ message: "Failed to delete available slot" });
    }
  });

  // Business Hours routes
  app.get('/api/business-hours/:professionalId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const hours = await storage.getBusinessHours(professionalId);
      res.json(hours);
    } catch (error) {
      console.error("Error fetching business hours:", error);
      res.status(500).json({ message: "Failed to fetch business hours" });
    }
  });

  app.post('/api/business-hours/:professionalId', isAdmin, async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const { hours } = req.body;
      await storage.createOrUpdateBusinessHours(professionalId, hours);
      res.json({ message: "Business hours updated successfully" });
    } catch (error) {
      console.error("Error updating business hours:", error);
      res.status(500).json({ message: "Failed to update business hours" });
    }
  });

  app.post('/api/generate-slots/:professionalId/:serviceId', isAdmin, async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const serviceId = parseInt(req.params.serviceId);
      const { date } = req.body;
      
      const slots = await storage.generateSlotsFromBusinessHours(professionalId, serviceId, new Date(date));
      res.json(slots);
    } catch (error) {
      console.error("Error generating slots:", error);
      res.status(500).json({ message: "Failed to generate slots" });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        bookingDate: new Date(req.body.bookingDate),
        status: 'pending',
        paymentStatus: 'pending',
        phoneVerified: false,
      };

      // Check for existing bookings at the same time
      const existingBookings = await storage.getBookingsByProfessional(bookingData.professionalId);
      const conflictingBooking = existingBookings.find((booking: any) => {
        const existingTime = new Date(booking.bookingDate).getTime();
        const newTime = bookingData.bookingDate.getTime();
        return existingTime === newTime && booking.status !== 'cancelled';
      });

      if (conflictingBooking) {
        return res.status(400).json({ message: "Este horário já está ocupado. Por favor, selecione outro horário." });
      }

      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.post('/api/send-verification', async (req, res) => {
    try {
      const { phone } = req.body;
      const code = await storage.generateVerificationCode(phone);

      // Here you would integrate with an SMS service like Twilio
      // For now, we'll just log the code (in production, send SMS)
      console.log(`SMS Verification code for ${phone}: ${code}`);

      res.json({ message: "Verification code sent successfully" });
    } catch (error) {
      console.error("Error sending verification code:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  app.post('/api/verify-phone', async (req, res) => {
    try {
      const { phone, code } = req.body;
      const isValid = await storage.verifyPhoneCode(phone, code);

      if (isValid) {
        res.json({ message: "Phone verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification code" });
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      res.status(500).json({ message: "Failed to verify phone" });
    }
  });

  app.get('/api/bookings/user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const bookings = await storage.getBookingsByEmail(email);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/phone/:phone', async (req, res) => {
    try {
      const phone = req.params.phone;
      const bookings = await storage.getBookingsByPhone(phone);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/professional/:professionalId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const bookings = await storage.getBookingsByProfessional(professionalId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching professional bookings:", error);
      res.status(500).json({ message: "Failed to fetch professional bookings" });
    }
  });

  app.get('/api/bookings', isAdmin, async (_req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.put('/api/bookings/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.updateBooking(id, req.body);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = req.body;
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/professional/:professionalId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const reviews = await storage.getReviewsByProfessional(professionalId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/all', async (_req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews', isAdmin, async (_req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/gallery/all', async (_req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.get('/api/gallery/:professionalId', async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const images = await storage.getGalleryImagesByProfessional(professionalId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.post('/api/gallery', isAdmin, async (req, res) => {
    try {
      const image = await storage.createGalleryImage(req.body);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(500).json({ message: "Failed to create gallery image" });
    }
  });

  app.delete('/api/gallery/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryImage(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, bookingId } = req.body;

      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
        return res.status(400).json({ message: "Stripe not configured. Please add your Stripe secret key." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "brl",
        metadata: { bookingId: bookingId.toString() },
      });

      if (bookingId) {
        await storage.updateBooking(bookingId, {
          paymentIntentId: paymentIntent.id,
        });
      }

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const event = req.body;

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const bookingId = parseInt(paymentIntent.metadata.bookingId);

        if (bookingId) {
          await storage.updateBooking(bookingId, {
            paymentStatus: 'paid',
            status: 'confirmed',
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).json({ message: "Webhook error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}