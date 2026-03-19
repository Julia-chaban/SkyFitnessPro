import { authRequest } from "./api";
import { Workout, WorkoutProgress } from "../types/api.types";

export const workoutsService = {
  // Получить данные по тренировке
  async getWorkoutById(workoutId: string, token: string): Promise<Workout> {
    return authRequest(`/workouts/${workoutId}`, token);
  },

  // Получить тренировки курса (ДОБАВЛЕНО)
  async getCourseWorkouts(courseId: string, token: string): Promise<any[]> {
    return authRequest(`/courses/${courseId}/workouts`, token);
  },

  // Получить прогресс по тренировке
  async getWorkoutProgress(
    courseId: string,
    workoutId: string,
    token: string,
  ): Promise<WorkoutProgress> {
    return authRequest(
      `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
      token,
    );
  },

  // Сохранить прогресс тренировки
  async saveWorkoutProgress(
    courseId: string,
    workoutId: string,
    progressData: number[],
    token: string,
  ): Promise<{ message: string }> {
    return authRequest(`/courses/${courseId}/workouts/${workoutId}`, token, {
      method: "PATCH",
      body: JSON.stringify({ progressData }),
    });
  },

  // Сбросить прогресс тренировки
  async resetWorkoutProgress(
    courseId: string,
    workoutId: string,
    token: string,
  ): Promise<{ message: string }> {
    return authRequest(
      `/courses/${courseId}/workouts/${workoutId}/reset`,
      token,
      {
        method: "PATCH",
      },
    );
  },
};
