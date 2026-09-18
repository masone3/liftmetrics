import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function ExerciseProgressChart({ data, exerciseName }) {
  const chartData = {
    labels: data.map((entry) => dayjs(entry.date).format("MMM D")),
    datasets: [
      {
        label: `${exerciseName} — Max Weight (lbs)`,
        data: data.map((entry) => entry.maxWeight),
        borderColor: "#1971c2",
        backgroundColor: "#1971c2",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} lbs`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: "Weight (lbs)" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default ExerciseProgressChart;