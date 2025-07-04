"use client";

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
} from "recharts";

interface BarGraphProps<T> {
  data: T[];
  xAxisKey: keyof T;
  yAxisKey: keyof T;
  barColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  legend?: boolean;
  yAxisDomain?: [number | string, number | string];
  height?: number;
}

const CustomAxisTick = ({ x, y, payload }: any) => {
  if (!payload || !payload.value) {
    return null;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={3}
        dx={10}
        textAnchor="start"
        fill="hsl(var(--muted-foreground))"
        fontSize={10}
        transform="rotate(45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export function BarGraph<T extends Record<string, any>>({
  data,
  xAxisKey,
  yAxisKey,
  barColor = "hsl(var(--primary))",
  xAxisLabel,
  yAxisLabel,
  title,
  yAxisDomain,
  legend = true,
  height = 500,
}: BarGraphProps<T>) {
  return (
    <div className={`w-full`} style={{ height: `${height}px` }}>
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 120, // Increased bottom margin for rotated labels
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
            tickFormatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : value
            }
          >
            {yAxisLabel && (
              <Label value={yAxisLabel} angle={-90} position="insideLeft" />
            )}
          </YAxis>
          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              const formattedValue =
                typeof value === "number" ? value.toFixed(4) : value;
              return [formattedValue, props.payload?.fullName || name];
            }}
            contentStyle={{
              background: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          {legend && <Legend wrapperStyle={{ bottom: 10, left: 20 }} />}
          <Bar dataKey={yAxisKey as string} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
