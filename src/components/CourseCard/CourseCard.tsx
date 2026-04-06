import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import { coursesService } from "../../services/courses.service";
import styles from "./CourseCard.module.css";

const USER_COURSES_KEY = "user_selected_courses";
const MAX_COURSES = 3;

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
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(USER_COURSES_KEY);
    const courses = saved ? JSON.parse(saved) : [];
    setIsAdded(courses.includes(course.id));
  }, [course.id]);

  const handleCardClick = () => {
    if (isAuthenticated) {
      navigate(`/course/${course.id}/authenticated`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  const handleAddCourse = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      navigate("/auth");
      return;
    }

    if (isAdding || isAdded) return;

    try {
      setIsAdding(true);

      const saved = localStorage.getItem(USER_COURSES_KEY);
      const courses = saved ? JSON.parse(saved) : [];

      if (!courses.includes(course.id)) {
        if (courses.length >= MAX_COURSES) {
          setIsAdding(false);
          return;
        }

        courses.push(course.id);
        localStorage.setItem(USER_COURSES_KEY, JSON.stringify(courses));
        setIsAdded(true);
      }

      try {
        await coursesService.addCourseToUser(course.id, token);
      } catch (apiError) {
        // Игнорируем ошибки API
      }
    } catch (error) {
      // Игнорируем ошибки
    } finally {
      setIsAdding(false);
    }
  };

  const getIconType = () => {
    if (isAdded) return "check";
    return "plus";
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
        <Icon
          type={getIconType()}
          onClick={handleAddCourse}
          disabled={isAdded}
        />
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
