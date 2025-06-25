
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings } from 'lucide-react';
import { useResources } from '@/hooks/useResources';
import { ResourceType, RESOURCE_LABELS } from '@/types/resource';
import { useToast } from '@/hooks/use-toast';

const ResourceManagement = () => {
  const { resources, addResource, removeResource } = useResources();
  const { toast } = useToast();
  const [newValues, setNewValues] = useState<Record<ResourceType, string>>({
    consignors: '',
    consignees: '',
    consignorLocations: '',
    consigneeLocations: '',
    truckNumbers: '',
    natureOfGoods: ''
  });

  const handleAdd = (type: ResourceType) => {
    const value = newValues[type];
    if (!value.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a value to add.",
        variant: "destructive"
      });
      return;
    }

    if (resources[type].includes(value.trim())) {
      toast({
        title: "Duplicate Entry",
        description: "This value already exists in the list.",
        variant: "destructive"
      });
      return;
    }

    addResource(type, value);
    setNewValues(prev => ({ ...prev, [type]: '' }));
    toast({
      title: "Resource Added",
      description: `Added "${value}" to ${RESOURCE_LABELS[type]}.`
    });
  };

  const handleRemove = (type: ResourceType, value: string) => {
    removeResource(type, value);
    toast({
      title: "Resource Removed",
      description: `Removed "${value}" from ${RESOURCE_LABELS[type]}.`
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: ResourceType) => {
    if (e.key === 'Enter') {
      handleAdd(type);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Resource Management
        </h2>
        <p className="text-gray-600">
          Manage dropdown options for shipment entry forms. Add or remove values that will appear in searchable dropdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(RESOURCE_LABELS).map(([type, label]) => (
          <Card key={type} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">{label}</CardTitle>
              <p className="text-sm text-gray-500">
                {resources[type as ResourceType].length} items
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={`Add new ${label.toLowerCase().slice(0, -1)}`}
                  value={newValues[type as ResourceType]}
                  onChange={(e) => setNewValues(prev => ({
                    ...prev,
                    [type]: e.target.value
                  }))}
                  onKeyPress={(e) => handleKeyPress(e, type as ResourceType)}
                />
                <Button 
                  onClick={() => handleAdd(type as ResourceType)}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {resources[type as ResourceType].length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No items added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {resources[type as ResourceType].map((value) => (
                      <Badge 
                        key={value} 
                        variant="secondary" 
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {value}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemove(type as ResourceType, value)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourceManagement;
