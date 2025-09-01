import type { IRouter } from "express";
import { storage } from "./storage";
import { 
  insertSupplierSchema,
  insertItemSchema // Added missing import
} from "@shared/schema";
import { z } from "zod";

export function registerRoutes(router: IRouter) {
  // Supplier routes
  router.get("/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  router.post("/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating supplier:", error);
        res.status(500).json({ error: "Failed to create supplier" });
      }
    }
  });

  // Item routes
  router.get("/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  router.get("/items/search", async (req, res) => {
    try {
      const { name, price } = req.query;
      if (!name || !price) {
        return res.status(400).json({ error: "Both name and price parameters are required" });
      }
      
      // Get all items and filter them
      const allItems = await storage.getItems();
      const searchName = (name as string).toLowerCase();
      const searchPrice = parseFloat(price as string);
      
      const filteredItems = allItems.filter(item => 
        item.name.toLowerCase().includes(searchName) && 
        parseFloat(item.price.toString()) <= searchPrice
      );
      
      res.json(filteredItems);
    } catch (error) {
      console.error("Error searching items:", error);
      res.status(500).json({ error: "Failed to search items" });
    }
  });

  router.post("/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item" });
      }
    }
  });

  // Invoice routes
  router.get("/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  router.post("/invoices", async (req, res) => {
    try {
      const { invoice, invoiceLines } = req.body;
      
      // Add validation if you have schemas for invoice data
      // const validatedInvoice = insertInvoiceSchema.parse(invoice);
      // const validatedLines = invoiceLinesSchema.parse(invoiceLines);
      
      const createdInvoice = await storage.createInvoice({ invoice, invoiceLines });
      res.status(201).json(createdInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating invoice:", error);
        res.status(500).json({ error: "Failed to create invoice" });
      }
    }
  });
}