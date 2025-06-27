
'use client';

import { useState } from 'react';
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarInfo {
  name: string;
  dataKey: string;
  stroke: string;
  fill: string;
}

interface RadarChartProps<T> {
  data: T[];
  angleKey: keyof T;
  radars: RadarInfo[];
  title?: string;
  domain?: [number, number];
}

export function RadarChart<T extends Record<string, any>>({
  data,
  angleKey,
  radars,
  title,
  domain = [-1, 1], // Default domain to handle negative values
}: RadarChartProps<T>) {
  const [hoveredRadar, setHoveredRadar] = useState<string | null>(null);

  const handleMouseEnter = (o: any) => {
    setHoveredRadar(o.dataKey);
  };

  const handleMouseLeave = () => {
    setHoveredRadar(null);
  };

  return (
    <div className="w-full h-96">
       {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={angleKey as string} tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={domain} />
          {radars.map((radar) => (
            <Radar
              key={radar.dataKey}
              name={radar.name}
              dataKey={radar.dataKey}
              stroke={radar.stroke}
              fill={radar.fill}
              fillOpacity={hoveredRadar === null ? 0.6 : (hoveredRadar === radar.dataKey ? 0.8 : 0.2)}
              strokeOpacity={hoveredRadar === null ? 1 : (hoveredRadar === radar.dataKey ? 1 : 0.4)}
            />
          ))}
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
          <Tooltip 
             contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
