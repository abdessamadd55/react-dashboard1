import { 
  type Supplier, 
  type InsertSupplier,
  type Item,
  type InsertItem,
  type Invoice,
  type InsertInvoice,
  type InvoiceLine,
  type InsertInvoiceLine,
  type SupplierWithInvoices,
  type InvoiceWithLines,
  type InvoiceLineWithItem
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Supplier operations
  getSuppliers(): Promise<SupplierWithInvoices[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Item operations
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  getItemByNameAndPrice(name: string, price: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  
  // Invoice operations
  getInvoices(): Promise<InvoiceWithLines[]>;
  getInvoice(id: string): Promise<InvoiceWithLines | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // Invoice line operations
  createInvoiceLine(invoiceLine: InsertInvoiceLine): Promise<InvoiceLine>;
  getInvoiceLinesByInvoiceId(invoiceId: string): Promise<InvoiceLineWithItem[]>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<string, Supplier>;
  private items: Map<string, Item>;
  private invoices: Map<string, Invoice>;
  private invoiceLines: Map<string, InvoiceLine>;

  constructor() {
    this.suppliers = new Map();
    this.items = new Map();
    this.invoices = new Map();
    this.invoiceLines = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample suppliers
    const supplier1: Supplier = {
      id: randomUUID(),
      name: "Matier Fer",
      address: "123 Rue Hassan II, Casablanca",
      phone: "+212612345678"
    };
    
    const supplier2: Supplier = {
      id: randomUUID(),
      name: "TechParts Morocco",
      address: "456 Boulevard Mohammed V, Rabat",
      phone: "+212687654321"
    };

    this.suppliers.set(supplier1.id, supplier1);
    this.suppliers.set(supplier2.id, supplier2);

    // Create sample items
    const item1: Item = {
      id: randomUUID(),
      name: "Table en bois",
      price: "750.00"
    };

    const item2: Item = {
      id: randomUUID(),
      name: "Chair en métal",
      price: "125.00"
    };

    this.items.set(item1.id, item1);
    this.items.set(item2.id, item2);

    // Create sample invoice
    const invoice1: Invoice = {
      id: randomUUID(),
      invoiceNumber: "INV-2025-001",
      amount: "1500.00",
      supplierId: supplier1.id,
      createdAt: new Date()
    };

    this.invoices.set(invoice1.id, invoice1);

    // Create sample invoice line
    const invoiceLine1: InvoiceLine = {
      id: randomUUID(),
      quantity: 2,
      invoiceId: invoice1.id,
      itemId: item1.id
    };

    this.invoiceLines.set(invoiceLine1.id, invoiceLine1);
  }

  async getSuppliers(): Promise<SupplierWithInvoices[]> {
    const suppliers = Array.from(this.suppliers.values());
    const result: SupplierWithInvoices[] = [];

    for (const supplier of suppliers) {
      const invoices = await this.getInvoicesBySupplier(supplier.id);
      result.push({
        ...supplier,
        invoices
      });
    }

    return result;
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getItemByNameAndPrice(name: string, price: string): Promise<Item | undefined> {
    return Array.from(this.items.values()).find(
      item => item.name.toLowerCase() === name.toLowerCase() && item.price === price
    );
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = randomUUID();
    const item: Item = { ...insertItem, id };
    this.items.set(id, item);
    return item;
  }

  async getInvoices(): Promise<InvoiceWithLines[]> {
    const invoices = Array.from(this.invoices.values());
    const result: InvoiceWithLines[] = [];

    for (const invoice of invoices) {
      const supplier = await this.getSupplier(invoice.supplierId);
      const invoiceLines = await this.getInvoiceLinesByInvoiceId(invoice.id);
      
      if (supplier) {
        result.push({
          ...invoice,
          supplier,
          invoiceLines
        });
      }
    }

    return result;
  }

  async getInvoice(id: string): Promise<InvoiceWithLines | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    const supplier = await this.getSupplier(invoice.supplierId);
    const invoiceLines = await this.getInvoiceLinesByInvoiceId(invoice.id);
    
    if (!supplier) return undefined;

    return {
      ...invoice,
      supplier,
      invoiceLines
    };
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = { 
      ...insertInvoice, 
      id, 
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async createInvoiceLine(insertInvoiceLine: InsertInvoiceLine): Promise<InvoiceLine> {
    const id = randomUUID();
    const invoiceLine: InvoiceLine = { ...insertInvoiceLine, id };
    this.invoiceLines.set(id, invoiceLine);
    return invoiceLine;
  }

  async getInvoiceLinesByInvoiceId(invoiceId: string): Promise<InvoiceLineWithItem[]> {
    const lines = Array.from(this.invoiceLines.values()).filter(
      line => line.invoiceId === invoiceId
    );

    const result: InvoiceLineWithItem[] = [];
    for (const line of lines) {
      const item = await this.getItem(line.itemId);
      if (item) {
        result.push({
          ...line,
          item
        });
      }
    }

    return result;
  }

  private async getInvoicesBySupplier(supplierId: string): Promise<InvoiceWithLines[]> {
    const invoices = Array.from(this.invoices.values()).filter(
      invoice => invoice.supplierId === supplierId
    );

    const result: InvoiceWithLines[] = [];
    for (const invoice of invoices) {
      const supplier = await this.getSupplier(invoice.supplierId);
      const invoiceLines = await this.getInvoiceLinesByInvoiceId(invoice.id);
      
      if (supplier) {
        result.push({
          ...invoice,
          supplier,
          invoiceLines
        });
      }
    }

    return result;
  }
}

export const storage = new MemStorage();
