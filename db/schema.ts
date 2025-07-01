import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(), // This will store bcrypt hashed passwords
  refreshToken: text("refresh_token"),
  isActive: boolean("is_active").default(true).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Custom validation schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

export const selectUserSchema = createSelectSchema(users);

// Channel profiles table
export const channelProfiles = pgTable("channel_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  channelName: text("channel_name").notNull(),
  niche: text("niche").notNull(),
  contentTypes: text("content_types").array().notNull(),
  targetAudience: text("target_audience").notNull(), // JSON string
  goals: text("goals").array().notNull(),
  competitors: text("competitors").array(),
  focusAreas: text("focus_areas").array(),
  painPoints: text("pain_points").array(),
  uniqueValue: text("unique_value"),
  uploadSchedule: text("upload_schedule"),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  buzzyPersonality: text("buzzy_personality"), // Store Buzzy's learned personality traits
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChannelProfileSchema = createInsertSchema(channelProfiles);
export const selectChannelProfileSchema = createSelectSchema(channelProfiles);

// Auth-specific schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

// User API Keys table
export { userApiKeys, type UserApiKey, type NewUserApiKey } from './schema/userApiKeys';
