import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FC } from 'react';

// Define the shape of the data
interface GraphData {
  condition: string; // Strategy name (e.g., "SMA10 over SMA50")
  value: number; // Score in [-1, 1]
}

interface BarGraphProps {
  data: GraphData[];
}

const BarGraph: FC<BarGraphProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <XAxis
            dataKey="condition"
            label={{
              value: 'Trading Strategies',
              position: 'insideBottom',
              offset: -10,
            }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis
            domain={[-1, 1]}
            label={{
              value: 'Predicted Score',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
            }}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip formatter={(value: number) => value.toFixed(6)} />
          <Bar
            dataKey="value"
            fill="#8884d8"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;