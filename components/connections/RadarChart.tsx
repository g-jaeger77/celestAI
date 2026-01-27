import React from 'react';
import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface RadarChartProps {
    data: any[];
    theme?: 'love' | 'work' | 'social';
    size?: number;
    userLabel?: string;
    partnerLabel?: string;
    showLegend?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
    data,
    theme = 'love',
    size = 300,
    userLabel = "Você",
    partnerLabel = "Parceiro",
    showLegend = true
}) => {

    // Theme Colors (Partner Layer)
    const partnerColors = {
        love: { stroke: '#ec4899', fill: '#ec4899' },   // Pink-500
        work: { stroke: '#3b82f6', fill: '#3b82f6' },   // Blue-500
        social: { stroke: '#f59e0b', fill: '#f59e0b' }  // Amber-500
    };
    const pColor = partnerColors[theme];

    // User Layer (Always Cyan/Teal for contrast per Image 2)
    const userColor = { stroke: '#22d3ee', fill: '#22d3ee' }; // Cyan-400

    // Reference Mode: If no partner label, treat B as a background reference (Max Potential)
    const isReferenceMode = !partnerLabel;
    const refColor = { stroke: 'rgba(255,255,255,0.1)', fill: 'rgba(255,255,255,0.05)' };

    return (
        <div style={{ width: '100%', height: size }} className="relative">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="label"
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

                    {/* Partner / Reference Layer (Render first to be background) */}
                    <Radar
                        name={isReferenceMode ? "Potencial" : partnerLabel}
                        dataKey="B" // Partner Value or 100
                        stroke={isReferenceMode ? refColor.stroke : pColor.stroke}
                        strokeWidth={isReferenceMode ? 1 : 2}
                        fill={isReferenceMode ? refColor.fill : pColor.fill}
                        fillOpacity={isReferenceMode ? 1 : 0.3}
                    />

                    {/* User Layer */}
                    <Radar
                        name={userLabel}
                        dataKey="A" // User Value
                        stroke={userColor.stroke}
                        strokeWidth={2}
                        fill={userColor.fill}
                        fillOpacity={0.5}
                    />

                    {showLegend && (
                        <Legend
                            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '10px' }}
                            iconType="circle"
                        />
                    )}
                </RechartsRadar>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChart;
