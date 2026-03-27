export const courseNames: Record<string, string> = {
  ab1c3f: "Йога",
  "6i67sm": "Степ-аэробика",
  ypox9r: "Фитнес",
  kfpq8e: "Стретчинг",
  q02a6i: "Бодифлекс",
};

export const mainPageImages: Record<string, string> = {
  Йога: "ioga.svg",
  "Степ-аэробика": "step.svg",
  Фитнес: "fit.svg",
  Стретчинг: "strech.svg",
  Бодифлекс: "body.svg",
};

export function getMainPageImage(courseName: string): string {
  return mainPageImages[courseName] || "default.svg";
}

export function getCourseImage(courseId: string, isMobile: boolean): string {
  const images: Record<string, string> = {
    ab1c3f: isMobile ? "ioga.svg" : "card1.jpg",
    "6i67sm": isMobile ? "step.svg" : "card2.jpg",
    ypox9r: isMobile ? "fit.svg" : "card3.jpg",
    kfpq8e: isMobile ? "strech.svg" : "card4.jpg",
    q02a6i: isMobile ? "body.svg" : "card5.jpg",
  };
  return images[courseId] || "default.jpg";
}
