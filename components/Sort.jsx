import styles from './Sort.module.css';
import { useState, useEffect } from 'react';
import toggle from '@/public/images/ic_toggle_down.png';
import Image from 'next/image';

const sortOptions = [
  { label: '승인 대기', value: 'status=Waiting' },
  { label: '신청 승인', value: 'status=Accepted' },
  { label: '신청 거절', value: 'status=Rejected' },
  { label: '신청 시간 빠른순', value: 'sort=asc,appliedAt' },
  { label: '신청 시간 느린순', value: 'sort=desc,appliedAt' },
  { label: '마감 기한 빠른순', value: 'sort=asc,deadLine' },
  { label: '마감 기한 느린순', value: 'sort=desc,deadLine' },
];

export default function Sort({ currentValue, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentValue, sortOptions[0].value);
  const selectedLabel = sortOptions.find((option) => option.value === selected)?.label || '';

  const handleOptionClick = (value) => {
    setSelected(value);
    onChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div className={styles.sort}>
      <div className={styles.selected} onClick={() => setIsOpen((prev) => !prev)}>
        <p>
          {selectedLabel}
        </p>
        <Image src={toggle} alt="toggle" className={styles.toggle} />
      </div>
      {isOpen && (
        <div className={styles.drop}>
          {sortOptions.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
