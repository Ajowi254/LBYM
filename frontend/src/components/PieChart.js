import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const options = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 10,
        font: {
          size: 12, // Adjust the font size of the legend label
          weight: 'bold', // Adjust the font weight of the legend label
        },
      },
    },
  },
};

function PieChart({chartData}) {
  return (
    <Pie data={chartData} options={options}/>
  )
}

export default PieChart;