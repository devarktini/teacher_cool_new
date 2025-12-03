import StudentProgressChart from "./StudentProgressChart";
import TotalBatchesChart from "./TotalBatchesChart";
import TotalCoursesChart from "./TotalCoursesChart";
import TotalStudentsChart from "./TotalStudentsChart";

function GraphData() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <TotalStudentsChart />
      <TotalCoursesChart />
      <TotalBatchesChart />
      <StudentProgressChart/>
    </div>
  );
}

export default GraphData;