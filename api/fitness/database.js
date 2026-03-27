import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу базы данных
const dbPath = path.join(__dirname, "fitness.db");
console.log("Database path:", dbPath);

// Создаем подключение к БД
const db = new Database(dbPath);

// Создаем таблицы
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    selectedCourses TEXT
  );
  
  CREATE TABLE IF NOT EXISTS user_progress (
    userId TEXT,
    courseId TEXT,
    progress TEXT,
    PRIMARY KEY (userId, courseId)
  );
`);

console.log("Database initialized successfully");

export default db;
