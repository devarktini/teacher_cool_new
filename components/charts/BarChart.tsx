'use client'
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface BarChartProps {
  data: any[]
  bars: { key: string; color: string }[]
  xAxisKey: string
  height?: number
  stacked?: boolean
}

export default function BarChart({ data, bars, xAxisKey, height = 400, stacked = false }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map(({ key, color }) => (
          <Bar 
            key={key} 
            dataKey={key} 
            fill={color} 
            stackId={stacked ? 'stack' : undefined} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
