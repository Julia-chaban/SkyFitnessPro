import db from "../database.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  try {
    const users = db
      .prepare("SELECT id, email, selectedCourses FROM users")
      .all();
    res.status(200).json({ users, count: users.length });
  } catch (error) {
    console.error("Error in /users:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
