import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShipmentSchema } from "@shared/schema";
import { googleSheetsService } from "./googleSheets";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Shipment routes
  app.get("/api/shipments", async (req, res) => {
    try {
      const shipments = await storage.getAllShipments();
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  });

  app.get("/api/shipments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }
      res.json(shipment);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ error: "Failed to fetch shipment" });
    }
  });

  app.post("/api/shipments", async (req, res) => {
    try {
      const validatedData = insertShipmentSchema.parse(req.body);
      const shipment = await storage.createShipment(validatedData);
      res.status(201).json(shipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating shipment:", error);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  });

  app.put("/api/shipments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShipmentSchema.partial().parse(req.body);
      const shipment = await storage.updateShipment(id, validatedData);
      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }
      res.json(shipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating shipment:", error);
      res.status(500).json({ error: "Failed to update shipment" });
    }
  });

  app.delete("/api/shipments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteShipment(id);
      if (!success) {
        return res.status(404).json({ error: "Shipment not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      res.status(500).json({ error: "Failed to delete shipment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
