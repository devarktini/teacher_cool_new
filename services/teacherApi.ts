import ApiService from './api';

class TeacherApiService {
    static async sendVerification(data: any) {
        return ApiService.post<any>(`user/student/register`, data, true);
    };
    static async fetchTeacherDetails(userId: any) {
        return ApiService.get<any>(`user/teacher-details/user/?user_id=${userId}`, true);
    };

    static async updatetDetails(id: any, data: any) {
        return ApiService.patch<any>(`/user/teacher-details/${id}/`, data, true);
    };

    static async getCoursesByUser(id: number, page: number, page_size: number) {
        return ApiService.get<any>(
            `lms/course/courses-by-user/?page=${page}&page_size=${page_size}&user_id=${id}`,
            true
        );
    }


    static async updateCourseByCourseId(id: any, data: any) {
        return ApiService.patch<any>(`lms/course/${id}/update/`, data, true);
    };

    static async addCoursePartial(data: any) {
        return ApiService.post<any>(`lms/course/add/`, data, true);
    };

    static async deleteCourseById(id: any) {
        return ApiService.post<any>(`lms/course/${id}/delete`, true);
    };

    static async getTeacherBatch(id: any) {
        return ApiService.get<any>(`lms/batches/user/${id}/`, true);
    };
    static async GetBatchCourses() {
        return ApiService.get<any>(`lms/batches/courses/`, true);
    };

    static async createBatch(formData: any) {
        const formPayload = new FormData();

        // Append all fields
        formPayload.append('name', formData.name);
        formPayload.append('description', formData.description);
        formPayload.append('start_date', formData.start_date);
        formPayload.append('end_date', formData.end_date);
        formPayload.append('capacity', formData.capacity);
        formPayload.append('status', formData.status);
        formPayload.append('day', formData.day);
        formPayload.append('start_time', formData.start_time);
        formPayload.append('end_time', formData.end_time);
        formPayload.append('instructor', formData.instructor);

        // Join courses array into comma-separated string
        formPayload.append('courses', formData.course.join(','));

        if (formData.banner) {
            formPayload.append('banner', formData.banner);
        }
        return ApiService.post<any>(`/lms/batches/`, formPayload, true);
    };

    static async updateBatchDetails(batchId: any, formData: any) {
        const formPayload = new FormData();

        // Append all fields
        formPayload.append('name', formData.name);
        formPayload.append('description', formData.description);
        formPayload.append('start_date', formData.start_date);
        formPayload.append('end_date', formData.end_date);
        formPayload.append('capacity', formData.capacity);
        formPayload.append('status', formData.status);
        formPayload.append('day', formData.day);
        formPayload.append('start_time', formData.start_time);
        formPayload.append('end_time', formData.end_time);
        formPayload.append('instructor', formData.instructor);


        formPayload.append('courses', JSON.stringify(formData.course));

        if (formData.banner) {
            formPayload.append('banner', formData.banner);
        }
        return ApiService.patch<any>(`lms/batches/${batchId}/`, formPayload, true);
    };

    static async deleteBatch(batchId: any,) {
        return ApiService.delete<any>(`lms/batches/${batchId}/`, true);
    };
    static async enrollStudentsInBatch(batchId: any, studentIds: any) {
        return ApiService.post<any>(`lms/enrollments/batch/${batchId}/enrollments/?student_ids=${studentIds.join(
            ","
        )}`,
            {}, true);
    };

    static async getStudentByBatch(batchId: any) {
        return ApiService.get<any>(`lms/batches-students/students-by-batch/?batch_id=${batchId}`, true);
    };

    static async sendMeetingLinkToStudentByBatch(batchId: any, meetingId: any) {
        const data = {
            batch_id: batchId,
            meeting_id: meetingId,
        };
        return ApiService.post<any>(`lms/batches-students/send-meeting-details-to-students/`, data, true);
    };

    static async addStudentToBatch(batchId: any, studentIds: any) {
        const data = {
            batch_id: batchId,
            student_ids: studentIds,
        };
        return ApiService.post<any>(`lms/batches-students/add-students-to-batch/`, data, true);
    };

    static async deleteBatchStudentById(studentId: any) {
        return ApiService.delete<any>(`lms/batches-students/deactivate-batch-student-by-id/?id=${studentId}`, true);
    };

    static async getUserTypeListByAdmin(type: any) {
        return ApiService.get<any>(`user/admin/user_type_list/?type=${type}`, true);
    };

    static async listCoursesAdmin() {
        return ApiService.get<any>(`lms/course/list_courses_admin/?all_data=true`, true);
    };

    static async getAssignment() {
        return ApiService.get<any>(`lms/assignments/all-assignments`, true);
    };

    static async addAssignment(data: any) {
        return ApiService.post<any>(`lms/assignments/`, data, true);
    };

    static async updateAssignment(id: any, data: any) {
        return ApiService.put<any>(`lms/assignments/${id}/`, data, true);
    };

    // services/TeacherApiService.ts
    static async updateAssignmentActive(id: number, data: { is_disabled: boolean }) {
        try {
            return await ApiService.put(
                `lms/assignments/${id}/disable/`,
                data,  // must be an object, not a raw boolean
                true
            );
        } catch (error) {
            console.error("updateAssignmentActive error:", error);
            throw error;
        }
    }


    static async getQuizByAssignmentId(id: any) {
        return ApiService.get<any>(`lms/quizzes/by-assignment/?assignment_id=${id}`, true);
    };

    static async addMultipleQuizzes(assignmentId: any, quizzes: any) {
        return ApiService.post<any>(`/lms/quizzes/add-multiple/?assignment_id=${assignmentId}`, quizzes, true);
    };

    static async deleteQuiz(id: any) {
        return ApiService.post<any>(`lms/quizzes/${id}/`, true);
    };








}

export default TeacherApiService;
