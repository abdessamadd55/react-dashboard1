import { Button } from "@/components/ui/button";
import { type SupplierWithInvoices } from "@shared/schema";
import { MapPin, Phone, File, Plus, Edit } from "lucide-react";

interface SupplierCardProps {
  supplier: SupplierWithInvoices;
  onAddInvoice: () => void;
}

export default function SupplierCard({ supplier, onAddInvoice }: SupplierCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!dateObj || isNaN(dateObj.getTime())) return "";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Date formatting error:", error, date);
      return "";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm" data-testid={`supplier-card-${supplier.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground" data-testid={`supplier-name-${supplier.id}`}>
            {supplier.name}
          </h3>
          <div className="text-sm text-muted-foreground space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span data-testid={`supplier-address-${supplier.id}`}>{supplier.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span data-testid={`supplier-phone-${supplier.id}`}>{supplier.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onAddInvoice}
            size="sm"
            data-testid={`button-add-invoice-${supplier.id}`}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Invoice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-testid={`button-edit-supplier-${supplier.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <File className="w-4 h-4" />
          Recent Invoices
          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs" data-testid={`invoice-count-${supplier.id}`}>
            {supplier.invoices.length}
          </span>
        </h4>
        
        {supplier.invoices.length > 0 ? (
          <div className="space-y-2">
            {supplier.invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-md hover:bg-accent transition-colors cursor-pointer"
                data-testid={`invoice-item-${invoice.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <File className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm" data-testid={`invoice-number-${invoice.id}`}>
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`invoice-date-${invoice.id}`}>
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" data-testid={`invoice-amount-${invoice.id}`}>
                    {formatCurrency(invoice.amount)}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor("paid")}`}>
                    Paid
                  </span>
                </div>
              </div>
            ))}
            
            {supplier.invoices.length > 3 && (
              <button 
                className="w-full mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
                data-testid={`button-view-all-invoices-${supplier.id}`}
              >
                View all invoices →
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
