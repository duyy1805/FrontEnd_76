import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Page A', uv: 4000, pv: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398 },
    { name: 'Page C', uv: 2000, pv: 9800 },
    { name: 'Page D', uv: 2780, pv: 3908 },
    { name: 'Page E', uv: 1890, pv: 4800 },
    { name: 'Page F', uv: 2390, pv: 3800 },
    { name: 'Page G', uv: 3490, pv: 4300 },
];

const OverlappingBarChart = () => (
    <ResponsiveContainer width="100%" height={900}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Overlapping Bars with transparent effect */}
            <Bar dataKey="uv" fill="rgba(136, 132, 216, 0.7)" barSize={30} />
            <Bar dataKey="pv" fill="rgba(130, 202, 157, 0.7)" barSize={30} />
        </BarChart>
    </ResponsiveContainer>
);

export default OverlappingBarChart;
