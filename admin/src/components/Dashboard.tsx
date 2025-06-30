import React from 'react';
import { DollarSign, Users, Bus, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';
import Chart from './Chart';
import LineChart from './LineChart';
import RecentBookings from './RecentBookings';

const Dashboard: React.FC = () => {
  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 1250 },
    { month: 'Feb', revenue: 52000, bookings: 1420 },
    { month: 'Mar', revenue: 48000, bookings: 1380 },
    { month: 'Apr', revenue: 61000, bookings: 1650 },
    { month: 'May', revenue: 58000, bookings: 1580 },
    { month: 'Jun', revenue: 67000, bookings: 1820 }
  ];

  const routeData = [
    { label: 'NY-Boston', value: 1250 },
    { label: 'LA-SF', value: 980 },
    { label: 'Chicago-Detroit', value: 750 },
    { label: 'Miami-Orlando', value: 650 },
    { label: 'Seattle-Portland', value: 520 }
  ];

  const occupancyData = [
    { label: 'Route A', value: 85 },
    { label: 'Route B', value: 92 },
    { label: 'Route C', value: 78 },
    { label: 'Route D', value: 88 },
    { label: 'Route E', value: 75 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$347,200"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-500"
        />
        <MetricCard
          title="Total Bookings"
          value="8,947"
          change="+8.2% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <MetricCard
          title="Active Buses"
          value="156"
          change="+3 new buses"
          changeType="positive"
          icon={Bus}
          iconColor="bg-purple-500"
        />
        <MetricCard
          title="Avg. Occupancy"
          value="84%"
          change="+2.1% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-amber-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart title="Revenue & Bookings Trend" data={revenueData} />
        <Chart
          title="Popular Routes"
          data={routeData}
          type="bar"
          color="bg-blue-500"
        />
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart
          title="Route Occupancy (%)"
          data={occupancyData}
          type="bar"
          color="bg-green-500"
        />
        <RecentBookings />
      </div>
    </div>
  );
};

export default Dashboard;