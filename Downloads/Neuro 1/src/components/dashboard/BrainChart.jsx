import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const BrainChart = ({ skills }) => {
    const data = [
        { subject: 'Memory', A: skills?.memory || 0, fullMark: 100 },
        { subject: 'Speed', A: skills?.speed || 0, fullMark: 100 },
        { subject: 'Attention', A: skills?.attention || 0, fullMark: 100 },
        { subject: 'Math', A: skills?.math || 0, fullMark: 100 },
        { subject: 'Visual', A: skills?.visual || 0, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[300px] bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
            <h3 className="text-center text-slate-400 mb-2 font-bold">Your Brain Profile</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BrainChart;
