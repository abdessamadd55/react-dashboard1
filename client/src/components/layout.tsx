import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Users, 
  File, 
  Package, 
  BarChart3 
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/suppliers", icon: Users, label: "Suppliers", active: location === "/" || location === "/suppliers" },
    { href: "/invoices", icon: File, label: "Invoices", active: location === "/invoices" },
    { href: "/items", icon: Package, label: "Items", active: location === "/items" },
    { href: "/reports", icon: BarChart3, label: "Reports", active: location === "/reports" },
  ];

  const getPageInfo = () => {
    if (location === "/" || location === "/suppliers") {
      return { title: "Suppliers", description: "Manage your suppliers and their invoices" };
    } else if (location === "/invoices") {
      return { title: "Invoices", description: "Track and manage all your invoices" };
    } else if (location === "/items") {
      return { title: "Items", description: "Manage your inventory items and pricing" };
    } else if (location === "/reports") {
      return { title: "Reports", description: "View business metrics and analytics" };
    }
    return { title: "Page Not Found", description: "The page you're looking for doesn't exist" };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            InvoiceManager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Supplier & Invoice Management
          </p>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{pageInfo.title}</h2>
              <p className="text-muted-foreground">
                {pageInfo.description}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        {children}
      </main>
    </div>
  );
}
