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
}

export function BarGraph<T extends Record<string, any>>({
  data,
  xAxisKey,
  yAxisKey,
  barColor = 'hsl(var(--primary))',
  xAxisLabel,
  yAxisLabel,
  title,
}: BarGraphProps<T>) {
  return (
    <div className="w-full h-96">
      {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey as string}>
            {xAxisLabel && (
              <Label value={xAxisLabel} offset={-30} position="insideBottom" />
            )}
          </XAxis>
          <YAxis>
            {yAxisLabel && (
              <Label value={yAxisLabel} angle={-90} position="insideLeft" />
            )}
          </YAxis>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Legend wrapperStyle={{ bottom: 0, left: 20 }} />
          <Bar dataKey={yAxisKey as string} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
