import db from "./database.js";

// Вспомогательные функции для работы с пользователями
export function findUserByEmail(email) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email);
}

export function createUser(email, password) {
  console.log("CREATE USER CALLED with email:", email);

  const id = Date.now().toString();
  const stmt = db.prepare(
    "INSERT INTO users (id, email, password, selectedCourses) VALUES (?, ?, ?, ?)",
  );
  stmt.run(id, email, password, JSON.stringify([]));

  const user = { id, email, password, selectedCourses: [] };
  console.log("User created:", user);

  return user;
}

export function updateUserCourses(email, courses) {
  const stmt = db.prepare(
    "UPDATE users SET selectedCourses = ? WHERE email = ?",
  );
  stmt.run(JSON.stringify(courses), email);
  console.log(`Courses updated for ${email}:`, courses);
}

export function validatePassword(password) {
  const errors = [];
  if (password.length < 6)
    errors.push("Пароль должен содержать не менее 6 символов");
  if ((password.match(/[!@#$%^&*]/g) || []).length < 2)
    errors.push("Пароль должен содержать не менее 2 спецсимволов");
  if (!/[A-Z]/.test(password))
    errors.push("Пароль должен содержать как минимум одну заглавную букву");
  return errors;
}

export function createToken(user) {
  return Buffer.from(
    JSON.stringify({ id: user.id, email: user.email }),
  ).toString("base64");
}

export function verifyToken(token) {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

// Курсы (не изменяются)
export const courses = [
  {
    _id: "ab1c3f",
    nameRU: "Йога",
    nameEN: "Yoga",
    description: "Йога для начинающих",
    directions: [],
    fitting: [],
    difficulty: "сложный",
    durationInDays: 20,
    dailyDurationInMinutes: { from: 20, to: 40 },
    workouts: ["17oz5f", "x8abc2", "a1rqtt", "xlpkqy", "b3n4m5"],
  },
  {
    _id: "xyz789",
    nameRU: "Бодифлекс",
    nameEN: "Bodyflex",
    description: "Дыхательная гимнастика",
    directions: [],
    fitting: [],
    difficulty: "средний",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 15, to: 30 },
    workouts: ["w1b2c3", "w4d5e6", "w7f8g9"],
  },
  {
    _id: "def456",
    nameRU: "Степ-аэробика",
    nameEN: "Step",
    description: "Аэробные нагрузки",
    directions: [],
    fitting: [],
    difficulty: "средний",
    durationInDays: 30,
    dailyDurationInMinutes: { from: 25, to: 45 },
    workouts: ["s1t2u3", "s4v5w6", "s7x8y9"],
  },
  {
    _id: "ghi123",
    nameRU: "Фитнес",
    nameEN: "Fitness",
    description: "Интенсивные тренировки",
    directions: [],
    fitting: [],
    difficulty: "продвинутый",
    durationInDays: 28,
    dailyDurationInMinutes: { from: 30, to: 50 },
    workouts: ["f1g2h3", "f4i5j6", "f7k8l9"],
  },
  {
    _id: "jkl321",
    nameRU: "Стретчинг",
    nameEN: "Stretching",
    description: "Растяжка для всего тела",
    directions: [],
    fitting: [],
    difficulty: "начальный",
    durationInDays: 21,
    dailyDurationInMinutes: { from: 20, to: 35 },
    workouts: ["str1", "str2", "str3", "str4", "str5"],
  },
];

// Тренировки (не изменяются)
export const workouts = {
  "17oz5f": {
    _id: "17oz5f",
    name: "Урок 1. Основы йоги",
    video: "https://www.youtube.com/embed/gJPs7b8SpVw",
    exercises: [
      { _id: "ex1", name: "Наклоны вперед", quantity: 15 },
      { _id: "ex2", name: "Наклоны назад", quantity: 10 },
      { _id: "ex3", name: "Поднятие ног, согнутых в коленях", quantity: 12 },
    ],
  },
  x8abc2: {
    _id: "x8abc2",
    name: "Урок 2. Дыхательные практики",
    video: "https://www.youtube.com/embed/abc123",
    exercises: [
      { _id: "ex4", name: "Наклоны вперед", quantity: 20 },
      { _id: "ex5", name: "Наклоны назад", quantity: 15 },
      { _id: "ex6", name: "Поднятие ног, согнутых в коленях", quantity: 10 },
    ],
  },
};

// Функции для работы с прогрессом
export function getUserProgress(userId, courseId) {
  const stmt = db.prepare(
    "SELECT * FROM user_progress WHERE userId = ? AND courseId = ?",
  );
  const result = stmt.get(userId, courseId);

  if (result) {
    return JSON.parse(result.progress);
  }

  return {
    courseId,
    courseCompleted: false,
    workoutsProgress: [],
  };
}

export function saveUserProgress(userId, courseId, progress) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_progress (userId, courseId, progress)
    VALUES (?, ?, ?)
  `);
  stmt.run(userId, courseId, JSON.stringify(progress));
}
