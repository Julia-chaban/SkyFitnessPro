import { verifyToken, findUserByEmail, updateUserCourses } from "../../_lib.js";

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Отсутствует Authorization токен" });
  }

  console.log("Token received in /users/me/courses:", token);

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Невалидный токен" });
  }

  console.log("Decoded token:", decoded);

  const user = findUserByEmail(decoded.email);
  if (!user) {
    console.log("User not found for email:", decoded.email);
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  // POST - добавить курс
  if (req.method === "POST") {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "ID курса должен быть указан" });
    }

    let courses = JSON.parse(user.selectedCourses || "[]");

    if (!courses.includes(courseId)) {
      courses.push(courseId);
      updateUserCourses(user.email, courses);
      console.log(`Course ${courseId} added to user ${user.email}`);
    }

    return res.status(200).json({
      message: "Курс успешно добавлен!",
      courses,
    });
  }

  // GET - получить курсы пользователя
  if (req.method === "GET") {
    return res.status(200).json({
      user: {
        email: user.email,
        selectedCourses: JSON.parse(user.selectedCourses || "[]"),
      },
    });
  }

  return res.status(405).end();
}
