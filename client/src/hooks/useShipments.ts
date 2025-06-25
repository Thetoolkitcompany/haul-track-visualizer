
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Shipment, InsertShipment } from '@shared/schema';

export const useShipments = () => {
  const { toast } = useToast();

  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['/api/shipments'],
    queryFn: () => apiRequest('/api/shipments'),
  });

  const addShipmentMutation = useMutation({
    mutationFn: (shipmentData: any) => {
      const insertData: InsertShipment = {
        date: new Date(shipmentData.date),
        consignmentNumber: shipmentData.consignmentNumber || '',
        truckNumber: shipmentData.truckNumber || '',
        consignee: shipmentData.consignee || '',
        consigneeLocation: shipmentData.consigneeLocation || '',
        weight: shipmentData.weight?.toString() || '0',
        rate: shipmentData.rate?.toString() || '0',
        deliveryCharge: shipmentData.deliveryCharge?.toString() || '0',
        freight: shipmentData.freight?.toString() || '0',
        consignorLocation: shipmentData.consignorLocation || '',
        numberOfArticles: parseInt(shipmentData.numberOfArticles) || 0,
        natureOfGoods: shipmentData.natureOfGoods || '',
        consignor: shipmentData.consignor || '',
        notes: shipmentData.notes || '',
      };
      return apiRequest('/api/shipments', {
        method: 'POST',
        body: JSON.stringify(insertData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({
        title: 'Shipment added',
        description: 'The shipment has been successfully added.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add shipment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const addShipment = (shipmentData: any) => {
    addShipmentMutation.mutate(shipmentData);
  };

  return {
    shipments,
    addShipment,
    isLoading,
    error,
    isAddingShipment: addShipmentMutation.isPending,
  };
};
