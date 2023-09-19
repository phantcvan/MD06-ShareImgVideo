import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ChartProp {
  labels: string[];
  // label: string;
  title: string;
  dataChart: number[];
  borderColor: string;
  bgColor: string;
  step: number;
}
export function Chart({
  labels,
  dataChart,
  // label,
  title,
  borderColor,
  bgColor,
  step,
}: ChartProp) {
  const options = {
    responsive: true,
    elements: {
      line: {
        tension: 0.4, // Điều chỉnh độ mượt của đường cong
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        ticks: {
          stepSize: step,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        // label: label,
        fill: true,
        data: dataChart,
        borderColor: borderColor,
        backgroundColor: bgColor,
        yAxisID: 'y',
      },
    ],
  };
  return <Line className='' options={options} data={data} />;
}
