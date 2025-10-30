import ApiService from './api';

class UserRegistrationApiService {
  static async studentRegister(data: any) {
    return ApiService.post<any>(`user/student/register`, data);
  };
  static async teacherRegister(data: any) {
    return ApiService.post<any>(`user/teacher/register`, data);
  };
  static async corporateOrUniversityRegister(data: any) {
    return ApiService.post<any>(`user/register`, data);
  };



}

export default UserRegistrationApiService;
