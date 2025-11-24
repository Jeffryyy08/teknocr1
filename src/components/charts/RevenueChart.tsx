// src/components/charts/RevenueChart.tsx
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface RevenueData {
  labels: string[]
  revenue: number[]
}

export function RevenueChart({ data }: { data: RevenueData }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Ganancias (₡)',
        data: data.revenue,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Ganancias Mensuales',
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
        padding: 12,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y as number
            return `₡${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          callback: (value) => `₡${Number(value).toLocaleString()}`
        },
        grid: { color: 'rgba(51, 65, 85, 0.2)' }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutCubic'
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <Bar data={chartData} options={options} />
    </div>
  )
}