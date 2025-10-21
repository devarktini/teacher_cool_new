export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  results:string[]
}



export interface ApiError {
  message: string;
  status: number;
}
