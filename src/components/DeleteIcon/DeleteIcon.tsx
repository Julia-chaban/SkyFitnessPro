import React from "react";
import styles from "./DeleteIcon.module.css";

interface DeleteIconProps {
  onClick?: (e: React.MouseEvent) => void;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={styles.iconContainer} onClick={handleClick}>
      <div className={styles.minusIcon}>
        <div className={styles.minusLine} />
      </div>
    </div>
  );
};

export default DeleteIcon;