'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Cell,
} from 'recharts';

const defaultColorScale = (value: number, min: number, max: number): string => {
  if (max === min) return 'hsl(var(--primary))';
  const ratio = (value - min) / (max - min);
  // A scale from blue (low) to red (high)
  const hue = (1 - ratio) * 240; 
  return `hsl(${hue}, 70%, 50%)`;
};


interface HeatmapProps<T> {
  data: T[];
  xAxisKey: keyof T;
  yAxisKey: keyof T;
  valueKey: keyof T;
  colorScale?: (value: number, min: number, max: number) => string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

export function Heatmap<T extends Record<string, any>>({
  data,
  xAxisKey,
  yAxisKey,
  valueKey,
  colorScale = defaultColorScale,
  xAxisLabel,
  yAxisLabel,
  title,
}: HeatmapProps<T>) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d[valueKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  const xCategories = [...new Set(data.map((d) => d[xAxisKey]))];
  const yCategories = [...new Set(data.map((d) => d[yAxisKey]))];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 border rounded-md bg-background shadow-lg text-sm">
          <p>{`${String(xAxisKey)}: ${data[xAxisKey]}`}</p>
          <p>{`${String(yAxisKey)}: ${data[yAxisKey]}`}</p>
          <p>{`${String(valueKey)}: ${data[valueKey]}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 40,
            left: 40,
          }}
        >
          <CartesianGrid />
          <XAxis type="category" dataKey={xAxisKey as string} name={xAxisKey as string} ticks={xCategories} interval={0} tick={{ fontSize: 12 }}>
             {xAxisLabel && (
              <Label value={xAxisLabel} offset={-30} position="insideBottom" />
            )}
          </XAxis>
          <YAxis type="category" dataKey={yAxisKey as string} name={yAxisKey as string} ticks={yCategories} interval={0} tick={{ fontSize: 12 }}>
             {yAxisLabel && (
              <Label value={yAxisLabel} angle={-90} position="insideLeft" />
            )}
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter name="Heatmap" data={data} shape="square" isAnimationActive={false}>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorScale(entry[valueKey], minValue, maxValue)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
