import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TableCard from './TableCard';

const BookingsByCategoryChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <TableCard title="Bookings by Category">
                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
                    No booking data available.
                </div>
            </TableCard>
        );
    }

    const barColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    const coloredData = data.map((item, index) => ({
        ...item,
        color: barColors[index % barColors.length],
    }));


    return (
        <TableCard title="Bookings by Category">
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={coloredData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                        <XAxis type="number" stroke="#6b7280" className="text-xs" />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#6b7280"
                            className="text-xs"
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#1f2937' }}
                            formatter={(value) => `${value.toLocaleString()} bookings`}
                        />
                        <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                            {coloredData.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </TableCard>
    );
};

export default BookingsByCategoryChart;
