import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type InvoiceWithSupplierAndLines, type Item, type SupplierWithInvoices } from "@shared/schema";
import { TrendingUp, DollarSign, FileText, Package, Users } from "lucide-react";

export default function Reports() {
  const { data: invoices } = useQuery<InvoiceWithSupplierAndLines[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: items } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const { data: suppliers } = useQuery<SupplierWithInvoices[]>({
    queryKey: ["/api/suppliers"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  };

  // Calculate statistics
  const totalInvoices = invoices?.length || 0;
  const totalAmount = invoices?.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0) || 0;
  const averageInvoiceAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0;
  const totalItems = items?.length || 0;
  const totalSuppliers = suppliers?.length || 0;

  // Recent invoices (last 5)
  const recentInvoices = invoices?.slice(0, 5) || [];

  // Top suppliers by invoice count
  const supplierStats = suppliers?.map(supplier => ({
    ...supplier,
    invoiceCount: supplier.invoices.length,
    totalAmount: supplier.invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0)
  })).sort((a, b) => b.invoiceCount - a.invoiceCount).slice(0, 5) || [];

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Overview of your business metrics and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card data-testid="metric-total-invoices">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-total-invoices">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              All time invoices
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-total-revenue">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all invoices
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-average-invoice">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Invoice</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-average-invoice">
              {formatCurrency(averageInvoiceAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per invoice
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-total-suppliers">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-total-suppliers">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Total suppliers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium" data-testid={`recent-invoice-number-${invoice.id}`}>
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`recent-invoice-supplier-${invoice.id}`}>
                        {invoice.supplier?.name}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`recent-invoice-date-${invoice.id}`}>
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold" data-testid={`recent-invoice-amount-${invoice.id}`}>
                        {formatCurrency(parseFloat(invoice.amount))}
                      </p>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supplierStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No suppliers yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supplierStats.map((supplier, index) => (
                  <div key={supplier.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium" data-testid={`top-supplier-name-${supplier.id}`}>
                          {supplier.name}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`top-supplier-invoices-${supplier.id}`}>
                          {supplier.invoiceCount} invoices
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold" data-testid={`top-supplier-total-${supplier.id}`}>
                        {formatCurrency(supplier.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="inventory-total-items">
                {totalItems}
              </p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="inventory-avg-price">
                {items && items.length > 0 
                  ? formatCurrency(items.reduce((sum, item) => sum + parseFloat(item.price), 0) / items.length)
                  : formatCurrency(0)
                }
              </p>
              <p className="text-sm text-muted-foreground">Average Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="inventory-highest-price">
                {items && items.length > 0 
                  ? formatCurrency(Math.max(...items.map(item => parseFloat(item.price))))
                  : formatCurrency(0)
                }
              </p>
              <p className="text-sm text-muted-foreground">Highest Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="inventory-lowest-price">
                {items && items.length > 0 
                  ? formatCurrency(Math.min(...items.map(item => parseFloat(item.price))))
                  : formatCurrency(0)
                }
              </p>
              <p className="text-sm text-muted-foreground">Lowest Price</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}