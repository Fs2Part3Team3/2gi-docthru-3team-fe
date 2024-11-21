import { getChallengeWithId } from "@/apis/challengeService.js";
import { GRADE } from "@/apis/translate.js";
import { Field, Type } from "@/components/Challenge.jsx";
import Loading from "@/components/Loading.jsx";
import { useViewport } from "@/context/ViewportProvider.jsx";
import styles from "@/styles/ChallengeDetail.module.css";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function padNumber(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

const PAGE_SIZE = 5;

export function Work({ work, viewport }) {
  const { id, grade, nickname, likeCount, rank } = work;

  return (
    <div className={styles.work} key={id}>
      <div className={styles.rank}>{rank === 1 && <Image width={viewport.size} height={viewport.size} src="/images/ic_crown.png" alt="Crown"/>}{padNumber(rank)}</div>
      <div className={styles.user}>
        <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
        <div className={styles.nicknameAndGrade}>
          <span className={styles.nickname}>{nickname}</span>
          <span className={styles.grade}>{GRADE[grade]}</span>
        </div>
      </div>
      <div className={styles.like}>
        <Image width={viewport.size} height={viewport.size} src="/images/ic_heart.png" alt="Like" />
        <span>{likeCount}</span>
      </div>
      <div className={styles.seeWork}>
        작업물 보기 &gt;
      </div>
    </div>
  );
}

function ChallengeDetail() {
  const [page, setPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [works, setWorks] = useState([]);
  const viewport = useViewport();
  const router = useRouter();
  const [kebabMenuShown, setKebabMenuShown] = useState(false);
  const { challengeId } = router.query;
  const { data: challenge, isPending, isError } = useQuery({
    queryKey: ["challenges", challengeId],
    queryFn: () => getChallengeWithId(challengeId),
    staleTime: 5 * 60 * 1000,
  });
  console.log(challenge);

  useEffect(() => {
    if (challenge) {
      setPageMax(Math.ceil(challenge.works.length / PAGE_SIZE) ?? 1);

      let rank = 1;
      let prevWork = null;
      let offset = 1;
      const rankedWorks = challenge.works.sort((work1, work2) => work2.likeCount - work1.likeCount).map(work => {
        if (prevWork && prevWork.likeCount !== work.likeCount) {
          rank += offset;
          offset = 1;
        } else if (prevWork) {
          offset += 1;
        }
        prevWork = work;
        return { ...work, rank };
      });
      setWorks(rankedWorks);
    }
  }, [challenge]);

  if (isPending) return <Loading />;

  return (
    <>
      <main className={styles.main}>
        <div className={styles.challengeInfoContainer}>
          <div className={styles.headContainer}>
            <div className={styles.head}>
              <h1>{challenge.title}</h1>
              <div className={styles.subHead}>
                <Field field={challenge.field} />
                <Type type={challenge.docType} />
              </div>
            </div>
            {/* TODO: user 가 맞을때만 수정/삭제 보이도록... */}
            <div className={styles.kebabMenu}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_kebab_menu.png" alt="Kebab menu" onClick={() => setKebabMenuShown(prev => !prev)} /></div>
          </div>
          <div className={styles.content}>
            <div className={styles.description}>{challenge.description}</div>
            <div className={styles.writerContainer}>
              <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
              <span>{challenge.applications.user.nickname}</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.challengeDateAndParti}>
            <div className={styles.challengeDeadLine}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_alarm.svg" alt="Alarm" /> {moment(new Date(challenge.deadLine)).format("YYYY년 M월 D일 마감")}</div>
            <div className={styles.challengeParticipants}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_participants.svg" alt="Alarm" /> {challenge.participants}/{challenge.maxParticipants}</div>
          </div>
          <div className={styles.buttons}>
            <button className={`${styles.button} ${styles.seeOriginal}`} type="button" onClick={() => window.open(challenge.docUrl)}>원문 보기</button>
            <button className={styles.button} type="button" onClick={() => router.push(`/challenges/${challengeId}/edit`)}>작업 도전하기</button>
          </div>
        </div>
      </main>
      <div className={styles.participantsContainer}>
        <div className={styles.head}>
          <h2>참여 현황</h2>
          <span className={styles.page}><span className={styles.currentPage}>{page}</span>/{pageMax}</span>
          <div className={styles.pageButtons}>
            <button className={styles.button} type="button" disabled={page === 1} onClick={() => setPage(prev => prev - 1 >= 1 ? prev - 1 : 1)}>&lt;</button>
            <button className={styles.button} type="button" disabled={page === pageMax} onClick={() => setPage(prev => prev + 1 <= pageMax ? prev + 1 : pageMax)}>&gt;</button>
          </div>
        </div>
        <div className={styles.works}>
          {works.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(work => <Work work={work} viewport={viewport} key={work.id} />)}
        </div>
      </div>
    </>
  );
}

export default ChallengeDetail;
