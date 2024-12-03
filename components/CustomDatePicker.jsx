import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Label from "./Label";
import styles from "./CustomDatePicker.module.css"


const CustomDatePicker = ({ id, label, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date) => {
    const isoDate = date.toISOString();
    onChange(isoDate);
    setIsOpen(false);
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.input}>
        <input className={styles.inputfield}
          id={id}
          type="text"
          readOnly
          value={value ? new Date(value).toLocaleDateString() : ""}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div onClick={() => setIsOpen(!isOpen)}>▼</div>
      </div>
      {isOpen && (
        <DatePicker selected={value ? new Date(value) : null} onChange={handleDateChange} inline />
      )}
    </div>
  );
};

export default CustomDatePicker;