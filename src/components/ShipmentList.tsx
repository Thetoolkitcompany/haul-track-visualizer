
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, Package, Calendar, MapPin } from 'lucide-react';
import { Shipment } from '@/types/shipment';
import { format } from 'date-fns';

interface ShipmentListProps {
  shipments: Shipment[];
}

const ShipmentList: React.FC<ShipmentListProps> = ({ shipments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filteredShipments = shipments.filter(shipment =>
    shipment.consignmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.consignor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipment Records ({shipments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by consignment number, truck, consignee, or consignor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{shipment.consignmentNumber}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(shipment.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {shipment.truckNumber}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  <span className="font-medium">From:</span>
                  <span className="text-muted-foreground">{shipment.consignorLocation || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-green-500" />
                  <span className="font-medium">To:</span>
                  <span className="text-muted-foreground">{shipment.consigneeLocation || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Weight</div>
                  <div className="font-semibold">{shipment.weight} kg</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="font-semibold text-green-600">
                    ${(shipment.freight + shipment.deliveryCharge).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Consignor → Consignee</div>
                <div className="text-sm font-medium">
                  {shipment.consignor || 'N/A'} → {shipment.consignee || 'N/A'}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedShipment(shipment)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shipments found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first shipment to get started'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Shipment Details Modal/Card */}
      {selectedShipment && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-background">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Shipment Details: {selectedShipment.consignmentNumber}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedShipment(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="font-semibold">{format(new Date(selectedShipment.date), 'PPP')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Truck Number</label>
                <p className="font-semibold">{selectedShipment.truckNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Weight</label>
                <p className="font-semibold">{selectedShipment.weight} kg</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Consignor</label>
                <p className="font-semibold">{selectedShipment.consignor || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Consignee</label>
                <p className="font-semibold">{selectedShipment.consignee || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Articles</label>
                <p className="font-semibold">{selectedShipment.numberOfArticles}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Origin</label>
                <p className="font-semibold">{selectedShipment.consignorLocation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Destination</label>
                <p className="font-semibold">{selectedShipment.consigneeLocation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nature of Goods</label>
                <p className="font-semibold">{selectedShipment.natureOfGoods || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rate</label>
                <p className="font-semibold">${selectedShipment.rate.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Charge</label>
                <p className="font-semibold">${selectedShipment.deliveryCharge.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Freight</label>
                <p className="font-semibold">${selectedShipment.freight.toFixed(2)}</p>
              </div>
            </div>
            
            {selectedShipment.notes && (
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedShipment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentList;
