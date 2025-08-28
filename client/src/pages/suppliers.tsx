import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import SupplierCard from "@/components/supplier-card";
import AddInvoiceModal from "@/components/add-invoice-modal";
import { type SupplierWithInvoices } from "@shared/schema";
import { Plus } from "lucide-react";

export default function Suppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithInvoices | null>(null);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);

  const { data: suppliers, isLoading } = useQuery<SupplierWithInvoices[]>({
    queryKey: ["/api/suppliers"],
  });

  const handleAddInvoice = (supplier: SupplierWithInvoices) => {
    setSelectedSupplier(supplier);
    setIsAddInvoiceModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddInvoiceModalOpen(false);
    setSelectedSupplier(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid gap-6">
        {suppliers?.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onAddInvoice={() => handleAddInvoice(supplier)}
          />
        ))}
        
        {suppliers?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <i className="fas fa-users text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first supplier.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        )}
      </div>

      {selectedSupplier && (
        <AddInvoiceModal
          supplier={selectedSupplier}
          isOpen={isAddInvoiceModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
