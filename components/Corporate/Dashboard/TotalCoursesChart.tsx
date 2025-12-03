import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartContainerClass = "bg-white rounded-2xl shadow-md p-4 mb-6";
const TotalCoursesChart = () => {
  const options = {
    chart: {
      type: 'line',
      backgroundColor: '',
    //   backgroundColor: '#E6F0FF',
    },
     credits: {
      enabled: false, // ✅ Correct location to hide Highcharts.com link
    },
    title: {
      text: 'Total Courses',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    yAxis: {
      title: {
        text: 'Number of Courses',
      },
    },
    series: [
      {
        name: 'Courses',
        data: [10, 12, 15, 20, 25],
        color: '#1E90FF',
      },
    ],
  };

  return (
    <div className={chartContainerClass}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default TotalCoursesChart;