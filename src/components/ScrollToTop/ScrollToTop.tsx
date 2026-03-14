import React, { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button className={styles.scrollButton} onClick={scrollToTop}>
      <span className={styles.arrow}>↑</span>
      <span>Наверх</span>
    </button>
  );
};

export default ScrollToTop;
