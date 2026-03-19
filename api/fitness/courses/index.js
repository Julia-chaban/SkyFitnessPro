import { courses } from "../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    res.status(200).json(courses);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
