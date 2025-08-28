import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ItemSelector from "./item-selector";
import { Trash2 } from "lucide-react";
import { type Item } from "@shared/schema";

interface InvoiceLine {
  id: string;
  itemName: string;
  itemPrice: string;
  quantity: number;
  itemId?: string;
  total: number;
}

interface InvoiceLineFormProps {
  line: InvoiceLine;
  index: number;
  onUpdate: (updates: Partial<InvoiceLine>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function InvoiceLineForm({
  line,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: InvoiceLineFormProps) {
  const [validationState, setValidationState] = useState<"none" | "exists" | "new" | "duplicate">("none");

  const handleItemSelect = (item: Item | null, isDuplicate: boolean) => {
    if (isDuplicate) {
      setValidationState("duplicate");
    } else if (item) {
      setValidationState("exists");
      onUpdate({
        itemName: item.name,
        itemPrice: item.price,
        itemId: item.id,
      });
    } else if (line.itemName && line.itemPrice) {
      setValidationState("new");
      onUpdate({ itemId: undefined });
    } else {
      setValidationState("none");
    }
  };

  const handleQuantityChange = (quantity: number) => {
    onUpdate({ quantity });
  };

  const handlePriceChange = (price: string) => {
    onUpdate({ itemPrice: price });
    // Re-validate when price changes
    if (line.itemName && price) {
      handleItemSelect(null, false);
    }
  };

  useEffect(() => {
    // Update validation state when line changes
    if (line.itemName && line.itemPrice) {
      if (line.itemId) {
        setValidationState("exists");
      } else {
        setValidationState("new");
      }
    } else {
      setValidationState("none");
    }
  }, [line]);

  const getValidationMessage = () => {
    switch (validationState) {
      case "exists":
        return {
          type: "success",
          message: "Item exists in database",
          className: "text-green-700 bg-green-50",
          icon: "fas fa-check-circle",
        };
      case "new":
        return {
          type: "info",
          message: "New item will be created",
          className: "text-blue-700 bg-blue-50",
          icon: "fas fa-plus-circle",
        };
      case "duplicate":
        return {
          type: "error",
          message: "Duplicate item detected in this invoice",
          className: "text-red-700 bg-red-50 validation-error",
          icon: "fas fa-exclamation-triangle",
        };
      default:
        return null;
    }
  };

  const validation = getValidationMessage();

  return (
    <div className="border border-border rounded-lg p-3 sm:p-4 bg-secondary/50 invoice-line-animation" data-testid={`invoice-line-${index}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Item Selector */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Item
            </Label>
            <ItemSelector
              value={line.itemName}
              price={line.itemPrice}
              onSelect={handleItemSelect}
              placeholder="Search or enter item name..."
              data-testid={`input-item-name-${index}`}
            />
          </div>

          {/* Price */}
          <div className="lg:col-span-3">
            <Label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Price
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={line.itemPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="text-sm"
              data-testid={`input-item-price-${index}`}
            />
          </div>

          {/* Quantity */}
          <div className="lg:col-span-2">
            <Label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Qty
            </Label>
            <Input
              type="number"
              min="1"
              placeholder="1"
              value={line.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="text-sm"
              data-testid={`input-quantity-${index}`}
            />
          </div>

          {/* Line Total */}
          <div className="lg:col-span-2">
            <Label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
              Total
            </Label>
            <div 
              className="px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-medium"
              data-testid={`text-line-total-${index}`}
            >
              ${line.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Remove Line Button */}
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive/80 self-center sm:self-end"
            data-testid={`button-remove-line-${index}`}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>

      {/* Validation Messages */}
      {validation && (
        <div className="mt-2">
          <div className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${validation.className}`}>
            <i className={`${validation.icon} w-3 h-3`}></i>
            <span>{validation.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
