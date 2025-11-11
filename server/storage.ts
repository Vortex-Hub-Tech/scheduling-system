import {
  users,
  professionals,
  services,
  bookings,
  reviews,
  galleryImages,
  availableSlots,
  businessHours,
  serviceCategories,
  businessSettings,
  dateOverrides,
  type User,
  type UpsertUser,
  type Professional,
  type InsertProfessional,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type GalleryImage,
  type InsertGalleryImage,
  type AvailableSlot,
  type InsertAvailableSlot,
  type BusinessHours,
  type InsertBusinessHours,
  type ServiceCategory,
  type InsertServiceCategory,
  type BusinessSettings,
  type InsertBusinessSettings,
  type DateOverride,
  type InsertDateOverride,
  type BookingWithRelations,
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, and, gte, lte, sql, count, sum } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  getAllProfessionals(): Promise<Professional[]>;
  getProfessional(id: number): Promise<Professional | undefined>;
  createProfessional(data: InsertProfessional): Promise<Professional>;
  updateProfessional(id: number, data: Partial<InsertProfessional>): Promise<Professional>;
  deleteProfessional(id: number): Promise<void>;

  getServicesByProfessional(professionalId: number): Promise<Service[]>;
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(data: InsertService): Promise<Service>;
  updateService(id: number, data: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  createBooking(data: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: string): Promise<BookingWithRelations[]>;
  getBookingsByEmail(email: string): Promise<BookingWithRelations[]>;
  getBookingsByPhone(phone: string): Promise<BookingWithRelations[]>;
  getBookingsByProfessional(professionalId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBooking(id: number, data: Partial<InsertBooking>): Promise<Booking>;

  createReview(data: InsertReview): Promise<Review>;
  getReviewsByProfessional(professionalId: number): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;

  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByProfessional(professionalId: number): Promise<GalleryImage[]>;
  createGalleryImage(data: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;

  getAvailableSlots(professionalId: number, serviceId: number, date?: Date): Promise<AvailableSlot[]>;
  createAvailableSlot(data: InsertAvailableSlot): Promise<AvailableSlot>;
  deleteAvailableSlot(id: number): Promise<void>;
  bookSlot(slotId: number): Promise<void>;
  generateVerificationCode(phone: string): Promise<string>;
  verifyPhoneCode(phone: string, code: string): Promise<boolean>;

  getBusinessHours(professionalId: number): Promise<BusinessHours[]>;
  createOrUpdateBusinessHours(professionalId: number, hours: Omit<InsertBusinessHours, 'professionalId'>[]): Promise<void>;
  generateSlotsFromBusinessHours(professionalId: number, serviceId: number, date: Date): Promise<AvailableSlot[]>;

  getAllCategories(): Promise<ServiceCategory[]>;
  getCategory(id: number): Promise<ServiceCategory | undefined>;
  createCategory(data: InsertServiceCategory): Promise<ServiceCategory>;
  updateCategory(id: number, data: Partial<InsertServiceCategory>): Promise<ServiceCategory>;
  deleteCategory(id: number): Promise<void>;

  getBusinessSettings(): Promise<BusinessSettings | undefined>;
  updateBusinessSettings(data: Partial<InsertBusinessSettings>): Promise<BusinessSettings>;

  getDateOverrides(professionalId: number): Promise<DateOverride[]>;
  createDateOverride(data: InsertDateOverride): Promise<DateOverride>;
  deleteDateOverride(id: number): Promise<void>;

  getOwnerStats(professionalId: number): Promise<{ todayBookings: number, pendingBookings: number, confirmedBookings: number, monthRevenue: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals).orderBy(desc(professionals.createdAt));
  }

  async getProfessional(id: number): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional;
  }

  async createProfessional(data: InsertProfessional): Promise<Professional> {
    const [professional] = await db.insert(professionals).values(data).returning();
    return professional;
  }

  async updateProfessional(id: number, data: Partial<InsertProfessional>): Promise<Professional> {
    const [professional] = await db
      .update(professionals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning();
    return professional;
  }

  async deleteProfessional(id: number): Promise<void> {
    await db.delete(professionals).where(eq(professionals.id, id));
  }

  async getServicesByProfessional(professionalId: number): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.professionalId, professionalId), eq(services.isActive, true)))
      .orderBy(services.name);
  }

  async getAllServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.name);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(data: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(data).returning();
    return service;
  }

  async updateService(id: number, data: Partial<InsertService>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async createBooking(data: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(data).returning();
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<BookingWithRelations[]> {
    return await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        serviceId: bookings.serviceId,
        professionalId: bookings.professionalId,
        bookingDate: bookings.bookingDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        paymentStatus: bookings.paymentStatus,
        paymentIntentId: bookings.paymentIntentId,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        customerName: bookings.customerName,
        customerPhone: bookings.customerPhone,
        customerEmail: bookings.customerEmail,
        phoneVerified: bookings.phoneVerified,
        verificationCode: bookings.verificationCode,
        codeExpiresAt: bookings.codeExpiresAt,
        serviceName: services.name,
        professionalName: professionals.name,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt)) as any;
  }

  async getBookingsByEmail(email: string): Promise<BookingWithRelations[]> {
    return await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        customerPhone: bookings.customerPhone,
        serviceId: bookings.serviceId,
        professionalId: bookings.professionalId,
        bookingDate: bookings.bookingDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        paymentStatus: bookings.paymentStatus,
        paymentIntentId: bookings.paymentIntentId,
        notes: bookings.notes,
        phoneVerified: bookings.phoneVerified,
        verificationCode: bookings.verificationCode,
        codeExpiresAt: bookings.codeExpiresAt,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        serviceName: services.name,
        professionalName: professionals.name,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .where(eq(bookings.customerEmail, email))
      .orderBy(desc(bookings.createdAt)) as any;
  }

  async getBookingsByPhone(phone: string): Promise<BookingWithRelations[]> {
    return await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        customerPhone: bookings.customerPhone,
        serviceId: bookings.serviceId,
        professionalId: bookings.professionalId,
        bookingDate: bookings.bookingDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        paymentStatus: bookings.paymentStatus,
        paymentIntentId: bookings.paymentIntentId,
        notes: bookings.notes,
        phoneVerified: bookings.phoneVerified,
        verificationCode: bookings.verificationCode,
        codeExpiresAt: bookings.codeExpiresAt,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        serviceName: services.name,
        professionalName: professionals.name,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(professionals, eq(bookings.professionalId, professionals.id))
      .where(eq(bookings.customerPhone, phone))
      .orderBy(desc(bookings.createdAt)) as any;
  }

  async getBookingsByProfessional(professionalId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.professionalId, professionalId))
      .orderBy(desc(bookings.bookingDate));
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.bookingDate));
  }

  async updateBooking(id: number, data: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async createReview(data: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(data).returning();
    return review;
  }

  async getReviewsByProfessional(professionalId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.professionalId, professionalId))
      .orderBy(desc(reviews.createdAt));
  }

  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(galleryImages.displayOrder, galleryImages.createdAt);
  }

  async getGalleryImagesByProfessional(professionalId: number): Promise<GalleryImage[]> {
    return await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.professionalId, professionalId))
      .orderBy(galleryImages.displayOrder, galleryImages.createdAt);
  }

  async createGalleryImage(data: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(galleryImages).values(data).returning();
    return image;
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  async getAvailableSlots(professionalId: number, serviceId: number, date?: Date): Promise<AvailableSlot[]> {
    const conditions = [
      eq(availableSlots.professionalId, professionalId),
      eq(availableSlots.serviceId, serviceId),
      eq(availableSlots.isBooked, false)
    ];

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      conditions.push(gte(availableSlots.slotDate, startOfDay));
      conditions.push(sql`${availableSlots.slotDate} <= ${endOfDay}` as any);
    }

    return await db
      .select()
      .from(availableSlots)
      .where(and(...conditions))
      .orderBy(availableSlots.slotDate);
  }

  async createAvailableSlot(data: InsertAvailableSlot): Promise<AvailableSlot> {
    const [slot] = await db.insert(availableSlots).values(data).returning();
    return slot;
  }

  async deleteAvailableSlot(id: number): Promise<void> {
    await db.delete(availableSlots).where(eq(availableSlots.id, id));
  }

  async bookSlot(slotId: number): Promise<void> {
    await db
      .update(availableSlots)
      .set({ isBooked: true })
      .where(eq(availableSlots.id, slotId));
  }

  async generateVerificationCode(phone: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db
      .update(bookings)
      .set({
        verificationCode: code,
        codeExpiresAt: expiresAt,
      })
      .where(eq(bookings.customerPhone, phone));

    return code;
  }

  async verifyPhoneCode(phone: string, code: string): Promise<boolean> {
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerPhone, phone))
      .orderBy(desc(bookings.createdAt))
      .limit(1);

    if (!booking.length) return false;

    const { verificationCode, codeExpiresAt } = booking[0];
    const now = new Date();

    if (verificationCode === code && codeExpiresAt && codeExpiresAt > now) {
      await db
        .update(bookings)
        .set({ phoneVerified: true, verificationCode: null, codeExpiresAt: null })
        .where(eq(bookings.customerPhone, phone));
      return true;
    }

    return false;
  }

  // Business Hours methods
  async getBusinessHours(professionalId: number): Promise<BusinessHours[]> {
    return await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.professionalId, professionalId))
      .orderBy(businessHours.dayOfWeek);
  }

  async createOrUpdateBusinessHours(professionalId: number, hours: Omit<InsertBusinessHours, 'professionalId'>[]): Promise<void> {
    // Delete existing hours for this professional
    await db.delete(businessHours).where(eq(businessHours.professionalId, professionalId));

    // Insert new hours
    if (hours.length > 0) {
      await db.insert(businessHours).values(
        hours.map(hour => ({ ...hour, professionalId }))
      );
    }
  }

  async generateSlotsFromBusinessHours(professionalId: number, serviceId: number, date: Date): Promise<AvailableSlot[]> {
    const dayOfWeek = date.getDay();
    const hours = await db
      .select()
      .from(businessHours)
      .where(
        and(
          eq(businessHours.professionalId, professionalId),
          eq(businessHours.dayOfWeek, dayOfWeek),
          eq(businessHours.isActive, true)
        )
      );

    if (!hours.length) return [];

    const service = await this.getService(serviceId);
    if (!service) return [];

    const slots: InsertAvailableSlot[] = [];

    for (const hour of hours) {
      const [startHour, startMinute] = hour.startTime.split(':').map(Number);
      const [endHour, endMinute] = hour.endTime.split(':').map(Number);

      const startTime = new Date(date);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(endHour, endMinute, 0, 0);

      for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + service.duration)) {
        const slotDateTime = new Date(time);

        // Check if slot already exists
        const existingSlot = await db
          .select()
          .from(availableSlots)
          .where(
            and(
              eq(availableSlots.professionalId, professionalId),
              eq(availableSlots.serviceId, serviceId),
              eq(availableSlots.slotDate, slotDateTime)
            )
          );

        if (!existingSlot.length) {
          slots.push({
            professionalId,
            serviceId,
            slotDate: slotDateTime,
            isBooked: false,
          });
        }
      }
    }

    if (slots.length > 0) {
      const createdSlots = await db.insert(availableSlots).values(slots).returning();
      return createdSlots;
    }

    return [];
  }

  async getAllCategories(): Promise<ServiceCategory[]> {
    return await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.isActive, true))
      .orderBy(serviceCategories.displayOrder, serviceCategories.name);
  }

  async getCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category;
  }

  async createCategory(data: InsertServiceCategory): Promise<ServiceCategory> {
    const [category] = await db.insert(serviceCategories).values(data).returning();
    return category;
  }

  async updateCategory(id: number, data: Partial<InsertServiceCategory>): Promise<ServiceCategory> {
    const [category] = await db
      .update(serviceCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceCategories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(serviceCategories).where(eq(serviceCategories.id, id));
  }

  async getBusinessSettings(): Promise<BusinessSettings | undefined> {
    const [settings] = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));
    return settings;
  }

  async updateBusinessSettings(data: Partial<InsertBusinessSettings>): Promise<BusinessSettings> {
    const [settings] = await db
      .insert(businessSettings)
      .values({ id: 1, ...data } as InsertBusinessSettings)
      .onConflictDoUpdate({
        target: businessSettings.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  async getDateOverrides(professionalId: number): Promise<DateOverride[]> {
    return await db
      .select()
      .from(dateOverrides)
      .where(eq(dateOverrides.professionalId, professionalId))
      .orderBy(dateOverrides.date);
  }

  async createDateOverride(data: InsertDateOverride): Promise<DateOverride> {
    const [override] = await db.insert(dateOverrides).values(data).returning();
    return override;
  }

  async deleteDateOverride(id: number): Promise<void> {
    await db.delete(dateOverrides).where(eq(dateOverrides.id, id));
  }

  async getOwnerStats(professionalId: number): Promise<{ todayBookings: number, pendingBookings: number, confirmedBookings: number, monthRevenue: number }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [todayBookingsResult] = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.professionalId, professionalId),
          gte(bookings.bookingDate, startOfToday),
          lte(bookings.bookingDate, endOfToday)
        )
      );

    const [pendingBookingsResult] = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.professionalId, professionalId),
          eq(bookings.status, 'pending')
        )
      );

    const [confirmedBookingsResult] = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.professionalId, professionalId),
          eq(bookings.status, 'confirmed')
        )
      );

    const [monthRevenueResult] = await db
      .select({ total: sum(bookings.totalAmount) })
      .from(bookings)
      .where(
        and(
          eq(bookings.professionalId, professionalId),
          eq(bookings.paymentStatus, 'paid'),
          gte(bookings.bookingDate, startOfMonth),
          lte(bookings.bookingDate, endOfMonth)
        )
      );

    return {
      todayBookings: todayBookingsResult?.count || 0,
      pendingBookings: pendingBookingsResult?.count || 0,
      confirmedBookings: confirmedBookingsResult?.count || 0,
      monthRevenue: parseFloat(monthRevenueResult?.total as string || '0'),
    };
  }
}

export const storage = new DatabaseStorage();