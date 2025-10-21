export interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
