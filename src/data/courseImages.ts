// Соответствие ID курсов и названий (используем ID из API)
export const courseNames: Record<string, string> = {
  ab1c3f: "Йога",
  xyz789: "Бодифлекс",
  def456: "Степ-аэробика",
  ghi123: "Фитнес",
  jkl321: "Стретчинг",
};

// Соответствие ID курсов и изображений для десктопа
export const desktopImages: Record<string, string> = {
  ab1c3f: "card1.jpg",
  xyz789: "card2.jpg",
  def456: "card3.jpg",
  ghi123: "card4.jpg",
  jkl321: "card5.jpg",
};

// Соответствие ID курсов и изображений для мобильных
export const mobileImages: Record<string, string> = {
  ab1c3f: "ioga.svg",
  xyz789: "body.svg",
  def456: "step.svg",
  ghi123: "fit.svg",
  jkl321: "strech.svg",
};

// Иконки для главной страницы (всегда используем мобильные версии)
export const mainPageImages: Record<string, string> = {
  Йога: "ioga.svg",
  Бодифлекс: "body.svg",
  "Степ-аэробика": "step.svg",
  Фитнес: "fit.svg",
  Стретчинг: "strech.svg",
};

// Функция для получения изображения курса для главной страницы по названию
export function getMainPageImage(courseName: string): string {
  return mainPageImages[courseName] || "default.svg";
}

// Функция для получения изображения курса по ID
export function getCourseImage(courseId: string, isMobile: boolean): string {
  const imageName = isMobile ? mobileImages[courseId] : desktopImages[courseId];
  return imageName || "default.jpg";
}
