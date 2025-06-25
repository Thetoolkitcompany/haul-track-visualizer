import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Eye, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import type { Shipment } from '@shared/schema';

const ShipmentDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null);
  const { toast } = useToast();

  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['/api/shipments'],
    queryFn: () => apiRequest('/api/shipments'),
  });

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

  const filteredShipments = shipments.filter((shipment: Shipment) =>
    Object.values(shipment).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(shipments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments');
    XLSX.writeFile(workbook, `shipments_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: 'Export successful',
      description: 'Shipments data has been exported to Excel.',
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipment Data</CardTitle>
          <CardDescription>Loading shipment records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load shipment data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shipment Data Table</CardTitle>
            <CardDescription>
              Complete view of all shipment records ({filteredShipments.length} entries)
            </CardDescription>
          </div>
          <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Consignment #</TableHead>
                <TableHead>Truck #</TableHead>
                <TableHead>Consignor</TableHead>
                <TableHead>Consignee</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Freight (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No shipments match your search.' : 'No shipments found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment: Shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      {format(new Date(shipment.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {shipment.consignmentNumber}
                    </TableCell>
                    <TableCell>{shipment.truckNumber}</TableCell>
                    <TableCell>{shipment.consignor}</TableCell>
                    <TableCell>{shipment.consignee}</TableCell>
                    <TableCell>{Number(shipment.weight).toFixed(2)}</TableCell>
                    <TableCell>₹{Number(shipment.freight).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingShipment(shipment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Shipment Details</DialogTitle>
                              <DialogDescription>
                                Complete information for consignment #{viewingShipment?.consignmentNumber}
                              </DialogDescription>
                            </DialogHeader>
                            {viewingShipment && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                                    <p>{format(new Date(viewingShipment.date), 'dd MMM yyyy')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Consignment Number</Label>
                                    <p>{viewingShipment.consignmentNumber}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Truck Number</Label>
                                    <p>{viewingShipment.truckNumber}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Consignor</Label>
                                    <p>{viewingShipment.consignor}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Consignor Location</Label>
                                    <p>{viewingShipment.consignorLocation}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Consignee</Label>
                                    <p>{viewingShipment.consignee}</p>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Consignee Location</Label>
                                    <p>{viewingShipment.consigneeLocation}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Weight</Label>
                                    <p>{Number(viewingShipment.weight).toFixed(2)} kg</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Rate</Label>
                                    <p>₹{Number(viewingShipment.rate).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Delivery Charge</Label>
                                    <p>₹{Number(viewingShipment.deliveryCharge).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Freight</Label>
                                    <p>₹{Number(viewingShipment.freight).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Number of Articles</Label>
                                    <p>{viewingShipment.numberOfArticles}</p>
                                  </div>
                                </div>
                                <div className="col-span-2 space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Nature of Goods</Label>
                                    <p>{viewingShipment.natureOfGoods}</p>
                                  </div>
                                  {viewingShipment.notes && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-500">Notes</Label>
                                      <p>{viewingShipment.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(shipment.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentDataTable;