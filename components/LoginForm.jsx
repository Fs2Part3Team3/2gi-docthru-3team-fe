import { postLogin } from '@/apis/authService';
import styles from './LoginForm.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import PopUp from './PopUp';
import { useSetUser } from '@/context/UserProvider';
import google from '@/public/images/google.webp';
import kakao from '@/public/images/kakao.png';

function LoginForm() {
  const router = useRouter();
  const setUser = useSetUser();
  const [pwIsVisible, setPwIsVisible] = useState(false);
  const [loginError, setLoginError] = useState(null);
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

  const onSubmit = async ({ email, password }) => {
    try {
      const userData = await postLogin({ email, password });
      console.log('로그인 성공', userData);
      setUser(userData.user);
      if (userData.user.role === 'Admin') {
        router.push('/admin/manage');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log('로그인 실패', error);
      setLoginError({ message: '이메일 또는 비밀번호가 잘못되었습니다.', onClose: () => setLoginError(null) });
    }
  };

  return (
    <div className={styles.form}>
      <form className={styles.LoginForm} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">
          <p>이메일</p>
          <div className={styles.email}>
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
        <div className={styles.socialLogin}>
          <p>소셜 로그인</p>
          <div className={styles.loginBtn}>
            <Image 
              src={google} 
              alt="구글 로그인" 
              className={styles.googleLogin} 
              priority 
              onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google` }}
            />
            <Image
              src={kakao}
              alt="카카오 로그인"
              className={styles.kakaoLogin}
              onClick={() => {window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao`}}
            />
          </div>
        </div>
        <div className={styles.signupLink}>
          회원이 아니신가요?
          <Link href="/signup" style={{ color: '#262626', style: 'solid', textDecorationLine: 'underline' }}>
            회원가입하기
          </Link>
        </div>
      </form>
      <PopUp error={loginError} setError={setLoginError} />
    </div>
  );
}

export default LoginForm;
