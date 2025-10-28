import { useState } from "react";
import { Camera, ScanLine, ArrowDownToLine, HandIcon, MoveIcon, ListChecks, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockArticles, mockStorageLocations } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";


interface ScannedItemType {
  code: string;
  name: string;
  type: string;
  weight: string;
  location: string;
  timestamp: Date;
}

const Scan = () => {
  const [scannedItem, setScannedItem] = useState<ScannedItemType | null>(null);
  const [recentScans, setRecentScans] = useState<ScannedItemType[]>([]);

  const handleScan = () => {
    // Simulate scanning - in production, this would integrate with a real barcode scanner
    // Using first article from mockData as example
    const article = mockArticles[0];
    const location = mockStorageLocations.find(loc => 
      loc.status === 1 && loc.warehouseNumber === "WH-001"
    );

    if (location) {
      const newScan: ScannedItemType = {
        code: article.id,
        name: article.name,
        type: article.type,
        weight: `${article.weight} kg`,
        location: `${String.fromCharCode(64 + location.coordinateX)}-${String(location.coordinateY).padStart(2, '0')}-${String(location.coordinateZ).padStart(2, '0')}`,
        timestamp: new Date()
      };
      
      setScannedItem(newScan);
      setRecentScans(prev => [newScan, ...prev].slice(0, 10)); // Keep last 10 scans
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Scan Item</h1>
        <p className="text-muted-foreground">Scan barcode to view item details</p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {/* Scanner Box */}
        <Card className="border-2 border-dashed">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-48 h-48 rounded-lg bg-muted flex items-center justify-center">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                </div>
                <ScanLine className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 text-primary animate-pulse" />
              </div>
              
              <Button onClick={handleScan} size="lg" className="w-full max-w-xs">
                <Camera className="mr-2 h-5 w-5" />
                Scan Barcode
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Position the barcode within the camera view
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        {scannedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Scanned item information</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <dt className="font-medium text-muted-foreground">Code:</dt>
                  <dd className="font-semibold">{scannedItem.code}</dd>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <dt className="font-medium text-muted-foreground">Name:</dt>
                  <dd className="font-semibold">{scannedItem.name}</dd>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <dt className="font-medium text-muted-foreground">Type:</dt>
                  <dd className="font-semibold">{scannedItem.type}</dd>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <dt className="font-medium text-muted-foreground">Weight:</dt>
                  <dd className="font-semibold">{scannedItem.weight}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="font-medium text-muted-foreground">Location:</dt>
                  <dd className="font-semibold">{scannedItem.location}</dd>
                </div>
              </dl>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="default" className="w-full">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Putaway
                </Button>
                <Button variant="secondary" className="w-full">
                  <HandIcon className="mr-2 h-4 w-4" />
                  Pick
                </Button>
                <Button variant="outline" className="w-full">
                  <MoveIcon className="mr-2 h-4 w-4" />
                  Move
                </Button>
                <Button variant="outline" className="w-full">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Count
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Previously scanned items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{scan.name}</p>
                      <p className="text-sm text-muted-foreground">{scan.code} • {scan.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(scan.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scan;
