import { request } from "./api";
import { LoginResponse } from "../types/api.types";

// Определяем тип для пользователя
interface MockUser {
  email: string;
  password: string;
  name: string;
}

// Определяем тип для данных пользователя
interface UserData {
  email: string;
  selectedCourses?: string[];
}

// Функция для создания фейкового токена
function createFakeToken(email: string): string {
  return btoa(
    JSON.stringify({
      email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
  );
}

// Функция для декодирования фейкового токена
function decodeFakeToken(token: string): any {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

// Ключ для хранения пользователей в localStorage
const USERS_STORAGE_KEY = "mock_users";

// Получить пользователей из localStorage
function getMockUsers(): MockUser[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Начальные тестовые пользователи
  const defaultUsers: MockUser[] = [
    { email: "test@test.com", password: "Test123!@", name: "Тест" },
    { email: "user@example.com", password: "User123!@", name: "Пользователь" },
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

// Сохранить пользователей в localStorage
function saveMockUsers(users: MockUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  // Регистрация пользователя
  async register(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    try {
      return await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.warn("API недоступен, используем моковую регистрацию");

      const mockUsers = getMockUsers();

      // Проверяем, существует ли уже пользователь
      const existingUser = mockUsers.find((u: MockUser) => u.email === email);
      if (existingUser) {
        throw new Error("Данная почта уже используется. Попробуйте войти.");
      }

      // Добавляем нового пользователя
      mockUsers.push({
        email,
        password,
        name: email.split("@")[0],
      });

      saveMockUsers(mockUsers);
      console.log("Пользователь зарегистрирован:", email);

      return { message: "Регистрация прошла успешно!" };
    }
  },

  // Вход пользователя
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.warn("API недоступен, используем моковый вход");

      const mockUsers = getMockUsers();
      console.log("Доступные пользователи:", mockUsers);

      // Проверяем моковых пользователей
      const user = mockUsers.find((u: MockUser) => u.email === email);

      if (!user) {
        console.log("Пользователь не найден:", email);
        throw new Error("Пользователь с таким email не найден");
      }

      if (user.password !== password) {
        console.log("Неверный пароль для:", email);
        throw new Error("Неверный пароль");
      }

      console.log("Вход успешен для:", email);
      const fakeToken = createFakeToken(email);
      return { token: fakeToken };
    }
  },

  // Получение данных пользователя по токену
  async getUserData(token: string): Promise<{ user: UserData }> {
    try {
      return await request("/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("API недоступен, используем моковые данные");

      const decoded = decodeFakeToken(token);
      if (!decoded) {
        throw new Error("Невалидный токен");
      }

      return {
        user: {
          email: decoded.email,
          selectedCourses: ["1", "2", "3"],
        },
      };
    }
  },
};
