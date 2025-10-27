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
import { Search, Plus, Filter, AlertTriangle, TrendingUp } from "lucide-react";
import { mockArticles, ArticleType } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredArticles = mockArticles.filter((article) => {
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockArticles.length}</div>
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
              {mockArticles.filter(a => a.currentStock <= a.reorderPoint).length}
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
              {mockArticles.filter(a => a.currentStock > a.reorderPoint).length}
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
                        <div className="font-medium">{article.currentStock} {article.unit}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {article.minStock} | Max: {article.maxStock}
                        </div>
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