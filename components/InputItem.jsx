import React from "react";
import Label from "./Label";
import styles from "@/styles/InputItem.module.css"

function InputItem({
    id,
    label,
    register = {},
    ...inputProps
  }) {
    return (
      <div>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input className={styles.input}
          id={id}
          {...inputProps}
          {...register}
        />
      </div>
    );
  }
  
  export default InputItem;
  