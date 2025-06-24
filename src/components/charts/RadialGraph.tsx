'use client';

import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RadialGraphProps<T> {
  data: T[];
  dataKey: keyof T;
  nameKey: keyof T;
  title?: string;
  showLegend?: boolean;
}

// Example data structure expected:
// const data = [
//   { name: 'Category A', value: 300, fill: '#8884d8' },
//   { name: 'Category B', value: 450, fill: '#83a6ed' },
// ];

export function RadialGraph<T extends { [key: string]: any; fill?: string }>({
  data,
  dataKey,
  nameKey,
  title,
  showLegend = true,
}: RadialGraphProps<T>) {
  return (
    <div className="w-full h-96">
      {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="20%" 
          outerRadius="80%" 
          barSize={10} 
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background
            dataKey={dataKey as string}
          >
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${(index % 5) + 1}))`} />
            ))}
          </RadialBar>
          {showLegend && <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />}
          <Tooltip
             contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
