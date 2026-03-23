export const API_BASE_URL = "http://localhost:3002/fitness";

export async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Ошибка сервера");
  }

  if (!response.ok) {
    throw new Error(data.message || "Что-то пошло не так");
  }

  return data;
}

export async function authRequest<T>(
  endpoint: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
