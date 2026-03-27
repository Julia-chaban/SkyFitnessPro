import { verifyToken } from "../../_lib.js";

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

  const { courseId } = req.query;

  // Здесь должна быть логика получения тренировок курса
  // Для примера возвращаем тестовые данные
  const workouts = [
    {
      _id: "17oz5f",
      name: "Урок 1. Основы йоги",
      day: 1,
    },
    {
      _id: "x8abc2",
      name: "Урок 2. Дыхательные практики",
      day: 2,
    },
    {
      _id: "a1rqtt",
      name: "Урок 3. Основные движения",
      day: 3,
    },
  ];

  res.status(200).json(workouts);
}
