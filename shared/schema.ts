import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Location data types for the dashboard
export type Location = {
  id: string;
  name: string;
  city: string;
  country: string;
  service: string;
  machineType: string;
  testKitsInStock: number;
  weeklyBurnRate: number;
  daysRemaining: number;
  infectionRate: number;
  weeklyTestsCompleted: number;
  lat: number;
  lng: number;
  status: 'healthy' | 'warning' | 'critical';
};

export type ServiceSummary = {
  service: string;
  totalLocations: number;
  totalTestKits: number;
  weeklyTests: number;
  avgDaysRemaining: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
};

export type MachineTypeSummary = {
  machineType: string;
  totalLocations: number;
  totalTestKits: number;
  weeklyTests: number;
  avgBurnRate: number;
  avgDaysRemaining: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  locations: Array<{ name: string; city: string; status: Location['status']; testKitsInStock: number }>;
};

export type LevelLoadSuggestion = {
  sourceName: string;
  sourceCity: string;
  availableKits: number;
  distanceMiles: number;
};

export type Recommendation = {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedLocations: string[];
  category: 'supply' | 'capacity' | 'logistics';
  levelLoadSuggestions?: LevelLoadSuggestion[];
  resupplyAmount?: number;
  purchaseSuggestion?: string;
  machineType?: string;
};
