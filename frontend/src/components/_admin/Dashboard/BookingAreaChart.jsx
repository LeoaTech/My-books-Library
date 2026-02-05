import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TableCard from './TableCard';

const BookingAreaChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <TableCard title="Booking Trends (Last 4 Months)">
                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
                    No booking trend data available.
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title="Booking Trends (Last 4 Months)">
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4bf8e4ff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4bf8e4ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke="#4bf8e4ff"
                            fillOpacity={1}
                            fill="url(#colorBookings)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </TableCard>
    );
};

export default BookingAreaChart;
