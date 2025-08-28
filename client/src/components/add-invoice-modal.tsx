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
            />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
