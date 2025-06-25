
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Truck, Package, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useResources } from '@/hooks/useResources';
import SearchableSelect from '@/components/SearchableSelect';

interface ShipmentFormData {
  date: Date | undefined;
  consignmentNumber: string;
  truckNumber: string;
  consignee: string;
  consigneeLocation: string;
  weight: string;
  rate: string;
  deliveryCharge: string;
  freight: number;
  consignorLocation: string;
  numberOfArticles: string;
  natureOfGoods: string;
  consignor: string;
  notes: string;
}

interface ShipmentFormProps {
  onSubmit: (data: any) => void;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const { resources } = useResources();
  const [formData, setFormData] = useState<ShipmentFormData>({
    date: new Date(),
    consignmentNumber: '',
    truckNumber: '',
    consignee: '',
    consigneeLocation: '',
    weight: '',
    rate: '',
    deliveryCharge: '',
    freight: 0,
    consignorLocation: '',
    numberOfArticles: '',
    natureOfGoods: '',
    consignor: '',
    notes: '',
  });

  // Calculate freight automatically when weight, rate, or delivery charge changes
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const deliveryCharge = parseFloat(formData.deliveryCharge) || 0;
    
    const calculatedFreight = (weight / 1000) * rate + deliveryCharge;
    setFormData(prev => ({ ...prev, freight: calculatedFreight }));
  }, [formData.weight, formData.rate, formData.deliveryCharge]);

  const handleInputChange = (field: keyof ShipmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.consignmentNumber || !formData.truckNumber) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in Date, Consignment Number, and Truck Number.",
        variant: "destructive"
      });
      return;
    }

    const shipmentData = {
      date: format(formData.date, 'yyyy-MM-dd'),
      consignmentNumber: formData.consignmentNumber,
      truckNumber: formData.truckNumber,
      consignee: formData.consignee,
      consigneeLocation: formData.consigneeLocation,
      weight: parseFloat(formData.weight) || 0,
      rate: parseFloat(formData.rate) || 0,
      deliveryCharge: parseFloat(formData.deliveryCharge) || 0,
      freight: formData.freight,
      consignorLocation: formData.consignorLocation,
      numberOfArticles: parseInt(formData.numberOfArticles) || 0,
      natureOfGoods: formData.natureOfGoods,
      consignor: formData.consignor,
      notes: formData.notes,
    };

    onSubmit(shipmentData);
    
    // Reset form
    setFormData({
      date: new Date(),
      consignmentNumber: '',
      truckNumber: '',
      consignee: '',
      consigneeLocation: '',
      weight: '',
      rate: '',
      deliveryCharge: '',
      freight: 0,
      consignorLocation: '',
      numberOfArticles: '',
      natureOfGoods: '',
      consignor: '',
      notes: '',
    });

    toast({
      title: "Shipment Added",
      description: "New shipment record has been created successfully.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          New Shipment Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Consignment Number */}
          <div className="space-y-2">
            <Label htmlFor="consignmentNumber">Consignment Number *</Label>
            <Input
              id="consignmentNumber"
              value={formData.consignmentNumber}
              onChange={(e) => handleInputChange('consignmentNumber', e.target.value)}
              placeholder="CNS001"
            />
          </div>

          {/* Truck Number - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="truckNumber">Truck Number *</Label>
            <SearchableSelect
              options={resources.truckNumbers}
              value={formData.truckNumber}
              onValueChange={(value) => handleInputChange('truckNumber', value)}
              placeholder="Select or enter truck number"
            />
          </div>

          {/* Consignee - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="consignee">Consignee</Label>
            <SearchableSelect
              options={resources.consignees}
              value={formData.consignee}
              onValueChange={(value) => handleInputChange('consignee', value)}
              placeholder="Select or enter consignee"
            />
          </div>

          {/* Consignee Location - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="consigneeLocation">Consignee Location</Label>
            <SearchableSelect
              options={resources.consigneeLocations}
              value={formData.consigneeLocation}
              onValueChange={(value) => handleInputChange('consigneeLocation', value)}
              placeholder="Select or enter location"
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <Label htmlFor="rate">Rate ($)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Delivery Charge */}
          <div className="space-y-2">
            <Label htmlFor="deliveryCharge">Delivery Charge ($)</Label>
            <Input
              id="deliveryCharge"
              type="number"
              step="0.01"
              value={formData.deliveryCharge}
              onChange={(e) => handleInputChange('deliveryCharge', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Freight - Auto calculated */}
          <div className="space-y-2">
            <Label htmlFor="freight">Freight ($) - Auto Calculated</Label>
            <Input
              id="freight"
              type="number"
              step="0.01"
              value={formData.freight.toFixed(2)}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Formula: (Weight/1000) × Rate + Delivery Charge</p>
          </div>

          {/* Consignor Location - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="consignorLocation">Consignor Location</Label>
            <SearchableSelect
              options={resources.consignorLocations}
              value={formData.consignorLocation}
              onValueChange={(value) => handleInputChange('consignorLocation', value)}
              placeholder="Select or enter location"
            />
          </div>

          {/* Number of Articles - Changed to text field */}
          <div className="space-y-2">
            <Label htmlFor="numberOfArticles">No. of Articles</Label>
            <Input
              id="numberOfArticles"
              type="text"
              value={formData.numberOfArticles}
              onChange={(e) => handleInputChange('numberOfArticles', e.target.value)}
              placeholder="e.g. 5 boxes, 2 pallets"
            />
          </div>

          {/* Nature of Goods - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="natureOfGoods">Nature of Goods</Label>
            <SearchableSelect
              options={resources.natureOfGoods}
              value={formData.natureOfGoods}
              onValueChange={(value) => handleInputChange('natureOfGoods', value)}
              placeholder="Select or enter goods type"
            />
          </div>

          {/* Consignor - Searchable */}
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="consignor">Consignor</Label>
            <SearchableSelect
              options={resources.consignors}
              value={formData.consignor}
              onValueChange={(value) => handleInputChange('consignor', value)}
              placeholder="Select or enter consignor"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or special instructions..."
              rows={3}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Button type="submit" className="w-full">
              Add Shipment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShipmentForm;
