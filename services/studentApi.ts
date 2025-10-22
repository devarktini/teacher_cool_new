import ApiService from './api';
class StudentApiService {
  //   private static basePath = '/';



  static async fetchStudentDataByBatch(id: any) {
    return ApiService.get<any>(`lms/batches-students/student/${id}`);
  }
 



}

export default StudentApiService;
