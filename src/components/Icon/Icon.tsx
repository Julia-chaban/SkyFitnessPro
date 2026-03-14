import React from "react";
import styles from "./Icon.module.css";

const Icon: React.FC = () => {
  return (
    <div className={styles.iconContainer}>
      <div className={styles.crossIcon}>
        <div className={`${styles.line} ${styles.horizontal}`} />
        <div className={`${styles.line} ${styles.vertical}`} />
      </div>
    </div>
  );
};

export default Icon;
