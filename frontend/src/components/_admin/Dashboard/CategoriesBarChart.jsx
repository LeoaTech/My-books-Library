import TableCard from "./TableCard";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
const CategoriesBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <TableCard title="Categories by Book Count">
        <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
          No category data available.
        </div>
      </TableCard>
    );
  }

  // Assign colors to bars for better visual appeal
  const barColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const coloredData = data.map((item, index) => ({
    ...item,
    color: barColors[index % barColors.length],
  }));

  return (
    <TableCard title="Categories by Book Count">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={coloredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              width={80} // Give space for category names
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#1f2937' }}
              formatter={(value) => `${value.toLocaleString()} books`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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



export default CategoriesBarChart;