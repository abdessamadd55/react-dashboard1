import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type InvoiceWithSupplierAndLines } from "@shared/schema";
import NewInvoiceModal from "@/components/new-invoice-modal";
import { Plus, FileText, Calendar, DollarSign } from "lucide-react";

export default function Invoices() {
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  const { data: invoices, isLoading } = useQuery<InvoiceWithSupplierAndLines[]>({
    queryKey: ["/api/invoices"],
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 pb-20 lg:pb-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm">
              <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
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
    <div className="p-4 sm:p-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and track all your invoices</p>
        </div>
        <Button 
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="w-full sm:w-auto text-sm"
          data-testid="button-add-invoice"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {invoices && invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by creating your first invoice from a supplier.
            </p>
            <Button 
              onClick={() => setIsNewInvoiceModalOpen(true)}
              data-testid="button-create-first-invoice"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {invoices?.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg" data-testid={`invoice-number-${invoice.id}`}>
                      {invoice.invoiceNumber}
                    </CardTitle>
                    <p className="text-muted-foreground" data-testid={`supplier-name-${invoice.id}`}>
                      {invoice.supplier?.name}
                    </p>
                  </div>
                  <Badge variant="secondary" data-testid={`invoice-status-${invoice.id}`}>
                    Paid
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold" data-testid={`invoice-amount-${invoice.id}`}>
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold" data-testid={`invoice-date-${invoice.id}`}>
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-semibold" data-testid={`invoice-items-count-${invoice.id}`}>
                        {invoice.invoiceLines?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>
                
                {invoice.invoiceLines && invoice.invoiceLines.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Items</h4>
                    <div className="space-y-2">
                      {invoice.invoiceLines.map((line) => (
                        <div key={line.id} className="flex justify-between items-center text-sm">
                          <span data-testid={`line-item-name-${line.id}`}>
                            {line.item?.name} × {line.quantity}
                          </span>
                          <span data-testid={`line-item-total-${line.id}`}>
                            {line.item ? formatCurrency((parseFloat(line.item.price) * line.quantity).toString()) : 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
      />
    </div>
  );
}