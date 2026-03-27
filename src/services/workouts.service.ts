import { authRequest } from "./api";
import { Workout } from "../types/api.types";

export const workoutsService = {
  async getWorkoutById(workoutId: string, token: string): Promise<Workout> {
    return authRequest(`/workouts/${workoutId}`, token);
  },

  async getCourseWorkouts(courseId: string, token: string): Promise<any[]> {
    return authRequest(`/courses/${courseId}/workouts`, token);
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
