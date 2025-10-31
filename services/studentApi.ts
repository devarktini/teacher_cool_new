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
  static async postSubmittedResults(data: any) {
    return ApiService.post<any>(`lms/submitted-result/`, data, true);
  };
  static async getWishList(id: any) {
    return ApiService.get<any>(`lms/wishlist/by-user-id/?user_id=${id}`, true);
  };

  static async removeWishList(id: any) {
    return ApiService.delete<any>(`lms/wishlist/delete-by-id/?wishlist_id=${id}`, true);
  };
  static async fetchCertifications(id: any) {
    return ApiService.get<any>(`lms/certifications/student/${id}/`, true);
  };
  static async getPaymentApi(id: any) {
    return ApiService.get<any>(`lms/payment/students/${id}/payments/`, true);
  };
  static async getAllRefunds() {
    return ApiService.get<any>(`lms/refund-request/`, true);
  };
  static async refundRequest(data: any) {
    return ApiService.post<any>(`lms/refund-request/`, data, true);
  };
  static async getCourseModulesByCourseId(courseId: any) {
    return ApiService.get<any>(`lms/course/modules-by-course/?course_id=${courseId}`, true);
  };
  static async getProgressByCourseIdAndStudentId(courseId: any, studentId: any) {
    return ApiService.get<any>(`lms/progress/course/${courseId}/${studentId}/`, true);
  };

  static async updateProgress(
    progressId: any,
    courseId: any,
    studentId: any,
    fileId: any
  ) {
    const payload = {
      course: courseId,
      student: studentId,
      file: fileId,
    };
    return ApiService.put<any>(`lms/progress/${progressId}/`, payload, true);
  };

  static async studentPostWish(payload: any) {
    return ApiService.post<any>(`lms/wishlist/`, payload, true);
  };

  static async getAllRecordedSessions(id: any) {
    return ApiService.get<any>(`lms/recorded-sessions/by-batch/?batch_id=${id}`, true);
  };

  // stream file from google drive url
static async getRecordedSessionVideoUrl(url: string) {
  const encodedUrl = encodeURIComponent(url);
  return ApiService.get<any>(`/lms/recorded-sessions/get-video-url/?url=${encodedUrl}`, true);
}





}

export default StudentApiService;
