//barchart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};


function BarChart({chartData}) {
  return (
    <Bar data={chartData} options={options}/>
  )
}

export default BarChart;