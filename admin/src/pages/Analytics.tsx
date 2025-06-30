import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import Chart from '../components/Chart';
import LineChart from '../components/LineChart';

const Analytics: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 1250 },
    { month: 'Feb', revenue: 52000, bookings: 1420 },
    { month: 'Mar', revenue: 48000, bookings: 1380 },
    { month: 'Apr', revenue: 61000, bookings: 1650 },
    { month: 'May', revenue: 58000, bookings: 1580 },
    { month: 'Jun', revenue: 67000, bookings: 1820 }
  ];

  const customerSegmentData = [
    { label: 'Regular', value: 2450 },
    { label: 'Premium', value: 1890 },
    { label: 'Business', value: 1230 },
    { label: 'Student', value: 980 },
    { label: 'Senior', value: 650 }
  ];

  const peakHoursData = [
    { label: '6-9 AM', value: 85 },
    { label: '9-12 PM', value: 65 },
    { label: '12-3 PM', value: 45 },
    { label: '3-6 PM', value: 70 },
    { label: '6-9 PM', value: 90 }
  ];

  const seasonalData = [
    { label: 'Spring', value: 78 },
    { label: 'Summer', value: 95 },
    { label: 'Fall', value: 82 },
    { label: 'Winter', value: 65 }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Monthly Revenue"
          value="$67,000"
          change="+15.6% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-500"
        />
        <MetricCard
          title="Total Customers"
          value="7,200"
          change="+12.3% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <MetricCard
          title="Avg. Booking Value"
          value="$36.80"
          change="+5.2% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-purple-500"
        />
        <MetricCard
          title="Monthly Bookings"
          value="1,820"
          change="+18.4% from last month"
          changeType="positive"
          icon={Calendar}
          iconColor="bg-amber-500"
        />
      </div>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart title="Revenue & Bookings Trend (6 Months)" data={monthlyData} />
        <Chart
          title="Customer Segments"
          data={customerSegmentData}
          type="bar"
          color="bg-blue-500"
        />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart
          title="Peak Booking Hours"
          data={peakHoursData}
          type="bar"
          color="bg-green-500"
        />
        <Chart
          title="Seasonal Demand (%)"
          data={seasonalData}
          type="bar"
          color="bg-purple-500"
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">94.5%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">87.2%</div>
            <div className="text-sm text-gray-600">On-Time Performance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.3%</div>
            <div className="text-sm text-gray-600">Cancellation Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;