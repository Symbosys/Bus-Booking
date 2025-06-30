import React from 'react';

interface ChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  type: 'bar' | 'line';
  color: string;
}

const Chart: React.FC<ChartProps> = ({ title, data, type, color }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm font-medium text-gray-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
            <div className="w-16 text-sm font-semibold text-gray-900 text-right">
              {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;