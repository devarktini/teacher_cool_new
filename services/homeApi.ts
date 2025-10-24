import ApiService from './api';

class HomeApiService {
  static async getCategory() {
    return ApiService.get<any>("lms/category/get_categories/");
  }

  static async getAllCategory(params?: { all_data?: boolean }) {
    const query = params?.all_data ? '?all_data=true' : '';
    return ApiService.get<any>(`lms/category/get_categories/${query}`);
  }

  static async getCourseByCatId(categoryId: string | number) {
    return ApiService.get<any>(`lms/course/category/?category=${categoryId}`);
  }

  static async getCourseList() {
    return ApiService.get<any>("lms/course/list_courses/?all_data=true");
  }

  static async getCategoryByPublicAndPrivate() {
    return ApiService.get<any>("lms/course/category-course-programs/?all_data=true");
  }

  static async getCourseById(id: string) {
    return ApiService.get<any>(`lms/course/${id}/get/`);
  }

  static async fetchCampaignsHom() {
    return ApiService.get<any>(`lms/campaign/`);
  }

  static async getCampaignByRoute(route: string) {
    return ApiService.get<any>(`lms/campaign/get-by-route/${route}/`);
  }
}

export default HomeApiService;
