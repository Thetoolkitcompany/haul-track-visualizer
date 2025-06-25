
export interface ResourceList {
  consignors: string[];
  consignees: string[];
  consignorLocations: string[];
  consigneeLocations: string[];
  truckNumbers: string[];
  natureOfGoods: string[];
}

export type ResourceType = keyof ResourceList;

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  consignors: 'Consignors',
  consignees: 'Consignees', 
  consignorLocations: 'Consignor Locations',
  consigneeLocations: 'Consignee Locations',
  truckNumbers: 'Truck Numbers',
  natureOfGoods: 'Nature of Goods'
};
