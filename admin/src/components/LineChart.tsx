import React from 'react';

interface LineChartProps {
  title: string;
  data: Array<{ month: string; revenue: number; bookings: number }>;
}

const LineChart: React.FC<LineChartProps> = ({ title, data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxBookings = Math.max(...data.map(d => d.bookings));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Revenue line */}
          <polyline
            points={data.map((d, i) => `${(i * 400) / (data.length - 1)},${200 - (d.revenue / maxRevenue) * 180}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />
          
          {/* Bookings line */}
          <polyline
            points={data.map((d, i) => `${(i * 400) / (data.length - 1)},${200 - (d.bookings / maxBookings) * 180}`).join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={(i * 400) / (data.length - 1)}
                cy={200 - (d.revenue / maxRevenue) * 180}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all cursor-pointer"
              />
              <circle
                cx={(i * 400) / (data.length - 1)}
                cy={200 - (d.bookings / maxBookings) * 180}
                r="4"
                fill="#10b981"
                className="hover:r-6 transition-all cursor-pointer"
              />
            </g>
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          {data.map(d => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue ($)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;