import React from "react";
import { Card } from 'antd'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Màu sắc
const COLORS = ["#1890ff", "#f5222d"]; // Đã cấp / Chưa cấp

// Tạo PieChart Component dùng chung
const PieChartComponent = ({ title, data }) => (
    <Card title={`Số lượng cấp phát ${title}`} headStyle={{ color: "#000" }} style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", width: "30%" }}>
        <ResponsiveContainer height={150}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
        </ResponsiveContainer>
    </Card>
);

// Component tổng
const UniformPieCharts = ({ data }) => {
    const currentYear = 2025;
    const filtered = data.filter(item => item.NamCap === currentYear);
    const total = filtered.length;

    const countVest = filtered.filter(x => x.SoBo_V > 0).length;
    const countBD = filtered.filter(x => x.SoBo_BD > 0).length;
    const countBH = filtered.filter(x => x.SoBo_BH > 0).length;

    const getPieData = (count) => [
        { name: "Đã cấp", value: count },
        { name: "Chưa cấp", value: total - count },
    ];

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <PieChartComponent title="Vest" data={getPieData(countVest)} />
            <PieChartComponent title="BD" data={getPieData(countBD)} />
            <PieChartComponent title="BH" data={getPieData(countBH)} />
        </div>
    );
};

export default UniformPieCharts;
