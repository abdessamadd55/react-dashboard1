import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { type Item } from "@shared/schema";
import { Search } from "lucide-react";

interface ItemSelectorProps {
  value: string;
  price: string;
  onSelect: (item: Item | null, isDuplicate: boolean) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export default function ItemSelector({
  value,
  price,
  onSelect,
  placeholder = "Search or enter item name...",
  "data-testid": testId,
}: ItemSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exactMatch = items.find(
    (item) =>
      item.name.toLowerCase() === searchTerm.toLowerCase() &&
      item.price === price
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    // Check for exact match when search term or price changes
    if (searchTerm && price) {
      const match = items.find(
        (item) =>
          item.name.toLowerCase() === searchTerm.toLowerCase() &&
          item.price === price
      );
      onSelect(match || null, false);
    }
  }, [searchTerm, price, items, onSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Notify parent component about the change
    onSelect(null, false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleItemSelect = (item: Item) => {
    setSearchTerm(item.name);
    setIsOpen(false);
    onSelect(item, false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pr-10"
          data-testid={testId}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Item Suggestions Dropdown */}
      {isOpen && (searchTerm || filteredItems.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg mt-1 z-10"
          data-testid="dropdown-item-suggestions"
        >
          <div className="max-h-40 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="px-3 py-2 hover:bg-accent cursor-pointer text-sm border-b border-border last:border-b-0"
                  onClick={() => handleItemSelect(item)}
                  data-testid={`suggestion-item-${item.id}`}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              searchTerm && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No existing items found
                </div>
              )
            )}
          </div>
          {searchTerm && !exactMatch && (
            <div className="px-3 py-2 bg-muted text-sm text-center border-t border-border">
              <span className="text-muted-foreground">
                Type price to create new item
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
