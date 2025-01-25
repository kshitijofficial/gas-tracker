import { useEffect, useState } from 'react'
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import { formatDistanceToNow } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import './App.css'

function App() {
  const [chartData, setChartData] = useState(null);


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    ws.onmessage = (event) => {
      const resData = JSON.parse(event.data);
      prepareChart(resData)
    };
    return () => ws.close()
  }, [])

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blocks/');
        const resData = response.data;
        prepareChart(resData)
      } catch (error) {
        console.error("Error fetching block data:", error)
      }
    }
    fetchBlockData()
  }, [])

  const prepareChart = (blocks) => {
    if (blocks.length > 0) {
      const timestamps = blocks.map(({ timestamp }) => {
        return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })
      })

      const gasUsed = blocks.map(({ gasused }) => {
        return gasused;
      })

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: 'Gas Used',
            data: gasUsed,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      });
    }
  }

  return (
    <div className="App">
      <h1>Ethereum Gas Tracker</h1>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Gas Used Over Time',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `Gas Used: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 10, // Adjust font size here
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 12, // Adjust font size here (optional)
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  )
}

export default App
