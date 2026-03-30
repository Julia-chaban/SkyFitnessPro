export const courseNames: Record<string, string> = {
  ab1c3f: "Йога",
  "6i67sm": "Степ-аэробика",
  ypox9r: "Фитнес",
  kfpq8e: "Стретчинг",
  q02a6i: "Бодифлекс",
};

// Соответствие ID курсов и номеров картинок
export const courseIdToNumber: Record<string, number> = {
  ab1c3f: 1, // Йога → card1.jpg / ioga.svg
  q02a6i: 2, // Бодифлекс → card2.jpg / body.svg
  "6i67sm": 3, // Степ-аэробика → card3.jpg / step.svg
  ypox9r: 4, // Фитнес → card4.jpg / fit.svg
  kfpq8e: 5, // Стретчинг → card5.jpg / strech.svg
};

// Соответствие номера картинки и имени файла для десктопа
export const desktopImageByNumber: Record<number, string> = {
  1: "card1.jpg",
  2: "card2.jpg",
  3: "card3.jpg",
  4: "card4.jpg",
  5: "card5.jpg",
};

// Соответствие номера картинки и имени файла для мобильных
export const mobileImageByNumber: Record<number, string> = {
  1: "ioga.svg",
  2: "body.svg",
  3: "step.svg",
  4: "fit.svg",
  5: "strech.svg",
};

// Иконки для главной страницы (по названию курса)
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
  const imageNumber = courseIdToNumber[courseId];

  if (!imageNumber) {
    return isMobile ? "ioga.svg" : "card1.jpg";
  }

  return isMobile
    ? mobileImageByNumber[imageNumber]
    : desktopImageByNumber[imageNumber];
}
