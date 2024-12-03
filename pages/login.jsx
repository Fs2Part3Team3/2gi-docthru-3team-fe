import Image from 'next/image';
import styles from '@/styles/login.module.css';
import LoginForm from '@/components/LoginForm';

export default function Login() {
  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <Image width={320} height={72} src="/images/img_logo.png" alt="로고" priority />
        <LoginForm />
      </div>
    </div>
  );
}
