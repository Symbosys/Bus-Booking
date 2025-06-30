import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  passenger: string;
  route: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
}

const RecentBookings: React.FC = () => {
  const bookings: Booking[] = [
    {
      id: 'BK001',
      passenger: 'Alice Johnson',
      route: 'New York → Boston',
      date: '2025-01-15',
      status: 'confirmed',
      amount: 45
    },
    {
      id: 'BK002',
      passenger: 'Bob Smith',
      route: 'Los Angeles → San Francisco',
      date: '2025-01-15',
      status: 'pending',
      amount: 65
    },
    {
      id: 'BK003',
      passenger: 'Carol White',
      route: 'Chicago → Detroit',
      date: '2025-01-14',
      status: 'confirmed',
      amount: 35
    },
    {
      id: 'BK004',
      passenger: 'David Brown',
      route: 'Miami → Orlando',
      date: '2025-01-14',
      status: 'cancelled',
      amount: 28
    },
    {
      id: 'BK005',
      passenger: 'Eva Davis',
      route: 'Seattle → Portland',
      date: '2025-01-13',
      status: 'confirmed',
      amount: 42
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-900">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-900">Passenger</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-900">Route</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-900">Date</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-900">Status</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2 font-medium text-gray-900">{booking.id}</td>
                <td className="py-4 px-2 text-gray-900">{booking.passenger}</td>
                <td className="py-4 px-2 text-gray-600">{booking.route}</td>
                <td className="py-4 px-2 text-gray-600">{booking.date}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right font-semibold text-gray-900">
                  ${booking.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;