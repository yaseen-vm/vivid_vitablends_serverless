export interface Admin {
  id: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: Admin;
    expiresIn: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}
