import { request } from "./api";
import { LoginResponse } from "../types/api.types";

export const authService = {
  async register(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getUserData(
    token: string,
  ): Promise<{ email: string; selectedCourses: string[] }> {
    return request("/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
