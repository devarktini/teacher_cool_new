// src/utils/getProfilePath.ts

export const getProfilePath = (user_type: string | null | undefined): string => {
  switch (user_type) {
    case "student":
      return "/dashboard/student/profile";
    case "teacher":
      return "/dashboard/teacher/profile";
    case "corporate":
      return "/dashboard/corporate/profile";
    case "university":
      return "/dashboard/university/profile";
    default:
      return "/"; // fallback path
  }
};
