import TableCard from "./TableCard";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
const BookingPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <TableCard title="Booking Summary (Last 4 Months)">
        <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
          No booking data available.
        </div>
      </TableCard>
    );
  }

  // Custom label for the Pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <TableCard title="Booking Summary (Last 4 Months)">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="bookings"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomLabel}
              animationDuration={500}
            >
              {data.map((entry, index) => (
                // Reusing colors from mockBookingData
                <Cell key={`cell-${index}`} fill={entry.color} className="shadow-lg" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#1f2937' }}
              formatter={(value) => `${value.toLocaleString()} bookings`}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </TableCard>
  );
};

export default BookingPieChart;