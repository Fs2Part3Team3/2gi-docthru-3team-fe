import React from "react";
import styles from "@/styles/Label.module.css";

function Label({ htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {children}
    </label>
  );
}

export default Label;