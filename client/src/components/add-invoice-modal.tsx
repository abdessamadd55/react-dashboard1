import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type SupplierWithInvoices } from "@shared/schema";
import InvoiceForm from "./invoice-form";
import { X, Save } from "lucide-react";

interface AddInvoiceModalProps {
  supplier: SupplierWithInvoices;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddInvoiceModal({ supplier, isOpen, onClose }: AddInvoiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (invoiceData: any) => {
    setIsSubmitting(true);
    try {
      // This will be handled by the InvoiceForm component
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0" data-testid="modal-add-invoice">
        {/* Modal Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <div>
            <DialogTitle className="text-lg font-semibold">Add New Invoice</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create an invoice for{" "}
              <span className="font-medium" data-testid="modal-supplier-name">
                {supplier.name}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <InvoiceForm
              supplier={supplier}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            data-testid="button-cancel-invoice"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="invoice-form"
            disabled={isSubmitting}
            data-testid="button-submit-invoice"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Invoice
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
