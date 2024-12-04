import { postLogin, postSignup } from '@/apis/authService';
import styles from './SignupForm.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSetUser } from '@/context/UserProvider';
import PopUp from './PopUp';

function SignupForm() {
  const router = useRouter();
  const setUser = useSetUser();
  const PWD_MIN_LENGTH = 8;
  const [pwIsVisible, setPwIsVisible] = useState(false); //비밀번호 보기
  const [pwcIsVisible, setPwcIsVisible] = useState(false); //비밀번호 확인 보기
  const [signupError, setSignupError] = useState(null);
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

  const onSubmit = async ({ email, nickname, password }) => {
    try {
      const userData = await postSignup({ email, nickname, password });
      console.log('회원가입 성공', userData);
      const userDataSignup = await postLogin({ email, password });
      console.log('로그인 성공', userDataSignup);
      setUser(userDataSignup.user);
      router.push('/');
    } catch (error) {
      console.log('회원가입 실패', error);
      setSignupError({ message: `${error.response.data.message}`, onClose: () => setSignupError(null) });
    }
  };

  const password = watch('password');

  return (
    <div className={styles.form}>
      <form className={styles.SignupForm} onSubmit={handleSubmit(onSubmit)}>
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
        <label htmlFor="nickname">
          <p>닉네임</p>
          <div className={styles.nickname}>
            <input
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
              })}
              placeholder="닉네임을 입력해주세요."
              type="nickname"
              required
            />
          </div>
        </label>
        <label htmlFor="password">
          <p>비밀번호</p>
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
              src={pwIsVisible ? '/images/btn_visibility_on.png' : '/images/btn_visibility_off_24px.png'}
              alt="비밀번호 보기"
              onClick={() => setPwIsVisible(prev => !prev)}
              priority
            />
          </div>
        </label>
        <label htmlFor="passwordConfirm">
          <p>비밀번호 확인</p>
          <div className={styles.password}>
            <input
              {...register('passwordConfirm', {
                required: '비밀번호를 입력해주세요.',
                validate: { matchesPassword: value => value === watch('password') || '비밀번호가 일치하지 않습니다.' },
              })}
              placeholder="비밀번호를 입력해주세요"
              type={pwcIsVisible ? 'text' : 'password'}
              autoComplete="on"
              required
            />
            {errors.passwordConfirm && <div className={styles.errorMassage}>{errors.passwordConfirm.message}</div>}

            <Image
              width={24}
              height={24}
              className={styles.pwToggle}
              src={pwcIsVisible ? '/images/btn_visibility_on.png' : '/images/btn_visibility_off_24px.png'}
              alt="비밀번호 보기"
              onClick={() => setPwcIsVisible(prev => !prev)}
              priority
            />
          </div>
        </label>
        <button type="submit" className={styles.loginButton}>
          회원가입
        </button>
        <div className={styles.loginLink}>
          회원이신가요?
          <Link href="/login" style={{ color: '#262626', style: 'solid', textDecorationLine: 'underline' }}>
            로그인하기
          </Link>
        </div>
      </form>
      <PopUp error={signupError} setError={setSignupError} />
    </div>
  );
}

export default SignupForm;
