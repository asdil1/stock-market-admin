import React from "react";
import {registerables, Chart} from "chart.js";
import {Line} from "react-chartjs-2";

// регистрируем элементы, для использования
Chart.register(...registerables)

interface StockChartProps {
    historicalData: { date: string; price: string }[];
}

const StockChart: React.FC<StockChartProps> = ({ historicalData }) => {
    // Подготовка данных для графика
    const labels = historicalData.map(data => data.date);
    const prices = historicalData.map(data => parseFloat(data.price));

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Цена закрытия',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true, // Заполняет область под линией
            },
        ],
    };

    return (
        <div>
            <Line
                data={data}
                width={400} // Ширина графика в процентах
                height={300} // Высота графика в пикселях
                options={{
                    maintainAspectRatio: false, // Позволяет графику растягиваться
                }}
            />
        </div>
    );
}

export default StockChart;