import {
  verifyToken,
  getUserProgress,
  saveUserProgress,
  workouts,
} from "../../../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Отсутствует Authorization токен" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Невалидный токен" });
  }

  const { courseId, workoutId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "ID курса должен быть указан" });
  }
  if (!workoutId) {
    return res
      .status(400)
      .json({ message: "ID тренировки должен быть указан" });
  }

  if (!req.body) {
    return res
      .status(400)
      .json({
        message: "Тело запроса должно быть не пустым и содержать progressData",
      });
  }

  const { progressData } = req.body;

  try {
    const progress = getUserProgress(decoded.id, courseId);

    // Находим или создаем прогресс для этой тренировки
    let workoutProgress = progress.workoutsProgress.find(
      (w) => w.workoutId === workoutId,
    );

    if (workoutProgress) {
      workoutProgress.progressData = progressData;
      // Проверяем, выполнена ли тренировка (все упражнения выполнены)
      const workout = workouts[workoutId];
      if (workout) {
        const totalExercises = workout.exercises.length;
        const completedExercises = progressData.filter((v) => v > 0).length;
        workoutProgress.workoutCompleted =
          completedExercises === totalExercises;
      }
    } else {
      workoutProgress = {
        workoutId,
        workoutCompleted: false,
        progressData,
      };
      progress.workoutsProgress.push(workoutProgress);
    }

    // Проверяем, выполнен ли весь курс
    const allWorkoutsCompleted = progress.workoutsProgress.every(
      (w) => w.workoutCompleted,
    );
    progress.courseCompleted = allWorkoutsCompleted;

    saveUserProgress(decoded.id, courseId, progress);

    res.status(200).json({ message: "Прогресс по данной тренировке отмечен!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
