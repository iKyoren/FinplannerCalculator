import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  investmentProfile: text("investment_profile", { enum: ["conservative", "moderate", "aggressive"] }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 4 }),
  changePercent: decimal("change_percent", { precision: 10, scale: 4 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  investmentProfile: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).pick({
  symbol: true,
  name: true,
  price: true,
  change: true,
  changePercent: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).pick({
  title: true,
  description: true,
  content: true,
  category: true,
  imageUrl: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  response: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type InvestmentProfile = "conservative" | "moderate" | "aggressive";

export interface CalculatorResult {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  recommendation?: string;
}

export interface MarketDataPoint {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
