import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const professionals = pgTable("professionals", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  description: text("description"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceCategories = pgTable("service_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").references(() => serviceCategories.id, { onDelete: 'set null' }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("services_professional_id_idx").on(table.professionalId),
  index("services_category_id_idx").on(table.categoryId),
]);

export const bookings = pgTable("bookings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  customerName: varchar("customer_name", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: 'cascade' }),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  bookingDate: timestamp("booking_date").notNull(),
  status: varchar("status", { length: 50 }).default('pending').notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default('pending').notNull(),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  notes: text("notes"),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  verificationCode: varchar("verification_code", { length: 6 }),
  codeExpiresAt: timestamp("code_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("bookings_professional_id_idx").on(table.professionalId),
  index("bookings_booking_date_idx").on(table.bookingDate),
  index("bookings_customer_phone_idx").on(table.customerPhone),
  index("bookings_status_idx").on(table.status),
]);

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  bookingId: integer("booking_id").references(() => bookings.id, { onDelete: 'set null' }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessHours = pgTable("business_hours", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: varchar("start_time", { length: 5 }).notNull(), // Format: "HH:MM"
  endTime: varchar("end_time", { length: 5 }).notNull(), // Format: "HH:MM"
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const availableSlots = pgTable("available_slots", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: 'cascade' }),
  slotDate: timestamp("slot_date").notNull(),
  isBooked: boolean("is_booked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("available_slots_professional_service_idx").on(table.professionalId, table.serviceId),
  index("available_slots_slot_date_idx").on(table.slotDate),
]);

export const businessSettings = pgTable("business_settings", {
  id: integer("id").primaryKey().default(1),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  website: varchar("website", { length: 255 }),
  primaryColor: varchar("primary_color", { length: 7 }).default('#2563eb'),
  secondaryColor: varchar("secondary_color", { length: 7 }).default('#1e40af'),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  instagramHandle: varchar("instagram_handle", { length: 100 }),
  facebookUrl: varchar("facebook_url", { length: 255 }),
  bookingLeadTimeMinutes: integer("booking_lead_time_minutes").default(60),
  cancellationLeadTimeHours: integer("cancellation_lead_time_hours").default(24),
  maxAdvanceBookingDays: integer("max_advance_booking_days").default(60),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dateOverrides = pgTable("date_overrides", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  date: timestamp("date").notNull(),
  isClosed: boolean("is_closed").default(false).notNull(),
  reason: text("reason"),
  startTime: varchar("start_time", { length: 5 }),
  endTime: varchar("end_time", { length: 5 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  professionalDateIdx: index("date_overrides_professional_date_idx").on(table.professionalId, table.date),
}));

export const notificationQueue = pgTable("notification_queue", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  bookingId: integer("booking_id").references(() => bookings.id, { onDelete: 'cascade' }),
  type: varchar("type", { length: 50 }).notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default('pending').notNull(),
  sentAt: timestamp("sent_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const businessHoursRelations = relations(businessHours, ({ one }) => ({
  professional: one(professionals, {
    fields: [businessHours.professionalId],
    references: [professionals.id],
  }),
}));

export const professionalsRelations = relations(professionals, ({ many }) => ({
  services: many(services),
  bookings: many(bookings),
  reviews: many(reviews),
  galleryImages: many(galleryImages),
  businessHours: many(businessHours),
  dateOverrides: many(dateOverrides),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  professional: one(professionals, {
    fields: [services.professionalId],
    references: [professionals.id],
  }),
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  professional: one(professionals, {
    fields: [bookings.professionalId],
    references: [professionals.id],
  }),
}));

export const availableSlotsRelations = relations(availableSlots, ({ one }) => ({
  professional: one(professionals, {
    fields: [availableSlots.professionalId],
    references: [professionals.id],
  }),
  service: one(services, {
    fields: [availableSlots.serviceId],
    references: [services.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  professional: one(professionals, {
    fields: [reviews.professionalId],
    references: [professionals.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  professional: one(professionals, {
    fields: [galleryImages.professionalId],
    references: [professionals.id],
  }),
}));

export const dateOverridesRelations = relations(dateOverrides, ({ one }) => ({
  professional: one(professionals, {
    fields: [dateOverrides.professionalId],
    references: [professionals.id],
  }),
}));

export const notificationQueueRelations = relations(notificationQueue, ({ one }) => ({
  booking: one(bookings, {
    fields: [notificationQueue.bookingId],
    references: [bookings.id],
  }),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type InsertProfessional = typeof professionals.$inferInsert;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = typeof serviceCategories.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;
export type AvailableSlot = typeof availableSlots.$inferSelect;
export type InsertAvailableSlot = typeof availableSlots.$inferInsert;
export type BusinessHours = typeof businessHours.$inferSelect;
export type InsertBusinessHours = typeof businessHours.$inferInsert;
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type InsertBusinessSettings = typeof businessSettings.$inferInsert;
export type DateOverride = typeof dateOverrides.$inferSelect;
export type InsertDateOverride = typeof dateOverrides.$inferInsert;
export type NotificationQueue = typeof notificationQueue.$inferSelect;
export type InsertNotificationQueue = typeof notificationQueue.$inferInsert;

export type BookingWithRelations = Booking & {
  serviceName?: string | null;
  professionalName?: string | null;
};
