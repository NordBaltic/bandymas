import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registruojame `Chart.js` komponentus
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartComponent({ data, currency }) {
    const chartData = {
        labels: ["1D", "7D", "14D", "30D"],
        datasets: [
            {
                label: `Balance (${currency})`,
                data: data,
                borderColor: "#FF9900",
                backgroundColor: "rgba(255, 153, 0, 0.2)",
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: true } }
        }
    };

    return <Line data={chartData} options={options} />;
}
