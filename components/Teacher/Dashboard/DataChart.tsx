'use client'
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    "name": "week 1",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "week 2",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "week 3",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "week 4",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "week 5",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "week 6",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "week 7",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

function DataChart() {
  return (
    <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]"> {/* Adjusted responsive heights */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 15, right: 20, left: 30, bottom: 20 }} // Adjusted margins
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" /> {/* Lighter grid */}
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 10, // Smaller base size
              className: "md:text-[12px]" // Responsive text
            }}
            interval={0} // Show all labels
          />
          <YAxis
            tick={{
              fontSize: 10,
              className: "md:text-[12px]"
            }}
            width={40} // Fixed width for y-axis
          />
          <Tooltip 
            contentStyle={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            strokeWidth={1.5}
            fillOpacity={0.4}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            strokeWidth={1.5}
            fillOpacity={0.4}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DataChart;
