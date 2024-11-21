import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Label from "./Label";
import styles from "@/styles/CustomDatePicker.module.css"
const CustomDatePicker = ({ id, label, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.input}>
        <input className={styles.inputfield}
          id={id}
          type="text"
          readOnly
          value={value ? value.toLocaleDateString() : ""}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle calendar"
        >
          ▼
        </button>
      </div>
      {isOpen && (
        <DatePicker selected={value} onChange={onChange} inline />
      )}
    </div>
  );
};

export default CustomDatePicker;