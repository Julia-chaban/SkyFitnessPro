import { request, authRequest } from "./api";
import { Course, UserProgress } from "../types/api.types";

export const coursesService = {
  // Получить все курсы
  async getAllCourses(): Promise<Course[]> {
    try {
      return await request("/courses");
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  // Получить курс по ID
  async getCourseById(courseId: string): Promise<Course> {
    try {
      return await request(`/courses/${courseId}`);
    } catch (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw error;
    }
  },

  // Получить курсы пользователя
  async getUserCourses(token: string): Promise<string[]> {
    try {
      // Ответ теперь напрямую содержит email и selectedCourses
      const response = await authRequest<{
        email: string;
        selectedCourses: string[];
      }>("/users/me", token);
      return response.selectedCourses || [];
    } catch (error) {
      console.error("Error fetching user courses:", error);
      throw error;
    }
  },

  // Получить прогресс пользователя по курсу
  async getUserCourseProgress(
    courseId: string,
    token: string,
  ): Promise<UserProgress> {
    try {
      return await authRequest(
        `/users/me/progress?courseId=${courseId}`,
        token,
      );
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      throw error;
    }
  },

  // Получить прогресс по конкретной тренировке
  async getWorkoutProgress(
    courseId: string,
    workoutId: string,
    token: string,
  ): Promise<{
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
  }> {
    try {
      return await authRequest(
        `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
        token,
      );
    } catch (error) {
      console.error(`Error fetching workout progress:`, error);
      throw error;
    }
  },

  // Добавить курс пользователю
  async addCourseToUser(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    try {
      const response = await authRequest<{ message: string }>(
        "/users/me/courses",
        token,
        {
          method: "POST",
          body: JSON.stringify({ courseId }),
        },
      );
      console.log("Add course response:", response);
      return response;
    } catch (error) {
      console.error("Error adding course to user:", error);
      throw error;
    }
  },

  // Удалить курс у пользователя
  async removeCourseFromUser(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    try {
      return await authRequest(`/users/me/courses/${courseId}`, token, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error removing course ${courseId}:`, error);
      throw error;
    }
  },

  // Сбросить прогресс по курсу
  async resetCourseProgress(
    courseId: string,
    token: string,
  ): Promise<{ message: string }> {
    try {
      return await authRequest(`/courses/${courseId}/reset`, token, {
        method: "PATCH",
      });
    } catch (error) {
      console.error(`Error resetting course progress:`, error);
      throw error;
    }
  },
};
