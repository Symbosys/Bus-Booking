import React from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';

const BookingManagement: React.FC = () => {
  const bookings = [
    {
      id: 'BK001',
      passenger: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      route: 'New York → Boston',
      date: '2025-01-15',
      time: '08:30 AM',
      seats: ['A12', 'A13'],
      status: 'confirmed',
      amount: 90,
      paymentMethod: 'Credit Card',
      bookingDate: '2025-01-10'
    },
    {
      id: 'BK002',
      passenger: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 234-5678',
      route: 'Los Angeles → San Francisco',
      date: '2025-01-16',
      time: '10:15 AM',
      seats: ['B05'],
      status: 'pending',
      amount: 65,
      paymentMethod: 'PayPal',
      bookingDate: '2025-01-11'
    },
    {
      id: 'BK003',
      passenger: 'Carol White',
      email: 'carol.white@email.com',
      phone: '+1 (555) 345-6789',
      route: 'Chicago → Detroit',
      date: '2025-01-17',
      time: '02:45 PM',
      seats: ['C08'],
      status: 'confirmed',
      amount: 35,
      paymentMethod: 'Credit Card',
      bookingDate: '2025-01-12'
    },
    {
      id: 'BK004',
      passenger: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 456-7890',
      route: 'Miami → Orlando',
      date: '2025-01-18',
      time: '11:20 AM',
      seats: ['D15', 'D16'],
      status: 'cancelled',
      amount: 56,
      paymentMethod: 'Debit Card',
      bookingDate: '2025-01-09'
    }
  ];

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
            <p className="text-gray-600 mt-1">Manage customer bookings and reservations</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Bookings</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Routes</option>
            <option value="ny-boston">New York - Boston</option>
            <option value="la-sf">Los Angeles - San Francisco</option>
            <option value="chicago-detroit">Chicago - Detroit</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Booking ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Passenger</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Route</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Travel Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Seats</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{booking.id}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{booking.passenger}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{booking.route}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{booking.date}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{booking.seats.join(', ')}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">${booking.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors" title="Edit Booking">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors" title="Cancel Booking">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;