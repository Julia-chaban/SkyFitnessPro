import { findUserByEmail, createUser, validatePassword } from "../_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  // Валидация email
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Введите корректный Email" });
  }

  // Проверка существующего пользователя
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким email уже существует" });
  }

  // Валидация пароля
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: passwordErrors[0] });
  }

  // Создаем пользователя
  createUser(email, password);

  res.status(201).json({ message: "Регистрация прошла успешно!" });
}
