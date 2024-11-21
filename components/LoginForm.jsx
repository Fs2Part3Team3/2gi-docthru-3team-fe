import styles from './LoginForm.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function LoginForm() {
  const [pwIsVisible, setPwIsVisible] = useState(false);
  const PWD_MIN_LENGTH = 8;
  const EMAIL_REGEX = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
  });

  return (
    <div className={styles.form}>
      <form
        className={styles.LoginForm}
        onSubmit={e => {
          e.preventDefault();
          login();
        }}
      >
        <label htmlFor="email">
          <p>이메일</p>
          <div className={styles.email}>
            {/* <input id="email" name="email" type="email" placeholder="이메일을 입력해주세요" className={styles.inputNormal} /> */}
            <input
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: { value: EMAIL_REGEX, message: '잘못된 이메일 형식입니다.' },
              })}
              placeholder="이메일을 입력해주세요"
              type="email"
              autoComplete="on"
              required
            />
            {errors.email && <div className={styles.errorMassage}>{errors.email.message}</div>}
          </div>
        </label>
        <label htmlFor="password">
          비밀번호
          <div className={styles.password}>
            <input
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                minLength: { value: PWD_MIN_LENGTH, message: `${PWD_MIN_LENGTH}자 이상 입력해 주세요.` },
              })}
              placeholder="비밀번호를 입력해주세요"
              type={pwIsVisible ? 'text' : 'password'}
              autoComplete="on"
              required
            />
            {errors.password && <div className={styles.errorMassage}>{errors.password.message}</div>}

            <Image
              width={24}
              height={24}
              className={styles.pwToggle}
              src={pwIsVisible ? '/images/vector.png' : '/images/btn_visibility_off_24px.png'}
              alt="비밀번호 보기"
              onClick={() => setPwIsVisible(prev => !prev)}
              priority
            />
          </div>
        </label>
        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
        <div className={styles.signupLink}>
          회원이 아니신가요?
          <Link href="/signup" style={{ color: '#262626', style: 'solid', textDecorationLine: 'underline' }}>
            회원가입하기
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
