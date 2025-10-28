import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Warehouse, 
  TruckIcon, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Box,
  ClipboardList
} from "lucide-react";
import { mockStorageLocations, mockArticles, mockTransportOrders, mockRequests } from "@/lib/mockData";

export default function Dashboard() {
  const totalLocations = mockStorageLocations.length;
  const freeLocations = mockStorageLocations.filter(l => l.status === 0).length;
  const occupiedLocations = mockStorageLocations.filter(l => l.status === 1).length;
  const blockedLocations = mockStorageLocations.filter(l => l.status === 2).length;

  const lowStockArticles = mockArticles.filter(a => a.currentStock <= a.reorderPoint);
  const activeTransportOrders = mockTransportOrders.filter(t => t.status === "in_progress" || t.status === "pending").length;
  const activeRequests = mockRequests.filter(r => r.status !== "completed" && r.status !== "cancelled").length;
  
  const locationUtilization = totalLocations > 0 ? Math.round((occupiedLocations / totalLocations) * 100) : 0;
  const activeArticles = mockArticles.filter(a => a.currentStock > 0).length;
  const pendingOrders = mockTransportOrders.filter(t => t.status === "pending").length;

  const recentTransportOrders = mockTransportOrders.slice(0, 5);
  const recentRequests = mockRequests.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      in_progress: "secondary",
      pending: "outline",
      failed: "destructive",
      processing: "secondary",
      assigned: "outline",
      created: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Warehouse management system overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Locations</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-green-600 font-medium">{freeLocations} Free</span>
              <span className="text-yellow-600 font-medium">{occupiedLocations} Occupied</span>
              <span className="text-red-600 font-medium">{blockedLocations} Blocked</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockArticles.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Articles below reorder point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Transport Orders</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTransportOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">In progress or pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequests}</div>
            <p className="text-xs text-muted-foreground mt-2">Pending processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Location Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationUtilization}%</div>
            <p className="text-xs text-muted-foreground mt-2">{occupiedLocations} of {totalLocations} occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Articles</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeArticles}</div>
            <p className="text-xs text-muted-foreground mt-2">Articles in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transport Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5" />
              Recent Transport Orders
            </CardTitle>
            <CardDescription>Latest warehouse transport activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransportOrders.map((order) => (
                <div key={order.transportOrderId} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{order.transportOrderId}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.source} → {order.destination}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">P{order.priority}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Requests
            </CardTitle>
            <CardDescription>Latest article requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.requestId} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{request.requestId}</div>
                    <div className="text-xs text-muted-foreground">
                      {request.requestType} - {request.articleId} (Qty: {request.quantity})
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockArticles.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Articles requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{article.name}</div>
                    <div className="text-sm text-muted-foreground">{article.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-destructive">{article.currentStock} {article.unit}</div>
                    <div className="text-xs text-muted-foreground">Reorder at: {article.reorderPoint}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}