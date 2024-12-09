import styles from '@/styles/footerContent.module.css';

export default function policy() {
  return (
    <>
      <div className={styles.container}>
        <h1>개인정보 처리방침</h1>
        <section>
          <h2>1. 개인정보의 수집 및 이용 목적</h2>
          <p>
            본 서비스는 회원가입 기능을 통해 사용자에게 맞춤형 서비스를 제공합니다.
            <br />
            회원가입한 정보를 통해 유저를 식별하여 신청한 챌린지, 작성한 번역물 등을 관리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2>2. 수집하는 개인정보 항목</h2>
          <p>
            본 서비스는 사용자의 이메일을 저장합니다.
            <br />이 이메일은 로그인 및 유저 식별을 위해 사용되며, 이외의 용도로는 사용되지 않습니다.
          </p>
        </section>

        <section>
          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            회원가입 시 이메일을 저장하며, 탈퇴 시 삭제됩니다.
            <br />
            이외의 개인정보 저장 및 보유는 이루어지지 않습니다.
          </p>
        </section>

        <section>
          <h2>4. 개인정보의 제3자 제공</h2>
          <p>본 서비스는 수집된 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section>
          <h2>5. 개인정보의 안전성 확보 조치</h2>
          <p>인증 정보는 브라우저 내에 임시로 저장되며, 외부 접근을 차단하여 안전하게 관리됩니다.</p>
        </section>

        <section>
          <h2>6. 사용자 권리</h2>
          <p>사용자는 언제든지 로그아웃하여 인증 정보를 삭제할 수 있으며, 서비스 이용을 중단할 수 있습니다.</p>
        </section>
      </div>
    </>
  );
}
