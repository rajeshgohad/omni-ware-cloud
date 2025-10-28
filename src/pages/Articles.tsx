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
import { Search, Plus, Filter, AlertTriangle, TrendingUp } from "lucide-react";
import { mockArticles, ArticleType } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().min(1, "Article ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["production_order", "complete_tool", "tool_component", "material", "production_equipment", "testing_equipment", "consumables", "special_material", "spare_parts"]),
  weight: z.coerce.number().min(0, "Weight must be positive"),
  unit: z.string().min(1, "Unit is required"),
  minStock: z.coerce.number().min(0, "Min stock must be positive"),
  reorderPoint: z.coerce.number().min(0, "Reorder point must be positive"),
  maxStock: z.coerce.number().min(0, "Max stock must be positive"),
  currentStock: z.coerce.number().min(0, "Current stock must be positive"),
});

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [articles, setArticles] = useState(mockArticles);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      type: "material",
      weight: 0,
      unit: "kg",
      minStock: 0,
      reorderPoint: 0,
      maxStock: 0,
      currentStock: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newArticle = {
      id: values.id,
      name: values.name,
      type: values.type as ArticleType,
      weight: values.weight,
      unit: values.unit,
      minStock: values.minStock,
      reorderPoint: values.reorderPoint,
      maxStock: values.maxStock,
      currentStock: values.currentStock,
    };
    setArticles([...articles, newArticle]);
    toast.success("Article added successfully");
    setDialogOpen(false);
    form.reset();
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = 
      article.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || article.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStockLevel = (article: typeof mockArticles[0]) => {
    const percentage = (article.currentStock / article.maxStock) * 100;
    if (article.currentStock <= article.reorderPoint) {
      return { color: "bg-red-500", status: "critical" };
    } else if (article.currentStock <= article.reorderPoint * 1.5) {
      return { color: "bg-yellow-500", status: "warning" };
    }
    return { color: "bg-green-500", status: "good" };
  };

  const getTypeBadge = (type: ArticleType) => {
    const labels: Record<ArticleType, string> = {
      production_order: "Production Order",
      complete_tool: "Complete Tool",
      tool_component: "Tool Component",
      material: "Material",
      production_equipment: "Production Equipment",
      testing_equipment: "Testing Equipment",
      consumables: "Consumables",
      special_material: "Special Material",
      spare_parts: "Spare Parts",
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground">Manage warehouse inventory items</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Article</DialogTitle>
              <DialogDescription>
                Create a new article in the warehouse inventory
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ART-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Article name" {...field} />
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
                          <SelectItem value="production_order">Production Order</SelectItem>
                          <SelectItem value="complete_tool">Complete Tool</SelectItem>
                          <SelectItem value="tool_component">Tool Component</SelectItem>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="production_equipment">Production Equipment</SelectItem>
                          <SelectItem value="testing_equipment">Testing Equipment</SelectItem>
                          <SelectItem value="consumables">Consumables</SelectItem>
                          <SelectItem value="special_material">Special Material</SelectItem>
                          <SelectItem value="spare_parts">Spare Parts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reorderPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Point</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Article</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {articles.filter(a => a.currentStock <= a.reorderPoint).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Optimal Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {articles.filter(a => a.currentStock > a.reorderPoint).length}
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="tool_component">Tool Component</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
                <SelectItem value="spare_parts">Spare Parts</SelectItem>
                <SelectItem value="production_equipment">Production Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Article Inventory</CardTitle>
          <CardDescription>
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Min / Reorder / Max</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => {
                  const stockInfo = getStockLevel(article);
                  const stockPercentage = (article.currentStock / article.maxStock) * 100;
                  return (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.id}</TableCell>
                      <TableCell>{article.name}</TableCell>
                      <TableCell>{getTypeBadge(article.type)}</TableCell>
                      <TableCell>{article.weight} {article.unit}</TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {article.minStock} / {article.reorderPoint} / {article.maxStock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{article.currentStock} {article.unit}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={stockPercentage} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {stockInfo.status === "critical" && (
                              <span className="text-red-600 font-medium">Below reorder point</span>
                            )}
                            {stockInfo.status === "warning" && (
                              <span className="text-yellow-600 font-medium">Low stock</span>
                            )}
                            {stockInfo.status === "good" && (
                              <span className="text-green-600 font-medium">Optimal</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}