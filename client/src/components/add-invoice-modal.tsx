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
  const handleSubmit = () => {
    // This will be called after successful mutation in InvoiceForm
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0" data-testid="modal-add-invoice">
        {/* Modal Header */}
        <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base sm:text-lg font-semibold">Add New Invoice</DialogTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Create an invoice for{" "}
              <span className="font-medium truncate" data-testid="modal-supplier-name">
                {supplier.name}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="self-end sm:self-center"
            data-testid="button-close-modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </DialogHeader>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-140px)]">
          <div className="p-4 sm:p-6">
            <InvoiceForm
              supplier={supplier}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
