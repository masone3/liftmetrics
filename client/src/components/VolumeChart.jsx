import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

function VolumeChart({ data }) {
  const chartData = data.map((entry) => ({
    date: dayjs(entry.date).format("MMM D"),
    volume: entry.volume,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value} lbs`, "Volume"]}
          labelStyle={{ color: "#333" }}
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#2f9e44"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default VolumeChart;