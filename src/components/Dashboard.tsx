
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Truck, Package, DollarSign, Weight, Users, MapPin } from 'lucide-react';
import { Shipment, DashboardMetrics } from '@/types/shipment';

interface DashboardProps {
  shipments: Shipment[];
}

const Dashboard: React.FC<DashboardProps> = ({ shipments }) => {
  const calculateMetrics = (): DashboardMetrics => {
    if (shipments.length === 0) {
      return {
        totalTrips: 0,
        totalRevenue: 0,
        averageWeight: 0,
        totalWeight: 0,
        uniqueTrucks: 0,
        uniqueConsignors: 0,
      };
    }

    const totalRevenue = shipments.reduce((sum, s) => sum + s.freight + s.deliveryCharge, 0);
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0);
    const uniqueTrucks = new Set(shipments.map(s => s.truckNumber)).size;
    const uniqueConsignors = new Set(shipments.map(s => s.consignor)).size;

    return {
      totalTrips: shipments.length,
      totalRevenue,
      averageWeight: totalWeight / shipments.length,
      totalWeight,
      uniqueTrucks,
      uniqueConsignors,
    };
  };

  const metrics = calculateMetrics();

  // Top trucks by usage
  const truckData = shipments.reduce((acc, shipment) => {
    const truck = shipment.truckNumber;
    if (!acc[truck]) {
      acc[truck] = { truck, trips: 0, revenue: 0 };
    }
    acc[truck].trips += 1;
    acc[truck].revenue += shipment.freight + shipment.deliveryCharge;
    return acc;
  }, {} as Record<string, { truck: string; trips: number; revenue: number }>);

  const topTrucks = Object.values(truckData)
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 5);

  // Revenue by consignor
  const consignorData = shipments.reduce((acc, shipment) => {
    const consignor = shipment.consignor || 'Unknown';
    if (!acc[consignor]) {
      acc[consignor] = { consignor, revenue: 0, trips: 0 };
    }
    acc[consignor].revenue += shipment.freight + shipment.deliveryCharge;
    acc[consignor].trips += 1;
    return acc;
  }, {} as Record<string, { consignor: string; revenue: number; trips: number }>);

  const topConsignors = Object.values(consignorData)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Goods distribution
  const goodsData = shipments.reduce((acc, shipment) => {
    const goods = shipment.natureOfGoods || 'General';
    acc[goods] = (acc[goods] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goodsChartData = Object.entries(goodsData).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly revenue (simplified - using creation order)
  const monthlyData = shipments
    .slice(-12) // Last 12 entries as proxy for months
    .map((shipment, index) => ({
      month: `Month ${index + 1}`,
      revenue: shipment.freight + shipment.deliveryCharge,
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTrips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalWeight.toFixed(1)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageWeight.toFixed(1)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trucks</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueTrucks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consignors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueConsignors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Trucks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Trucks by Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTrucks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="truck" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Consignors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Consignors by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topConsignors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="consignor" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Goods Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goodsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goodsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#FFBB28" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
