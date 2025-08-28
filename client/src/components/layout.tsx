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
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-primary">InvoiceManager</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:flex lg:w-64 bg-card border-r border-border p-4 lg:p-6 min-h-screen">
          <div className="w-full">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-lg lg:text-xl font-bold text-primary flex items-center gap-2">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />
                InvoiceManager
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                Supplier & Invoice Management
              </p>
            </div>
            
            <nav className="space-y-1 lg:space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-md transition-colors cursor-pointer text-sm lg:text-base",
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
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-card border-b border-border px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold">{pageInfo.title}</h2>
                <p className="text-sm lg:text-base text-muted-foreground">
                  {pageInfo.description}
                </p>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="min-h-[calc(100vh-theme(spacing.16))] lg:min-h-[calc(100vh-theme(spacing.20))]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-colors cursor-pointer min-w-[60px]",
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
