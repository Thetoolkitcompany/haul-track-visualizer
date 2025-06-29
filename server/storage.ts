
import { users, shipments, type User, type InsertUser, type Shipment, type InsertShipment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shipment methods
  getAllShipments(): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<InsertShipment>): Promise<Shipment | undefined>;
  deleteShipment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllShipments(): Promise<Shipment[]> {
    return await db.select().from(shipments).orderBy(shipments.date);
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment || undefined;
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    // Convert numeric values to strings as required by the database schema
    const dbShipment = {
      ...insertShipment,
      weight: insertShipment.weight.toString(),
      rate: insertShipment.rate.toString(),
      deliveryCharge: insertShipment.deliveryCharge.toString(),
      freight: insertShipment.freight.toString(),
    };
    
    const [shipment] = await db
      .insert(shipments)
      .values(dbShipment)
      .returning();
    return shipment;
  }

  async updateShipment(id: number, updateData: Partial<InsertShipment>): Promise<Shipment | undefined> {
    // Convert numeric values to strings as required by the database schema
    const dbUpdateData: any = { ...updateData };
    if (dbUpdateData.weight !== undefined) {
      dbUpdateData.weight = dbUpdateData.weight.toString();
    }
    if (dbUpdateData.rate !== undefined) {
      dbUpdateData.rate = dbUpdateData.rate.toString();
    }
    if (dbUpdateData.deliveryCharge !== undefined) {
      dbUpdateData.deliveryCharge = dbUpdateData.deliveryCharge.toString();
    }
    if (dbUpdateData.freight !== undefined) {
      dbUpdateData.freight = dbUpdateData.freight.toString();
    }

    const [shipment] = await db
      .update(shipments)
      .set(dbUpdateData)
      .where(eq(shipments.id, id))
      .returning();
    return shipment || undefined;
  }

  async deleteShipment(id: number): Promise<boolean> {
    const result = await db.delete(shipments).where(eq(shipments.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
