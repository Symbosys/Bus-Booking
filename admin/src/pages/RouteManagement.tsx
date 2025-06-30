import React from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';

const RouteManagement: React.FC = () => {
  const routes = [
    {
      id: 'RT001',
      name: 'New York - Boston Express',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      distance: '215 miles',
      duration: '4h 30m',
      price: 45,
      status: 'active',
      frequency: 'Daily'
    },
    {
      id: 'RT002',
      name: 'LA - San Francisco Coastal',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      distance: '382 miles',
      duration: '7h 15m',
      price: 65,
      status: 'active',
      frequency: 'Daily'
    },
    {
      id: 'RT003',
      name: 'Chicago - Detroit Direct',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      distance: '284 miles',
      duration: '5h 45m',
      price: 35,
      status: 'maintenance',
      frequency: 'Weekdays'
    },
    {
      id: 'RT004',
      name: 'Miami - Orlando Tourist',
      origin: 'Miami, FL',
      destination: 'Orlando, FL',
      distance: '235 miles',
      duration: '4h 20m',
      price: 28,
      status: 'active',
      frequency: 'Daily'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Route Management</h2>
            <p className="text-gray-600 mt-1">Manage bus routes and schedules</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add New Route</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Route ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Route Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Origin - Destination</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Distance</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Duration</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Frequency</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{route.id}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{route.name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{route.origin} → {route.destination}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{route.distance}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{route.duration}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-gray-900 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{route.price}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{route.frequency}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
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

export default RouteManagement;