import { request, authRequest } from "./api";
import { Course, UserProgress } from "../types/api.types";

export const coursesService = {
  async getAllCourses(): Promise<Course[]> {
    return request("/courses");
  },

  async getCourseById(courseId: string): Promise<Course> {
    return request(`/courses/${courseId}`);
  },

  async getUserCourses(token: string): Promise<string[]> {
    const response = await authRequest<{
      email: string;
      selectedCourses: string[];
    }>("/users/me", token);
    return response.selectedCourses || [];
  },

  async getUserCourseProgress(
    courseId: string,
    token: string,
  ): Promise<UserProgress> {
    return authRequest(`/users/me/progress?courseId=${courseId}`, token);
  },

  async getWorkoutProgress(
    courseId: string,
    workoutId: string,
    token: string,
  ): Promise<{
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
  }> {
    return authRequest(
      `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
      token,
    );
  },

  async addCourseToUser(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    return authRequest<{ message: string }>("/users/me/courses", token, {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  },

  async removeCourseFromUser(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    return authRequest<{ message: string }>(
      `/users/me/courses/${courseId}`,
      token,
      {
        method: "DELETE",
      },
    );
  },

  async resetCourseProgress(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    return authRequest(`/courses/${courseId}/reset`, token, {
      method: "PATCH",
    });
  },
};
