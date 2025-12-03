import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartContainerClass = "bg-white rounded-2xl shadow-md p-4 mb-6";

const TotalStudentsChart = () => {
  const options = {
    chart: {
      type: 'column',
      backgroundColor: '',
    },
     credits: {
      enabled: false, // ✅ Correct location to hide Highcharts.com link
    },
    title: {
      text: 'Total Students',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    yAxis: {
      title: {
        text: 'Number of Students',
      },
    },
    series: [
      {
        name: 'Students',
        data: [100, 150, 200, 250, 300],
        color: '#007BFF',
      },
    ],
  };

  return (
    <div className={chartContainerClass}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TotalStudentsChart;