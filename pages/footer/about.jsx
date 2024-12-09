import styles from '@/styles/footerContent.module.css';

export default function about() {
  return (
    <>
      <div className={styles.container}>
        <h1>프로젝트 소개</h1>
        <section>
          <h2>1. 프로젝트 개요</h2>
          <p>본 프로젝트는 Codeit FS 2기 교육과정으로 진행된 개발 문서 번역 챌린지 서비스입니다.</p>
          <p>
            대다수의 개발 시장 콘텐츠가 영어로 작성되어 있어, 영어를 잘하지 못하는 한국인들이 해당 기술을 습득하는데 어려움을 겪고
            있습니다.
            <br />본 서비스는 개발 관련 영어 문서를 함께 번역하는 챌린지를 진행하고, 번역 작업 에디터에서 번역을 진행하며 번역문에
            대한 피드백을 주고받을 수 있습니다.
          </p>
        </section>

        <section>
          <h2>2. 주요 기능</h2>
          <ul>
            <li>개발 문서 번역 챌린지 신청</li>
            <li>개발 문서 번역</li>
            <li>개발 문서 번역물 피드백</li>
            <li>사용자 계정을 기반으로 나의 챌린지 및 작업물 관리</li>
            <li>어드민 계정을 통한 전체 챌린지, 작업물 및 피드백 관리</li>
          </ul>
        </section>

        <section>
          <h2>3. 사용 기술 스택</h2>
          <p>이 프로젝트는 최신 웹 기술을 활용하여 개발되었습니다.</p>
          <ul>
            <li>프론트엔드: Next.js, Tanstack React Query</li>
            <li>백엔드: Node.js, Express, JavaScript</li>
            <li>데이터베이스: PostgreSQL, Prisma, Trigger, Stored Procedure</li>
            <li>스타일링: CSS Modules</li>
            <li>배포: Vercel, Render</li>
          </ul>
        </section>

        <section>
          <h2>4. 프로젝트의 특징 및 장점</h2>
          <ol>
            <li>
              <strong>유저 계정 기반의 정보 관리</strong>
              <p>
                <span>유저 계정 로그인을 통해 챌린지 신청 정보, 작업물 수정, 피드백 작성 등의 기능을 제공합니다.</span>
              </p>
            </li>
            <li>
              <strong>동순위 항목에 대한 완벽한 정렬 구현</strong>
              <p>
                <span>매번 API 요청 시 동일한 결과를 보장하여 데이터의 일관성을 유지합니다.</span>
              </p>
            </li>
            <li>
              <strong>모바일 환경에서의 안정적인 레이아웃 제공</strong>
              <p>
                <span>텍스트 버튼, 검색창, 드롭다운 메뉴 등이 모바일 화면에서도 깨지지 않고 정상적으로 표시됩니다.</span>
              </p>
            </li>
            <li>
              <strong>사용자 편의성을 높인 입력 방식</strong>
              <p>
                <span>
                  팝업창이 뜰 때 입력 창에 자동으로 포커스되며, 데이터 입력 후 버튼 클릭 없이 엔터 키를 눌러 해당 프로세스를
                  수행할 수 있도록 사용자 편의성을 증대시켰습니다.
                </span>
              </p>
            </li>
            <li>
              <strong>로깅 기능 구현</strong>
              <p>
                <span>
                개발 환경에서만 로그를 출력하고, 필요 시 DEBUG 모드를 활성화하여 개발자가 개발 중 발생하는 오류와 디버깅 정보를 빠르게 파악할 수 있도록 로깅 기능을 구현하였습니다.
                </span>
              </p>
            </li>
            <li>
              <strong>커스텀 에러 핸들러 구현</strong>
              <p>
                <span>
                애플리케이션의 오류를 체계적으로 관리하고 가독성과 유지보수성을 높이기 위해, 공통 에러 처리 로직을 캡슐화하고 각 에러의 의미를 명확히 전달할 수 있는 커스텀 에러 핸들러를 구현하였습니다.
                </span>
              </p>
            </li>
            <li>
              <strong>트리거 및 저장 프로시저 구현</strong>
              <p>
                <span>
                트리거와 저장 프로시저를 활용하여 데이터베이스에서 반복 작업을 자동화하고 비즈니스 로직을 데이터베이스 계층에서 처리함으로써 애플리케이션 로직의 복잡성을 줄이도록 구현하였습니다.
                </span>
              </p>
            </li>
          </ol>
        </section>
        <section>
          <h2>5. 개발 팀 정보</h2>
          <p>본 프로젝트는 Codeit FS 2기 Part3 3팀이 개발했습니다.</p>
          <ul>
            <li>팀장: 소재희</li>
            <li>BE 파트: 신지원(파트장), 소재희, 현준배</li>
            <li>FE 파트: 이강수(파트장), 김은효, 서지우, 천우승</li>
          </ul>
        </section>
      </div>
    </>
  );
}
