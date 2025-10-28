import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  TruckIcon, 
  FileText,
  LogOut,
  Building2,
  ScanLine,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { mockTenants } from "@/lib/mockData";
import { useTenant } from "@/contexts/TenantContext";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/storage-locations", icon: Warehouse, label: "Storage Locations" },
  { path: "/articles", icon: Package, label: "Articles" },
  { path: "/transport-orders", icon: TruckIcon, label: "Transport Orders" },
  { path: "/requests", icon: FileText, label: "Requests" },
  { path: "/scan", icon: ScanLine, label: "Scan" },
  { path: "/process", icon: Settings, label: "Process" },
];

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { selectedTenant, setSelectedTenant } = useTenant();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <Building2 className="h-8 w-8 text-sidebar-primary flex-shrink-0" />
          {open && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-sidebar-foreground truncate">OmniWare</h1>
              <p className="text-xs text-sidebar-foreground/70 truncate">WMS Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Tenant Selector */}
        {open && (
          <div className="px-4 py-4 border-b border-sidebar-border">
            <label className="text-xs text-sidebar-foreground/70 mb-2 block">Active Tenant</label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full">
          <header className="h-14 border-b bg-background flex items-center px-4 gap-2 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}