'use client'
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface LineChartProps {
  data: any[]
  lines: { key: string; color: string }[]
  xAxisKey: string
  height?: number
}

export default function LineChart({ data, lines, xAxisKey, height = 400 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map(({ key, color }) => (
          <Line key={key} type="monotone" dataKey={key} stroke={color} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
