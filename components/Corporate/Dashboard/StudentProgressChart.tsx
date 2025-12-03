import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartContainerClass = "bg-white rounded-2xl shadow-md p-4 mb-6";

const StudentProgressChart = () => {
  const options = {
    chart: {
      type: 'pie',
      backgroundColor: '', // No background
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      text: 'Student Progress',
      style: {
        color: 'gray',
        fontWeight: '600',
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemStyle: {
        color: 'gray',
        fontWeight: 'normal',
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          style: {
            color: 'gray',
            textOutline: 'none',
          },
        },
      },
    },
    series: [
      {
        name: 'Progress',
        colorByPoint: true,
        data: [
          {
            name: 'Completed',
            y: 45,
            color: '#007BFF',
          },
          {
            name: 'In Progress',
            y: 35,
            color: '#66B2FF',
          },
          {
            name: 'Not Started',
            y: 20,
            color: '#B3D9FF',
          },
        ],
      },
    ],
  };

  return (
    <div className={chartContainerClass}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StudentProgressChart;
