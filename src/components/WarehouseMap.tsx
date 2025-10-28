import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageLocation } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WarehouseMapProps {
  locations: StorageLocation[];
}

export function WarehouseMap({ locations }: WarehouseMapProps) {
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
      case 0: return "bg-green-500"; // Free
      case 1: return "bg-amber-500"; // Occupied
      case 2: return "bg-red-500"; // Blocked
      default: return "bg-gray-300";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Map</CardTitle>
        <CardDescription>
          Visual representation of storage locations (X-Y grid)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>Blocked</span>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-auto p-4 bg-muted/30 rounded-lg">
            <TooltipProvider>
              <div className="inline-block">
                {Array.from({ length: maxY }, (_, yIndex) => {
                  const y = maxY - yIndex; // Reverse Y to show from top to bottom
                  return (
                    <div key={y} className="flex gap-1">
                      {Array.from({ length: maxX }, (_, xIndex) => {
                        const x = xIndex + 1;
                        const key = `${x}-${y}`;
                        const locsAtPosition = locationMap.get(key) || [];
                        
                        if (locsAtPosition.length === 0) {
                          return (
                            <div
                              key={key}
                              className="w-10 h-10 bg-background border border-border rounded"
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
                                className={`w-10 h-10 ${getStatusColor(location.status)} rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center relative`}
                              >
                                {hasMultiple && (
                                  <span className="absolute top-0 right-0 bg-background text-xs rounded-full w-4 h-4 flex items-center justify-center text-foreground font-bold">
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

          {/* Position Labels */}
          <div className="text-xs text-muted-foreground">
            Grid shows X (horizontal) and Y (vertical) coordinates. Multiple Z levels at the same position are indicated with a number badge.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
