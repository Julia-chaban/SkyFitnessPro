import React from "react";
import styles from "./DeleteIcon.module.css";

interface DeleteIconProps {
  isDeleted?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({
  isDeleted = false,
  onClick,
}) => {
  return (
    <div className={styles.iconContainer} onClick={onClick}>
      {isDeleted ? (
        <div className={styles.minusIcon}>
          <div className={styles.minusLine} />
        </div>
      ) : (
        <div className={styles.crossIcon}>
          <div className={`${styles.line} ${styles.horizontal}`} />
          <div className={`${styles.line} ${styles.vertical}`} />
        </div>
      )}
    </div>
  );
};

export default DeleteIcon;
