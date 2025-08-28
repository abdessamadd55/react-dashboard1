import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SupplierWithInvoices } from "@shared/schema";

interface SupplierSelectorProps {
  value?: string;
  onSelect: (supplier: SupplierWithInvoices | null) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export default function SupplierSelector({
  value,
  onSelect,
  placeholder = "Select a supplier...",
  "data-testid": testId,
}: SupplierSelectorProps) {
  const { data: suppliers = [] } = useQuery<SupplierWithInvoices[]>({
    queryKey: ["/api/suppliers"],
  });

  const handleValueChange = (supplierId: string) => {
    const selectedSupplier = suppliers.find(supplier => supplier.id === supplierId);
    onSelect(selectedSupplier || null);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger data-testid={testId}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {suppliers.map((supplier) => (
          <SelectItem key={supplier.id} value={supplier.id}>
            <div className="flex flex-col">
              <span className="font-medium">{supplier.name}</span>
              <span className="text-xs text-muted-foreground">{supplier.address}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}