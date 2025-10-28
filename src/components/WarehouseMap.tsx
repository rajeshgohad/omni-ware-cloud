import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageLocation } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WarehouseMapProps {
  locations: StorageLocation[];
}

interface SingleWarehouseGridProps {
  warehouseNumber: string;
  locations: StorageLocation[];
}

function SingleWarehouseGrid({ warehouseNumber, locations }: SingleWarehouseGridProps) {
  // Get the max X and Y coordinates to create the grid
  const maxX = Math.max(...locations.map(l => l.coordinateX), 0);
  const maxY = Math.max(...locations.map(l => l.coordinateY), 0);

  // Create a map for quick lookup
  const locationMap = new Map<string, StorageLocation[]>();
  locations.forEach(loc => {
    const key = `${loc.coordinateX}-${loc.coordinateY}`;
    if (!locationMap.has(key)) {
      locationMap.set(key, []);
    }
    locationMap.get(key)?.push(loc);
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "bg-green-200 border-2 border-green-400"; // Free
      case 1: return "bg-amber-200 border-2 border-amber-400"; // Occupied
      case 2: return "bg-red-200 border-2 border-red-400"; // Blocked
      default: return "bg-gray-200 border-2 border-gray-400";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return "Free";
      case 1: return "Occupied";
      case 2: return "Blocked";
      default: return "Unknown";
    }
  };

  if (maxX === 0 || maxY === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No locations available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">{warehouseNumber}</h3>
      <div className="overflow-auto p-4 bg-muted/30 rounded-lg">
        <TooltipProvider>
          <div className="inline-block">
            {Array.from({ length: maxY }, (_, yIndex) => {
              const y = maxY - yIndex; // Reverse Y to show from top to bottom
              return (
                <div key={y} className="flex gap-2">
                  {Array.from({ length: maxX }, (_, xIndex) => {
                    const x = xIndex + 1;
                    const key = `${x}-${y}`;
                    const locsAtPosition = locationMap.get(key) || [];
                    
                    if (locsAtPosition.length === 0) {
                      return (
                        <div
                          key={key}
                          className="w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded flex-shrink-0"
                        />
                      );
                    }

                    // If multiple locations at same X-Y, show the first one
                    const location = locsAtPosition[0];
                    const hasMultiple = locsAtPosition.length > 1;

                    return (
                        <Tooltip key={key}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-16 h-16 ${getStatusColor(location.status)} rounded cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center justify-center relative flex-shrink-0`}
                            >
                              <span className="text-xs font-semibold text-gray-800">
                                {String.fromCharCode(64 + location.coordinateX)}-{location.coordinateY.toString().padStart(2, '0')}-{location.coordinateZ.toString().padStart(2, '0')}
                              </span>
                              {hasMultiple && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                                  {locsAtPosition.length}
                                </span>
                              )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {locsAtPosition.map((loc, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-semibold">{loc.id}</div>
                                <div>Position: X{loc.coordinateX}-Y{loc.coordinateY}-Z{loc.coordinateZ}</div>
                                <div>Type: {loc.type}</div>
                                <div>Status: {getStatusLabel(loc.status)}</div>
                                {idx < locsAtPosition.length - 1 && <hr className="my-1" />}
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

export function WarehouseMap({ locations }: WarehouseMapProps) {
  // Group locations by warehouse
  const warehouseGroups = {
    "WH-001": locations.filter(loc => loc.warehouseNumber === "WH-001"),
    "WH-002": locations.filter(loc => loc.warehouseNumber === "WH-002"),
    "WH-003": locations.filter(loc => loc.warehouseNumber === "WH-003"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Maps</CardTitle>
        <CardDescription>
          Visual representation of storage locations across all warehouses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded" />
              <span>Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-200 border-2 border-amber-400 rounded" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-400 rounded" />
              <span>Blocked</span>
            </div>
          </div>

          {/* Three warehouses side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SingleWarehouseGrid 
              warehouseNumber="WH-001" 
              locations={warehouseGroups["WH-001"]} 
            />
            <SingleWarehouseGrid 
              warehouseNumber="WH-002" 
              locations={warehouseGroups["WH-002"]} 
            />
            <SingleWarehouseGrid 
              warehouseNumber="WH-003" 
              locations={warehouseGroups["WH-003"]} 
            />
          </div>

          {/* Position Labels */}
          <div className="text-xs text-muted-foreground">
            Grid shows X (horizontal) and Y (vertical) coordinates. Multiple Z levels at the same position are indicated with a number badge.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
