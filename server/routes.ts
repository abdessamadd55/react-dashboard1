import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSupplierSchema, 
  insertItemSchema, 
  insertInvoiceSchema, 
  insertInvoiceLineSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create supplier" });
      }
    }
  });

  // Item routes
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get("/api/items/search", async (req, res) => {
    try {
      const { name, price } = req.query;
      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }
      
      const item = await storage.getItemByNameAndPrice(name as string, price as string);
      res.json(item || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to search item" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const { invoice, invoiceLines } = req.body;
      
      // Validate invoice data
      const validatedInvoice = insertInvoiceSchema.parse(invoice);
      
      // Validate invoice lines
      const validatedLines = z.array(insertInvoiceLineSchema.omit({ invoiceId: true })).parse(invoiceLines);
      
      // Create the invoice
      const createdInvoice = await storage.createInvoice(validatedInvoice);
      
      // Create invoice lines
      const createdLines = [];
      for (const line of validatedLines) {
        const invoiceLine = await storage.createInvoiceLine({
          ...line,
          invoiceId: createdInvoice.id
        });
        createdLines.push(invoiceLine);
      }
      
      // Return the complete invoice with lines
      const completeInvoice = await storage.getInvoice(createdInvoice.id);
      res.status(201).json(completeInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create invoice" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
