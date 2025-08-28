import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInvoiceSchema, type SupplierWithInvoices, type Item } from "@shared/schema";
import InvoiceLineForm from "./invoice-line-form";
import { Plus, List } from "lucide-react";
import { z } from "zod";

const invoiceFormSchema = insertInvoiceSchema.extend({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
});

interface InvoiceLine {
  id: string;
  itemName: string;
  itemPrice: string;
  quantity: number;
  itemId?: string;
  total: number;
}

interface InvoiceFormProps {
  supplier: SupplierWithInvoices;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function InvoiceForm({ supplier, onSubmit, onCancel, isSubmitting }: InvoiceFormProps) {
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([
    {
      id: crypto.randomUUID(),
      itemName: "",
      itemPrice: "",
      quantity: 1,
      total: 0,
    },
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      supplierId: supplier.id,
      amount: "0.00",
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: { invoice: any; invoiceLines: any[]; newItems: Item[] }) => {
      // First, create any new items
      for (const item of data.newItems) {
        await apiRequest("POST", "/api/items", item);
      }

      // Then create the invoice with lines
      const response = await apiRequest("POST", "/api/invoices", {
        invoice: data.invoice,
        invoiceLines: data.invoiceLines,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      onSubmit(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const addInvoiceLine = () => {
    setInvoiceLines([
      ...invoiceLines,
      {
        id: crypto.randomUUID(),
        itemName: "",
        itemPrice: "",
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const removeInvoiceLine = (id: string) => {
    if (invoiceLines.length > 1) {
      setInvoiceLines(invoiceLines.filter((line) => line.id !== id));
    }
  };

  const updateInvoiceLine = (id: string, updates: Partial<InvoiceLine>) => {
    setInvoiceLines(
      invoiceLines.map((line) =>
        line.id === id
          ? {
              ...line,
              ...updates,
              total: calculateLineTotal({
                ...line,
                ...updates,
              }),
            }
          : line
      )
    );
  };

  const calculateLineTotal = (line: Partial<InvoiceLine>) => {
    const price = parseFloat(line.itemPrice || "0");
    const quantity = line.quantity || 0;
    return price * quantity;
  };

  const calculateInvoiceTotal = () => {
    return invoiceLines.reduce((total, line) => total + line.total, 0);
  };

  const validateLines = () => {
    const errors: string[] = [];
    const itemCombinations = new Set<string>();

    invoiceLines.forEach((line, index) => {
      if (!line.itemName.trim()) {
        errors.push(`Line ${index + 1}: Item name is required`);
      }
      if (!line.itemPrice || parseFloat(line.itemPrice) <= 0) {
        errors.push(`Line ${index + 1}: Valid price is required`);
      }
      if (line.quantity <= 0) {
        errors.push(`Line ${index + 1}: Quantity must be greater than 0`);
      }

      // Check for duplicates
      const combination = `${line.itemName.toLowerCase()}-${line.itemPrice}`;
      if (itemCombinations.has(combination)) {
        errors.push(`Line ${index + 1}: Duplicate item detected`);
      }
      itemCombinations.add(combination);
    });

    return errors;
  };

  // Update form amount when lines change
  useEffect(() => {
    const total = calculateInvoiceTotal();
    form.setValue("amount", total.toFixed(2));
  }, [invoiceLines, form]);

  const handleFormSubmit = async (data: any) => {
    const validationErrors = validateLines();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Identify new items and existing items
    const newItems: Item[] = [];
    const processedLines = [];

    for (const line of invoiceLines) {
      if (!line.itemId) {
        // This is a new item
        newItems.push({
          id: crypto.randomUUID(),
          name: line.itemName,
          price: line.itemPrice,
        });
      }
      
      processedLines.push({
        quantity: line.quantity,
        itemId: line.itemId || crypto.randomUUID(), // Will be replaced with actual ID after item creation
      });
    }

    createInvoiceMutation.mutate({
      invoice: data,
      invoiceLines: processedLines,
      newItems,
    });
  };

  const subtotal = calculateInvoiceTotal();
  const tax = subtotal * 0.2; // 20% tax
  const total = subtotal + tax;

  return (
    <Form {...form}>
      <form id="invoice-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="INV-2025-004"
                    {...field}
                    data-testid="input-invoice-number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                data-testid="input-invoice-date"
              />
            </FormControl>
          </FormItem>
        </div>

        {/* Invoice Lines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <List className="w-4 h-4" />
              Invoice Lines
            </h4>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addInvoiceLine}
              data-testid="button-add-line"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Line
            </Button>
          </div>

          <div className="space-y-3">
            {invoiceLines.map((line, index) => (
              <InvoiceLineForm
                key={line.id}
                line={line}
                index={index}
                onUpdate={(updates) => updateInvoiceLine(line.id, updates)}
                onRemove={() => removeInvoiceLine(line.id)}
                canRemove={invoiceLines.length > 1}
              />
            ))}
          </div>

          {/* Invoice Total */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-end">
              <div className="bg-card border border-border rounded-lg p-4 min-w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span data-testid="text-subtotal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (20%):</span>
                    <span data-testid="text-tax">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span data-testid="text-total">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
