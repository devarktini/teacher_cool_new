import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartContainerClass = "bg-white rounded-2xl shadow-md p-4 mb-6";
const TotalBatchesChart = () => {
  const options = {
    chart: {
      type: 'area',
    //   backgroundColor: '#E6F0FF',
      backgroundColor: '',
    },
     credits: {
      enabled: false, // ✅ Correct location to hide Highcharts.com link
    },
    title: {
      text: 'Total Batches',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    yAxis: {
      title: {
        text: 'Number of Batches',
      },
    },
    series: [
      {
        name: 'Batches',
        data: [5, 8, 12, 16, 22],
        color: '#3399FF',
      },
    ],
  };

  return (
    <div className={chartContainerClass}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TotalBatchesChart;