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
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm" data-testid={`supplier-card-${supplier.id}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground truncate" data-testid={`supplier-name-${supplier.id}`}>
            {supplier.name}
          </h3>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1 mt-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
              <span className="break-words" data-testid={`supplier-address-${supplier.id}`}>{supplier.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span data-testid={`supplier-phone-${supplier.id}`}>{supplier.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={onAddInvoice}
            size="sm"
            className="text-xs sm:text-sm"
            data-testid={`button-add-invoice-${supplier.id}`}
          >
            <Plus className="w-3 h-3 mr-1" />
            <span className="hidden xs:inline">Add Invoice</span>
            <span className="xs:hidden">Add</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-testid={`button-edit-supplier-${supplier.id}`}
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
          <File className="w-3 h-3 sm:w-4 sm:h-4" />
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 bg-secondary rounded-md hover:bg-accent transition-colors cursor-pointer"
                data-testid={`invoice-item-${invoice.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <File className="w-2 h-2 sm:w-3 sm:h-3 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate" data-testid={`invoice-number-${invoice.id}`}>
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`invoice-date-${invoice.id}`}>
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 sm:ml-auto">
                  <p className="font-semibold text-xs sm:text-sm" data-testid={`invoice-amount-${invoice.id}`}>
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
                className="w-full mt-3 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                data-testid={`button-view-all-invoices-${supplier.id}`}
              >
                View all invoices →
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <File className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
