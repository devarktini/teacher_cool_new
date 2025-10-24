import ApiService from './api';

class StudentApiService {
  static async fetchStudentDataByBatch(id: any) {
    return ApiService.get<any>(`lms/batches-students/student/${id}`, true); // 👈 true = use auth
  }
}

export default StudentApiService;
