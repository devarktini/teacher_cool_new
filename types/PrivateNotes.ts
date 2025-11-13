// types.ts - Create this file to hold all your type definitions

export interface BlogFile {
  id?: number;
  file_id?: number;
  url?: string;
  file_url?: string;
  name?: string;
}

export interface CourseContent {
  id: number;
  name: string;
  content: string;
  created_at: string;
  enabled: boolean;
  blog_files?: BlogFile[];
}

export interface Course {
  id: number;
  title: string;
  level: string;
  instructor_name: string;
  banner: string;
  'category name': string;
  content?: CourseContent[];
}

export interface ApiResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}
