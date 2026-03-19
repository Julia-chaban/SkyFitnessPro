import { courses } from "../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { courseId } = req.query;

  try {
    const course = courses.find((c) => c._id === courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    res.status(200).json(course);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
