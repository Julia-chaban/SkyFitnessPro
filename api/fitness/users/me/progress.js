import { verifyToken, getUserProgress } from "../../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

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

  try {
    const progress = getUserProgress(decoded.id, courseId);

    if (workoutId) {
      const workoutProgress = progress.workoutsProgress.find(
        (w) => w.workoutId === workoutId,
      ) || {
        workoutId,
        workoutCompleted: false,
        progressData: [],
      };
      return res.status(200).json(workoutProgress);
    }

    res.status(200).json(progress);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
