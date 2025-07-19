import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './ChartComponent.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartComponent({ items }) {
  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Cases by Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#6a11cb', '#2575fc', '#9d50bb'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Pie data={data} />
    </div>
  );
}

export default ChartComponent;
