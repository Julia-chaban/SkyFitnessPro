import { verifyToken, findUserByEmail } from "../../_lib.js";

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

  const user = findUserByEmail(decoded.email);
  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  // Возвращаем в формате из документации
  res.status(200).json({
    email: user.email,
    selectedCourses: JSON.parse(user.selectedCourses || "[]"),
  });
}
