import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

// Registruojame `Chart.js` komponentus
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ChartComponent({ data, currency = "BNB" }) {
    const chartData = {
        labels: ["1D", "7D", "14D", "30D", "60D", "90D"],
        datasets: [
            {
                label: `Balance (${currency})`,
                data: data,
                borderColor: "#FFD700",
                backgroundColor: "rgba(255, 215, 0, 0.15)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#FFD700",
                pointBorderColor: "#B59410",
                borderWidth: 2,
                hoverBorderWidth: 3,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#000",
                titleColor: "#FFD700",
                bodyColor: "#FFFFFF",
                cornerRadius: 6,
                titleFont: { weight: "bold" },
                bodyFont: { weight: "bold" }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "#FFFFF4",
                    font: { size: 14, weight: "bold" }
                }
            },
            y: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: {
                    color: "#FFFFF4",
                    font: { size: 14, weight: "bold" }
                }
            }
        },
        animation: {
            duration: 1200,
            easing: "easeInOutQuart"
        }
    };

    return (
        <div className="chart-container fade-in">
            <Line data={chartData} options={options} />
        </div>
    );
}
