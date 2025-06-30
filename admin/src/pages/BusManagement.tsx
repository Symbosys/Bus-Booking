import React from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const BusManagement: React.FC = () => {
  const buses = [
    {
      id: 'BUS001',
      model: 'Mercedes Sprinter',
      capacity: 52,
      route: 'New York - Boston',
      status: 'active',
      lastMaintenance: '2025-01-10'
    },
    {
      id: 'BUS002',
      model: 'Volvo 9700',
      capacity: 45,
      route: 'Los Angeles - San Francisco',
      status: 'maintenance',
      lastMaintenance: '2025-01-08'
    },
    {
      id: 'BUS003',
      model: 'Scania Touring',
      capacity: 48,
      route: 'Chicago - Detroit',
      status: 'active',
      lastMaintenance: '2025-01-12'
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
          <h2 className="text-2xl font-bold text-gray-900">Bus Management</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add New Bus</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Bus ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Model</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Capacity</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Route</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Maintenance</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{bus.id}</td>
                  <td className="py-4 px-6 text-gray-900">{bus.model}</td>
                  <td className="py-4 px-6 text-gray-600">{bus.capacity} seats</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{bus.route}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                      {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{bus.lastMaintenance}</td>
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

export default BusManagement;