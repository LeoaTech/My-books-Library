import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TableCard from './TableCard';

const LocationDonutChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <TableCard title="Bookings per Location">
                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
                    No location data available.
                </div>
            </TableCard>
        );
    }

    const COLORS = ['#538cbeff', '#3ee6c7cb', '#FFBB28', '#FF8042', '#b792d4ff', '#d687a7ff'];

    return (
        <TableCard title="Bookings per Location">
            <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#b8e58bff"
                            paddingAngle={5}
                            dataKey="bookings"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => `${value.toLocaleString()} bookings`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </TableCard>
    );
};

export default LocationDonutChart;
