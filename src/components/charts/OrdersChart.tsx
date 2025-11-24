// src/components/charts/OrdersChart.tsx
'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface OrdersChartData {
  labels: string[]
  completed: number[]
  pending: number[]
}

export function OrdersChart({ data }: { data: OrdersChartData }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Completados',
        data: data.completed,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Pendientes',
        data: data.pending,
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: { size: 13 }
        }
      },
      title: {
        display: true,
        text: 'Pedidos por Mes',
        color: '#e2e8f0',
        font: { size: 16, weight: 600 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#cbd5e1',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(51, 65, 85, 0.2)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8', stepSize: 1 },
        grid: { color: 'rgba(51, 65, 85, 0.2)' }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <Bar data={chartData} options={options} />
    </div>
  )
}