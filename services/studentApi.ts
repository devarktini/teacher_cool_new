import ApiService from './api';

class StudentApiService {
  static async fetchStudentDataByBatch(id: any) {
    return ApiService.get<any>(`lms/batches-students/student/${id}`, true); // 👈 true = use auth
  };

  static async getCourseProgressByStudentId(id: any) {
    return ApiService.get<any>(`lms/progress/student/${id}`, true); 
  };
  static async getStudentAssignmet(id: any) {
    return ApiService.get<any>(`lms/submitted-result/by-student/${id}`, true);
  };

  static async getAssignmetByStudent(id: any) {
    return ApiService.get<any>(`lms/assignments/get_assignments_by_student/?student_id=${id}`, true);
  };
  static async getQuizByAssignmentId(id: any) {
    return ApiService.get<any>(`lms/quizzes/by-assignment/?assignment_id=${id}`, true);
  };
  static async postSubmittedResults(data:any) {
    return ApiService.post<any>(`lms/submitted-result/`, data, true);
  };
  static async getWishList(id:any) {
    return ApiService.get<any>(`lms/wishlist/by-user-id/?user_id=${id}`, true);
  };
  static async removeWishList(id:any) {
    return ApiService.delete<any>(`lms/wishlist/delete-by-id/?wishlist_id=${id}`, true);
  };


}

export default StudentApiService;
