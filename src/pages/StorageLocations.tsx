import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search, Plus, Filter } from "lucide-react";
import { mockStorageLocations, StorageLocationType, StorageStatus, tenantWarehouseMap } from "@/lib/mockData";
import { useTenant } from "@/contexts/TenantContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().min(1, "Location ID is required"),
  type: z.enum(["standard", "inbound", "outbound", "removal", "picking", "rgb"]),
  coordinateX: z.coerce.number().min(1, "X coordinate must be at least 1"),
  coordinateY: z.coerce.number().min(1, "Y coordinate must be at least 1"),
  coordinateZ: z.coerce.number().min(1, "Z coordinate must be at least 1"),
  sequenceNumber: z.coerce.number().min(1, "Sequence number must be at least 1"),
  status: z.enum(["0", "1", "2"]),
});

export default function StorageLocations() {
  const { selectedTenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locations, setLocations] = useState(mockStorageLocations);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      type: "standard",
      coordinateX: 1,
      coordinateY: 1,
      coordinateZ: 1,
      sequenceNumber: 1,
      status: "0",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tenantWarehouse = tenantWarehouseMap[selectedTenant];
    const newLocation = {
      warehouseNumber: tenantWarehouse,
      id: values.id,
      type: values.type as StorageLocationType,
      sequenceNumber: values.sequenceNumber,
      coordinateX: values.coordinateX,
      coordinateY: values.coordinateY,
      coordinateZ: values.coordinateZ,
      status: parseInt(values.status) as StorageStatus,
    };
    setLocations([...locations, newLocation]);
    toast.success("Storage location added successfully");
    setDialogOpen(false);
    form.reset();
  };

  const filteredLocations = locations.filter((location) => {
    const tenantWarehouse = tenantWarehouseMap[selectedTenant];
    const matchesTenant = location.warehouseNumber === tenantWarehouse;
    const matchesSearch = 
      location.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.warehouseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || location.status.toString() === statusFilter;
    const matchesType = typeFilter === "all" || location.type === typeFilter;
    return matchesTenant && matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: StorageStatus) => {
    const config = {
      0: { label: "Free", className: "bg-green-100 text-green-800 border-green-200" },
      1: { label: "Occupied", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      2: { label: "Blocked", className: "bg-red-100 text-red-800 border-red-200" },
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  const getTypeBadge = (type: StorageLocationType) => {
    const labels: Record<StorageLocationType, string> = {
      standard: "Standard",
      inbound: "Inbound",
      outbound: "Outbound",
      removal: "Removal",
      picking: "Picking",
      rgb: "RGB/ASRS",
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Storage Locations</h1>
          <p className="text-muted-foreground">Manage warehouse storage structure</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Storage Location</DialogTitle>
              <DialogDescription>
                Create a new storage location for {tenantWarehouseMap[selectedTenant]}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location ID</FormLabel>
                      <FormControl>
                        <Input placeholder="SL-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="inbound">Inbound</SelectItem>
                          <SelectItem value="outbound">Outbound</SelectItem>
                          <SelectItem value="removal">Removal</SelectItem>
                          <SelectItem value="picking">Picking</SelectItem>
                          <SelectItem value="rgb">RGB/ASRS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinateX"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coordinateY"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coordinateZ"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Z</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="sequenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sequence Number</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Free</SelectItem>
                          <SelectItem value="1">Occupied</SelectItem>
                          <SelectItem value="2">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Location</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or warehouse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="0">Free</SelectItem>
                <SelectItem value="1">Occupied</SelectItem>
                <SelectItem value="2">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="removal">Removal</SelectItem>
                <SelectItem value="picking">Picking</SelectItem>
                <SelectItem value="rgb">RGB/ASRS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Storage Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Locations</CardTitle>
          <CardDescription>
            {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location ID</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Coordinates (X-Y-Z)</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.id}</TableCell>
                    <TableCell>{location.warehouseNumber}</TableCell>
                    <TableCell>{getTypeBadge(location.type)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {location.coordinateX}-{location.coordinateY}-{location.coordinateZ}
                    </TableCell>
                    <TableCell>{location.sequenceNumber}</TableCell>
                    <TableCell>{getStatusBadge(location.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}