
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';

interface BarGraphProps<T> {
  data: T[];
  xAxisKey: keyof T;
  yAxisKey: keyof T;
  barColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  yAxisDomain?: [number | string, number | string];
}

const CustomAxisTick = ({ x, y, payload }: any) => {
  if (!payload || !payload.value) {
    return null;
  }
  // Split label into words to wrap them
  const words = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word, i) => (
        // Render each word as a new tspan element to create a new line
        <text key={i} x={0} y={0} dy={16 + i * 12} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={10}>
          {word}
        </text>
      ))}
    </g>
  );
};


export function BarGraph<T extends Record<string, any>>({
  data,
  xAxisKey,
  yAxisKey,
  barColor = 'hsl(var(--primary))',
  xAxisLabel,
  yAxisLabel,
  title,
  yAxisDomain,
}: BarGraphProps<T>) {
  return (
    <div className="w-full h-[500px]">
      {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 80, // Increased bottom margin to accommodate wrapped labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey as string} 
            interval={0}
            tick={<CustomAxisTick />}
          >
            {xAxisLabel && (
              <Label value={xAxisLabel} offset={-30} position="insideBottom" />
            )}
          </XAxis>
          <YAxis
            domain={yAxisDomain}
            tickFormatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
          >
            {yAxisLabel && (
              <Label value={yAxisLabel} angle={-90} position="insideLeft" />
            )}
          </YAxis>
          <Tooltip
            formatter={(value: unknown) => (typeof value === 'number' ? value.toFixed(4) : value)}
            contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Legend wrapperStyle={{ bottom: 10, left: 20 }} />
          <Bar dataKey={yAxisKey as string} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
