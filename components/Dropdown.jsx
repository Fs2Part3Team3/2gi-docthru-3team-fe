import React, { useState } from "react";
import Label from "./Label";
import styles from "./Dropdown.module.css"
import { FIELD, TYPE } from "@/apis/translate";

const Dropdown = ({ id, label, options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className={styles.input}>
        <input 
          className={styles.inputfield}
          id={id}
          type="text"
          readOnly
          value={FIELD[value] || TYPE[value]}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
        >
        </input>
        <div onClick={() => setIsOpen(!isOpen)}>▼</div>
      </div>
      {isOpen && (
        <ul>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              {FIELD[option] || TYPE[option]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;