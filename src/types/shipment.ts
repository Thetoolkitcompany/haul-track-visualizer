
export interface Shipment {
  id: string;
  date: string;
  consignmentNumber: string;
  truckNumber: string;
  consignee: string;
  consigneeLocation: string;
  weight: number;
  rate: number;
  deliveryCharge: number;
  freight: number;
  consignorLocation: string;
  numberOfArticles: number;
  natureOfGoods: string;
  consignor: string;
  notes?: string;
}

export interface DashboardMetrics {
  totalTrips: number;
  totalRevenue: number;
  averageWeight: number;
  totalWeight: number;
  uniqueTrucks: number;
  uniqueConsignors: number;
}
