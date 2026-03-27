import { verifyToken, findUserByEmail } from "../../../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

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

  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "ID курса должен быть указан" });
  }

  if (user.selectedCourses) {
    user.selectedCourses = user.selectedCourses.filter((id) => id !== courseId);
  }

  return res.status(200).json({ message: "Курс успешно удален!" });
}
