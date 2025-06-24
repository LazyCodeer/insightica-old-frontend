
'use client';

import { CopyCheck } from "lucide-react";
import ReactChordDiagram from 'react-chord-diagram';

interface ChordDiagramProps {
    data: {
        matrix: number[][];
        names: string[];
    } | undefined;
}

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-1))', // Repeat for more than 5 conditions
];

export function ChordDiagram({ data }: ChordDiagramProps) {
    if (!data || data.names.length < 3 || data.names.length > 6) {
        return (
            <div className="p-6 bg-card/50 border border-border/50 rounded-lg min-h-[350px] flex flex-col items-center justify-center text-center">
                <CopyCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Chord Diagram</h3>
                <p className="text-muted-foreground">Please select 3 to 6 conditions to visualize their pairwise synergy.</p>
            </div>
        );
    }
    
    // The library has some issues with rendering in a flex/grid container,
    // so wrapping it with a fixed size helps stabilization.
    return (
        <div className="flex flex-col items-center w-full">
             <ReactChordDiagram
                matrix={data.matrix}
                componentId={1}
                groupLabels={[]}
                groupColors={chartColors.slice(0, data.names.length)}
                padAngle={0.04}
                labelColors={[]}
                style={{
                    'padding-bottom': '0px'
                }}
                width={400}
                height={400}
             />
             <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {data.names.map((name, index) => (
                    <div key={name} className="flex items-center space-x-2">
                        <span 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: chartColors[index % chartColors.length] }} 
                        />
                        <span className="text-sm text-muted-foreground">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
