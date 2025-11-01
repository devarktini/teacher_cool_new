import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Shared blue theme config
const bluePalette = ['#1E90FF', '#4682B4', '#5DADE2', '#3498DB', '#85C1E9'];

const CourseCharts = ({ pieData, barData, lineData }:any) => {
  // Common chart configuration
  const commonChartOptions = {
    credits: {
      enabled: false // This disables the Highcharts.com link
    },
    accessibility: {
      enabled: false // Disable accessibility features if not needed
    }
  };

  // Pie Chart - Course Status
  const pieOptions = useMemo(() => ({
    ...commonChartOptions,
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: { text: 'Course Completion Status' },
    colors: bluePalette,
    series: [{
      name: 'Students',
      colorByPoint: true,
      data: pieData,
    }],
  }), [pieData]);

  // Bar Chart - Students per course
//   const barOptions = useMemo(() => ({
//     ...commonChartOptions,
//     chart: {
//       type: 'column',
//       backgroundColor: 'transparent',
//     },
//     title: { text: 'Courses Overview ' },
//     xAxis: {
//       categories: barData.map(item => item.name),
//     },
//     yAxis: {
//       min: 0,
//       title: { text: 'Courses (in %)' },
//     },
//     colors: bluePalette,
//     series: [{
//       name: 'Completed',
//       data: barData.map(item => item.value),
//     }],
//   }), [barData]);

// Bar Chart - Students per course
const barOptions = useMemo(() => ({
  ...commonChartOptions,
  chart: {
    type: 'column',
    backgroundColor: 'transparent',
  },
  title: { text: 'Courses Overview ' },
  xAxis: {
    categories: barData.map((item:any) => item.name),
  },
  yAxis: {
    min: 0,
    max: 100, // Set upper limit to 100%
    title: { text: 'Courses' },
    labels: {
      format: '{value}%', // Show % in axis labels
    },
  },
  colors: bluePalette,
  series: [{
    name: 'Completed',
    data: barData.map((item:any) => item.value),
    tooltip: {
      valueSuffix: '%', // Show % in tooltip
    },
  }],
}), [barData]);


  // Line Chart - Completion Trend
  const lineOptions = useMemo(() => ({
    ...commonChartOptions,
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
    },
    title: { text: 'Course Completion Over Time' },
    xAxis: {
      categories: lineData.map((item:any) => item.month),
    },
    yAxis: {
      title: { text: 'Completions' },
    },
    colors: bluePalette,
    series: [{
      name: 'Completions',
      data: lineData.map((item:any) => item.count),
    }],
  }), [lineData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%]">
      <HighchartsReact
        highcharts={Highcharts}
        options={pieOptions}
        immutable={true}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={barOptions}
        immutable={true}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={lineOptions}
        immutable={true}
      />
    </div>
  );
};

export default CourseCharts;