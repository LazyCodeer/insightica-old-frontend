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
  rawData: T[];
  angleKey: keyof T;
  radars: RadarInfo[];
  title?: string;
  domain?: [number, number];
}

export function RadarChart<T extends Record<string, any>>({
  data,
  rawData,
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

  // Custom tooltip to show both normalized and raw values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    // Find the raw data entry for this angle (label)
    const rawDatum = rawData.find((d) => d[angleKey] === label);
    return (
      <div style={{
        background: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        fontSize: '0.9rem'
      }}>
        <div><strong>{label}</strong></div>
        {payload.map((entry: any) => (
          <div key={entry.dataKey}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            {/* &nbsp;{entry.value} */}
            {/* &nbsp;{rawDatum[entry.dataKey]} */}
            {rawDatum && rawDatum[entry.dataKey] !== undefined && (
              <span style={{ color: '#888', marginLeft: 8 }}>
                {rawDatum[entry.dataKey]}
              </span>
            )}
          </div>
        ))}
      </div>
    );
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
              fillOpacity={hoveredRadar === null ? 0.6 : (hoveredRadar === radar.dataKey ? 1 : 0)}
              strokeOpacity={hoveredRadar === null ? 1 : (hoveredRadar === radar.dataKey ? 1 : 0)}
            />
          ))}
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
          <Tooltip 
            content={<CustomTooltip />}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
