
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Truck, Package, Calendar, MapPin, Download, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Shipment } from '@shared/schema';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface ShipmentListProps {
  shipments: Shipment[];
}

const ShipmentList: React.FC<ShipmentListProps> = ({ shipments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [filters, setFilters] = useState({
    consignor: '',
    consignee: '',
    consignorLocation: '',
    consigneeLocation: '',
    truckNumber: '',
    natureOfGoods: ''
  });
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/shipments/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({
        title: 'Shipment deleted',
        description: 'The shipment has been successfully deleted.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete shipment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Extract unique values for dropdown options, filtering out empty/null values
  const dropdownOptions = useMemo(() => {
    const consignors = [...new Set(shipments.map(s => s.consignor).filter(Boolean))];
    const consignees = [...new Set(shipments.map(s => s.consignee).filter(Boolean))];
    const consignorLocations = [...new Set(shipments.map(s => s.consignorLocation).filter(Boolean))];
    const consigneeLocations = [...new Set(shipments.map(s => s.consigneeLocation).filter(Boolean))];
    const truckNumbers = [...new Set(shipments.map(s => s.truckNumber).filter(Boolean))];
    const natureOfGoods = [...new Set(shipments.map(s => s.natureOfGoods).filter(Boolean))];

    return {
      consignors,
      consignees,
      consignorLocations,
      consigneeLocations,
      truckNumbers,
      natureOfGoods
    };
  }, [shipments]);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.consignmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.consignor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (filters.consignor === '' || shipment.consignor === filters.consignor) &&
      (filters.consignee === '' || shipment.consignee === filters.consignee) &&
      (filters.consignorLocation === '' || shipment.consignorLocation === filters.consignorLocation) &&
      (filters.consigneeLocation === '' || shipment.consigneeLocation === filters.consigneeLocation) &&
      (filters.truckNumber === '' || shipment.truckNumber === filters.truckNumber) &&
      (filters.natureOfGoods === '' || shipment.natureOfGoods === filters.natureOfGoods);

    return matchesSearch && matchesFilters;
  });

  const downloadExcel = () => {
    if (filteredShipments.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = filteredShipments.map(shipment => ({
      'Date': format(new Date(shipment.date), 'yyyy-MM-dd'),
      'Consignment Number': shipment.consignmentNumber,
      'Truck Number': shipment.truckNumber,
      'Consignee': shipment.consignee,
      'Consignee Location': shipment.consigneeLocation,
      'Weight (kg)': shipment.weight,
      'Rate ($)': shipment.rate,
      'Delivery Charge ($)': shipment.deliveryCharge,
      'Freight ($)': shipment.freight,
      'Consignor Location': shipment.consignorLocation,
      'No. of Articles': shipment.numberOfArticles,
      'Nature of Goods': shipment.natureOfGoods,
      'Consignor': shipment.consignor,
      'Notes': shipment.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments');
    
    const fileName = `shipments_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const clearFilters = () => {
    setFilters({
      consignor: '',
      consignee: '',
      consignorLocation: '',
      consigneeLocation: '',
      truckNumber: '',
      natureOfGoods: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipment Records ({filteredShipments.length} of {shipments.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
              <Button onClick={downloadExcel} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by consignment number, truck, consignee, or consignor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Select value={filters.consignor} onValueChange={(value) => setFilters(prev => ({ ...prev, consignor: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Consignor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consignors</SelectItem>
                {dropdownOptions.consignors.map(consignor => (
                  <SelectItem key={consignor} value={consignor}>{consignor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.consignee} onValueChange={(value) => setFilters(prev => ({ ...prev, consignee: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Consignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consignees</SelectItem>
                {dropdownOptions.consignees.map(consignee => (
                  <SelectItem key={consignee} value={consignee}>{consignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.consignorLocation} onValueChange={(value) => setFilters(prev => ({ ...prev, consignorLocation: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Origins</SelectItem>
                {dropdownOptions.consignorLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.consigneeLocation} onValueChange={(value) => setFilters(prev => ({ ...prev, consigneeLocation: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {dropdownOptions.consigneeLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.truckNumber} onValueChange={(value) => setFilters(prev => ({ ...prev, truckNumber: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Truck" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trucks</SelectItem>
                {dropdownOptions.truckNumbers.map(truck => (
                  <SelectItem key={truck} value={truck}>{truck}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.natureOfGoods} onValueChange={(value) => setFilters(prev => ({ ...prev, natureOfGoods: value === 'all' ? '' : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Goods Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dropdownOptions.natureOfGoods.map(goods => (
                  <SelectItem key={goods} value={goods}>{goods}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    ${(Number(shipment.freight) + Number(shipment.deliveryCharge)).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Consignor → Consignee</div>
                <div className="text-sm font-medium">
                  {shipment.consignor || 'N/A'} → {shipment.consignee || 'N/A'}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(shipment.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
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
              {searchTerm || Object.values(filters).some(f => f !== '') ? 'Try adjusting your search terms or filters' : 'Add your first shipment to get started'}
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
                <p className="font-semibold">${Number(selectedShipment.rate).toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Delivery Charge</label>
                <p className="font-semibold">${Number(selectedShipment.deliveryCharge).toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Freight</label>
                <p className="font-semibold">${Number(selectedShipment.freight).toFixed(2)}</p>
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
