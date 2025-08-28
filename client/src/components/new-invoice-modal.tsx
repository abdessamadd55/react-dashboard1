import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SupplierWithInvoices } from "@shared/schema";
import SupplierSelector from "./supplier-selector";
import InvoiceForm from "./invoice-form";
import { X } from "lucide-react";
import { z } from "zod";

const supplierSelectionSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
});

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithInvoices | null>(null);
  const [step, setStep] = useState<"select-supplier" | "create-invoice">("select-supplier");

  const form = useForm({
    resolver: zodResolver(supplierSelectionSchema),
    defaultValues: {
      supplierId: "",
    },
  });

  const handleSupplierSelect = (supplier: SupplierWithInvoices | null) => {
    setSelectedSupplier(supplier);
    if (supplier) {
      form.setValue("supplierId", supplier.id);
    }
  };

  const handleNext = () => {
    if (selectedSupplier) {
      setStep("create-invoice");
    }
  };

  const handleBack = () => {
    setStep("select-supplier");
  };

  const handleSubmit = () => {
    // This will be called after successful invoice creation
    onClose();
    handleReset();
  };

  const handleReset = () => {
    setSelectedSupplier(null);
    setStep("select-supplier");
    form.reset();
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0" data-testid="modal-new-invoice">
        {/* Modal Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <div>
            <DialogTitle className="text-lg font-semibold">
              {step === "select-supplier" ? "New Invoice - Select Supplier" : "New Invoice"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "select-supplier" 
                ? "Choose which supplier this invoice is for"
                : `Create an invoice for ${selectedSupplier?.name}`
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {step === "select-supplier" ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <SupplierSelector
                            value={field.value}
                            onSelect={handleSupplierSelect}
                            placeholder="Select a supplier for this invoice..."
                            data-testid="select-supplier"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      data-testid="button-cancel-supplier-selection"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!selectedSupplier}
                      data-testid="button-next-to-invoice"
                    >
                      Next: Create Invoice
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              selectedSupplier && (
                <>
                  <div className="mb-4 pb-4 border-b border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      data-testid="button-back-to-supplier-selection"
                    >
                      ← Back to Supplier Selection
                    </Button>
                  </div>
                  <InvoiceForm
                    supplier={selectedSupplier}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                  />
                </>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}