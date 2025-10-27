// Mock data for WMS prototype

export const mockTenants = [
  { id: "tenant-1", name: "Acme Manufacturing" },
  { id: "tenant-2", name: "TechCorp Industries" },
  { id: "tenant-3", name: "Global Warehouse Co" },
];

export type StorageLocationType = 
  | "standard" 
  | "inbound" 
  | "outbound" 
  | "removal" 
  | "picking" 
  | "rgb";

export type StorageStatus = 0 | 1 | 2; // Free=0, Occupied=1, Blocked=2

export interface StorageLocation {
  warehouseNumber: string;
  id: string;
  type: StorageLocationType;
  sequenceNumber: number;
  coordinateX: number;
  coordinateY: number;
  coordinateZ: number;
  status: StorageStatus;
}

export const mockStorageLocations: StorageLocation[] = [
  { warehouseNumber: "WH-001", id: "SL-001", type: "standard", sequenceNumber: 1, coordinateX: 1, coordinateY: 1, coordinateZ: 1, status: 0 },
  { warehouseNumber: "WH-001", id: "SL-002", type: "standard", sequenceNumber: 2, coordinateX: 1, coordinateY: 1, coordinateZ: 2, status: 1 },
  { warehouseNumber: "WH-001", id: "SL-003", type: "inbound", sequenceNumber: 3, coordinateX: 2, coordinateY: 1, coordinateZ: 1, status: 0 },
  { warehouseNumber: "WH-001", id: "SL-004", type: "outbound", sequenceNumber: 4, coordinateX: 3, coordinateY: 1, coordinateZ: 1, status: 1 },
  { warehouseNumber: "WH-001", id: "SL-005", type: "picking", sequenceNumber: 5, coordinateX: 4, coordinateY: 1, coordinateZ: 1, status: 0 },
  { warehouseNumber: "WH-001", id: "SL-006", type: "rgb", sequenceNumber: 6, coordinateX: 5, coordinateY: 1, coordinateZ: 1, status: 2 },
  { warehouseNumber: "WH-001", id: "SL-007", type: "standard", sequenceNumber: 7, coordinateX: 1, coordinateY: 2, coordinateZ: 1, status: 1 },
  { warehouseNumber: "WH-001", id: "SL-008", type: "standard", sequenceNumber: 8, coordinateX: 1, coordinateY: 2, coordinateZ: 2, status: 0 },
];

export type ArticleType = 
  | "production_order"
  | "complete_tool"
  | "tool_component"
  | "material"
  | "production_equipment"
  | "testing_equipment"
  | "consumables"
  | "special_material"
  | "spare_parts";

export interface Article {
  id: string;
  type: ArticleType;
  name: string;
  weight: number;
  unit: string;
  minStock: number;
  reorderPoint: number;
  maxStock: number;
  currentStock: number;
}

export const mockArticles: Article[] = [
  { id: "ART-001", type: "material", name: "Steel Plate 10mm", weight: 25.5, unit: "kg", minStock: 10, reorderPoint: 20, maxStock: 100, currentStock: 45 },
  { id: "ART-002", type: "tool_component", name: "Drill Bit Set", weight: 2.3, unit: "kg", minStock: 5, reorderPoint: 10, maxStock: 50, currentStock: 15 },
  { id: "ART-003", type: "consumables", name: "Cutting Fluid 5L", weight: 5.0, unit: "L", minStock: 20, reorderPoint: 30, maxStock: 200, currentStock: 85 },
  { id: "ART-004", type: "spare_parts", name: "Motor Bearing", weight: 0.8, unit: "kg", minStock: 15, reorderPoint: 25, maxStock: 80, currentStock: 30 },
  { id: "ART-005", type: "production_equipment", name: "Welding Electrode", weight: 1.2, unit: "kg", minStock: 50, reorderPoint: 75, maxStock: 300, currentStock: 120 },
];

export type TransportOrderStatus = "pending" | "in_progress" | "completed" | "failed";

export interface TransportOrder {
  clientId: string;
  transportOrderId: string;
  warehouseNumber: string;
  storageUnitId: string;
  source: string;
  destination: string;
  timestamp: string;
  priority: number;
  requestId: string;
  status: TransportOrderStatus;
}

export const mockTransportOrders: TransportOrder[] = [
  { clientId: "tenant-1", transportOrderId: "TO-001", warehouseNumber: "WH-001", storageUnitId: "SU-001", source: "SL-001", destination: "SL-003", timestamp: "2025-10-27T10:30:00", priority: 1, requestId: "REQ-001", status: "completed" },
  { clientId: "tenant-1", transportOrderId: "TO-002", warehouseNumber: "WH-001", storageUnitId: "SU-002", source: "SL-002", destination: "SL-004", timestamp: "2025-10-27T11:00:00", priority: 2, requestId: "REQ-002", status: "in_progress" },
  { clientId: "tenant-1", transportOrderId: "TO-003", warehouseNumber: "WH-001", storageUnitId: "SU-003", source: "SL-005", destination: "SL-007", timestamp: "2025-10-27T11:30:00", priority: 3, requestId: "REQ-003", status: "pending" },
  { clientId: "tenant-1", transportOrderId: "TO-004", warehouseNumber: "WH-001", storageUnitId: "SU-004", source: "SL-003", destination: "SL-008", timestamp: "2025-10-27T09:15:00", priority: 1, requestId: "REQ-004", status: "failed" },
];

export type RequestType = "inbound" | "outbound" | "picking" | "inventory";
export type RequestStatus = "created" | "assigned" | "processing" | "completed" | "cancelled";

export interface Request {
  clientId: string;
  requestId: string;
  requestType: RequestType;
  articleType: ArticleType;
  articleId: string;
  quantity: number;
  coordinateA: number;
  coordinateB: number;
  coordinateC: number;
  timestamp: string;
  status: RequestStatus;
}

export const mockRequests: Request[] = [
  { clientId: "tenant-1", requestId: "REQ-001", requestType: "inbound", articleType: "material", articleId: "ART-001", quantity: 10, coordinateA: 1, coordinateB: 1, coordinateC: 1, timestamp: "2025-10-27T10:00:00", status: "completed" },
  { clientId: "tenant-1", requestId: "REQ-002", requestType: "outbound", articleType: "tool_component", articleId: "ART-002", quantity: 5, coordinateA: 2, coordinateB: 1, coordinateC: 1, timestamp: "2025-10-27T10:45:00", status: "processing" },
  { clientId: "tenant-1", requestId: "REQ-003", requestType: "picking", articleType: "consumables", articleId: "ART-003", quantity: 15, coordinateA: 3, coordinateB: 1, coordinateC: 1, timestamp: "2025-10-27T11:15:00", status: "assigned" },
  { clientId: "tenant-1", requestId: "REQ-004", requestType: "inbound", articleType: "spare_parts", articleId: "ART-004", quantity: 8, coordinateA: 1, coordinateB: 2, coordinateC: 1, timestamp: "2025-10-27T09:00:00", status: "completed" },
];