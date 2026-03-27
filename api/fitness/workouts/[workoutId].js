import { verifyToken, workouts } from "../_lib.js";

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

  const { workoutId } = req.query;

  try {
    const workout = workouts[workoutId];
    if (!workout) {
      return res.status(404).json({ message: "Тренировка не найдена" });
    }

    res.status(200).json(workout);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
