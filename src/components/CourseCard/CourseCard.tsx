import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import styles from "./CourseCard.module.css";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    image: string;
    duration: string;
    timePerDay: string;
    difficulty: string;
  };
  isAuthenticated?: boolean;
  token?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isAuthenticated = false,
  token,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isAuthenticated) {
      navigate(`/course/${course.id}/authenticated`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={`${process.env.PUBLIC_URL}/images/${course.image}`}
          alt={course.title}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.style.background = "#D9D9D9";
          }}
        />
        <Icon />
      </div>

      <div className={styles.contentContainer}>
        <h3 className={styles.title}>{course.title}</h3>

        <div className={styles.firstRow}>
          <img
            src={`${process.env.PUBLIC_URL}/images/25day.svg`}
            alt="25 дней"
            className={styles.daysIcon}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/20min.svg`}
            alt="20-50 мин/день"
            className={styles.timeIcon}
          />
        </div>

        <img
          src={`${process.env.PUBLIC_URL}/images/mult.svg`}
          alt="Сложность"
          className={styles.difficultyIcon}
        />
      </div>
    </div>
  );
};

export default CourseCard;
