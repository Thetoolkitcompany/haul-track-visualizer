import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  consignmentNumber: text("consignment_number").notNull(),
  truckNumber: text("truck_number").notNull(),
  consignee: text("consignee").notNull(),
  consigneeLocation: text("consignee_location").notNull(),
  weight: numeric("weight", { precision: 10, scale: 2 }).notNull(),
  rate: numeric("rate", { precision: 10, scale: 2 }).notNull(),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }).notNull(),
  freight: numeric("freight", { precision: 10, scale: 2 }).notNull(),
  consignorLocation: text("consignor_location").notNull(),
  numberOfArticles: integer("number_of_articles").notNull(),
  natureOfGoods: text("nature_of_goods").notNull(),
  consignor: text("consignor").notNull(),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;
