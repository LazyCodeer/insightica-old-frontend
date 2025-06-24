
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyCheck } from "lucide-react";

interface ChordDiagramProps {
    data: {
        matrix: number[][];
        names: string[];
    } | undefined;
}

export function ChordDiagram({ data }: ChordDiagramProps) {
    if (!data || data.names.length < 3) {
        return (
            <div className="p-6 bg-card/50 border border-border/50 rounded-lg min-h-[350px] flex flex-col items-center justify-center text-center">
                <CopyCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Chord Diagram Placeholder</h3>
                <p className="text-muted-foreground">Please select 3 to 6 conditions to visualize their pairwise synergy.</p>
                <p className="text-sm text-primary mt-4 animate-pulse">
                    This advanced visualization is under construction. The data is ready and will be displayed here soon.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-lg">
            <h4 className="text-center font-semibold mb-2">Pairwise Synergy Data Matrix</h4>
            <p className="text-center text-sm text-muted-foreground mb-4">This table represents the data that will be used to generate the chord diagram.</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Condition</TableHead>
                        {data.names.map((name, i) => (
                            <TableHead key={i} className="text-center">{name}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.matrix.map((row, i) => (
                        <TableRow key={i}>
                            <TableHead>{data.names[i]}</TableHead>
                            {row.map((val, j) => (
                                <TableCell key={j} className="text-center">
                                    {i === j ? '-' : val.toFixed(2)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
