import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface EnergyChartProps {
    data: Array<{
        hour: number;
        mental: number;
        physical: number;
        emotional: number;
    }>;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
    // Format hour for X Axis
    const formattedData = data.map(d => ({
        ...d,
        label: `${d.hour.toString().padStart(2, '0')}:00`,
        total: Math.round((d.mental + d.physical + d.emotional) / 3)
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <p className="text-white/60 text-xs font-bold tracking-widest mb-2">{label}</p>
                    <div className="flex flex-col gap-1.5">
                        {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center gap-2 min-w-[120px]">
                                <div
                                    className="w-2 h-2 rounded-full shadow-[0_0_8px]"
                                    style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                                />
                                <span className="text-xs uppercase font-medium text-white/80 w-16">
                                    {entry.name === 'mental' ? 'Mente' :
                                        entry.name === 'physical' ? 'Corpo' : 'Alma'}
                                </span>
                                <span className="text-sm font-bold ml-auto" style={{ color: entry.color }}>
                                    {Math.round(entry.value)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[300px] select-none relative">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorMental" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#32ADE6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#32ADE6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF9F0A" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#FF9F0A" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEmotional" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff"
                        strokeOpacity={0.05}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="label"
                        stroke="#ffffff"
                        strokeOpacity={0.2}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval={3}
                    />

                    <YAxis
                        hide={false}
                        stroke="#ffffff"
                        strokeOpacity={0.2}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="physical"
                        stroke="#FF9F0A"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPhysical)"
                        animationDuration={1500}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#FF9F0A', filter: 'drop-shadow(0 0 10px #FF9F0A)' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="mental"
                        stroke="#32ADE6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMental)"
                        animationDuration={1500}
                        animationBegin={300}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#32ADE6', filter: 'drop-shadow(0 0 10px #32ADE6)' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="emotional"
                        stroke="#BF5AF2"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEmotional)"
                        animationDuration={1500}
                        animationBegin={600}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#BF5AF2', filter: 'drop-shadow(0 0 10px #BF5AF2)' }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Decorative Overlay - Grid Lines */}
            {/* <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div> */}
        </div>
    );
};

export default EnergyChart;
