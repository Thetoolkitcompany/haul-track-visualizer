
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Plus, List, Settings } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import ShipmentForm from '@/components/ShipmentForm';
import ShipmentList from '@/components/ShipmentList';
import ResourceManagement from '@/components/ResourceManagement';
import { useShipments } from '@/hooks/useShipments';

const Index = () => {
  const { shipments, addShipment } = useShipments();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Logistics CRM Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your shipments, track performance, and analyze logistics data
          </p>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add-shipment" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Shipment
            </TabsTrigger>
            <TabsTrigger value="shipments" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All Shipments
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard shipments={shipments} />
          </TabsContent>

          {/* Add Shipment Tab */}
          <TabsContent value="add-shipment" className="space-y-6">
            <ShipmentForm onSubmit={addShipment} />
          </TabsContent>

          {/* Shipments List Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <ShipmentList shipments={shipments} />
          </TabsContent>

          {/* Resources Management Tab */}
          <TabsContent value="resources" className="space-y-6">
            <ResourceManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
