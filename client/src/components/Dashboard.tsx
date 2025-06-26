import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Truck, Package, DollarSign, Weight, Users, Calendar, Filter } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, isWithinInterval } from 'date-fns';
import type { Shipment } from '@shared/schema';

interface DashboardMetrics {
  totalTrips: number;
  totalRevenue: number;
  averageWeight: number;
  totalWeight: number;
  uniqueTrucks: number;
  uniqueConsignors: number;
}

interface DashboardProps {
  shipments: Shipment[];
}

type DateFilter = 'current_week' | 'current_month' | 'current_quarter' | 'current_financial_year' | 'custom';

const Dashboard: React.FC<DashboardProps> = ({ shipments }) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('current_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Financial year starts in April
  const getFinancialYearDates = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const currentMonth = date.getMonth();
    
    if (currentMonth >= 3) { // April (3) onwards is current financial year
      return {
        start: new Date(year, 3, 1), // April 1st
        end: new Date(year + 1, 2, 31) // March 31st next year
      };
    } else {
      return {
        start: new Date(year - 1, 3, 1), // April 1st previous year
        end: new Date(year, 2, 31) // March 31st current year
      };
    }
  };

  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    
    switch (dateFilter) {
      case 'current_week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'current_month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'current_quarter':
        return { start: startOfQuarter(now), end: endOfQuarter(now) };
      case 'current_financial_year':
        return getFinancialYearDates(now);
      case 'custom':
        if (customStartDate && customEndDate) {
          return { 
            start: new Date(customStartDate), 
            end: new Date(customEndDate) 
          };
        }
        return { start: startOfMonth(now), end: endOfMonth(now) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const filteredShipments = useMemo(() => {
    const { start, end } = getDateRange();
    
    return shipments.filter(shipment => {
      const shipmentDate = new Date(shipment.date);
      return isWithinInterval(shipmentDate, { start, end });
    });
  }, [shipments, dateFilter, customStartDate, customEndDate]);

  const calculateMetrics = (): DashboardMetrics => {
    if (filteredShipments.length === 0) {
      return {
        totalTrips: 0,
        totalRevenue: 0,
        averageWeight: 0,
        totalWeight: 0,
        uniqueTrucks: 0,
        uniqueConsignors: 0,
      };
    }

    const totalRevenue = filteredShipments.reduce((sum, s) => sum + Number(s.freight) + Number(s.deliveryCharge), 0);
    const totalWeight = filteredShipments.reduce((sum, s) => sum + Number(s.weight), 0);
    const uniqueTrucks = new Set(filteredShipments.map(s => s.truckNumber)).size;
    const uniqueConsignors = new Set(filteredShipments.map(s => s.consignor)).size;

    return {
      totalTrips: filteredShipments.length,
      totalRevenue,
      averageWeight: totalWeight / filteredShipments.length,
      totalWeight,
      uniqueTrucks,
      uniqueConsignors,
    };
  };

  const metrics = calculateMetrics();

  // Total trips per truck number for graph
  const truckTripsData = useMemo(() => {
    const truckData = filteredShipments.reduce((acc, shipment) => {
      const truck = shipment.truckNumber;
      if (!acc[truck]) {
        acc[truck] = { truck, trips: 0, revenue: 0 };
      }
      acc[truck].trips += 1;
      acc[truck].revenue += Number(shipment.freight) + Number(shipment.deliveryCharge);
      return acc;
    }, {} as Record<string, { truck: string; trips: number; revenue: number }>);

    return Object.values(truckData)
      .sort((a, b) => b.trips - a.trips);
  }, [filteredShipments]);

  // Total revenue per consignor
  const consignorRevenueData = useMemo(() => {
    const consignorData = filteredShipments.reduce((acc, shipment) => {
      const consignor = shipment.consignor || 'Unknown';
      if (!acc[consignor]) {
        acc[consignor] = { consignor, revenue: 0, trips: 0 };
      }
      acc[consignor].revenue += Number(shipment.freight) + Number(shipment.deliveryCharge);
      acc[consignor].trips += 1;
      return acc;
    }, {} as Record<string, { consignor: string; revenue: number; trips: number }>);

    return Object.values(consignorData)
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredShipments]);

  // Revenue per day - group by date
  const revenuePerDayData = useMemo(() => {
    const dailyData = filteredShipments.reduce((acc, shipment) => {
      const date = format(new Date(shipment.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, trips: 0 };
      }
      acc[date].revenue += Number(shipment.freight) + Number(shipment.deliveryCharge);
      acc[date].trips += 1;
      return acc;
    }, {} as Record<string, { date: string; revenue: number; trips: number }>);

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredShipments]);

  const { start, end } = getDateRange();
  const dateRangeText = `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;

  return (
    <div className="space-y-6">
      {/* Date Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Date Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="date-filter">Time Period</Label>
              <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_week">Current Week</SelectItem>
                  <SelectItem value="current_month">Current Month</SelectItem>
                  <SelectItem value="current_quarter">Current Quarter</SelectItem>
                  <SelectItem value="current_financial_year">Current Financial Year</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateFilter === 'custom' && (
              <>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div className="text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 inline mr-1" />
              {dateRangeText}
            </div>
          </div>
        </CardContent>
      </Card>

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
        {/* Total trips per truck number */}
        <Card>
          <CardHeader>
            <CardTitle>Total Trips per Truck</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={truckTripsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="truck" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total revenue per consignor */}
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue per Consignor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consignorRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="consignor" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue per day */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenuePerDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} 
                />
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