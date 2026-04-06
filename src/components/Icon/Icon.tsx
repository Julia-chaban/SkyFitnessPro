import React from "react";
import styles from "./Icon.module.css";

interface IconProps {
  type?: "plus" | "minus" | "check";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const Icon: React.FC<IconProps> = ({
  type = "plus",
  onClick,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={`${styles.iconContainer} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
    >
      {type === "plus" && (
        <div className={styles.crossIcon}>
          <div className={`${styles.line} ${styles.horizontal}`} />
          <div className={`${styles.line} ${styles.vertical}`} />
        </div>
      )}
      {type === "minus" && (
        <div className={styles.minusIcon}>
          <div className={styles.minusLine} />
        </div>
      )}
      {type === "check" && (
        <div className={styles.checkIcon}>
          <div className={styles.checkmark} />
        </div>
      )}
    </div>
  );
};

export default Icon;
