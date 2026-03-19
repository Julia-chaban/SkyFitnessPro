import { findUserByEmail, createToken } from "../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  const user = findUserByEmail(email);

  if (!user) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким email не найден" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Неверный пароль" });
  }

  const token = createToken(user);
  res.status(200).json({ token });
}
