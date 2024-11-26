import { doChallenge, getChallengeWithId } from "@/apis/challengeService.js";
import { GRADE } from "@/apis/translate.js";
import { getWorkById } from "@/apis/workService.js";
import { Field, Type } from "@/components/Challenge.jsx";
import Loading from "@/components/Loading.jsx";
import PopUp from "@/components/PopUp.jsx";
import { useUser } from "@/context/UserProvider.jsx";
import { useViewport } from "@/context/ViewportProvider.jsx";
import { SANITIZE_OPTIONS } from "@/pages/work/[id]/edit.jsx";
import styles from "@/styles/ChallengeDetail.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import sanitizeHtml from 'sanitize-html';

function padNumber(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

const PAGE_SIZE = 5;

export function Work({ work, viewport }) {
  const { id, grade, nickname, likeCount, rank, isLiked } = work;

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
        <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src={isLiked ? "/images/ic_heart_active.svg" : "/images/ic_heart_inactive.svg"} alt="Like" />
        <span>{likeCount}</span>
      </div>
      <div className={styles.seeWork}>
        <Link href={`/work/${id}`}>작업물 보기 &gt;</Link>
      </div>
    </div>
  );
}

export function WorkDetail({ work, viewport }) {
  const { id, user: { nickname }, likeCount, rank, content, createdAt, isLiked } = work;

  return (
    <div className={styles.workDetail}>
      <div className={styles.head0}>
        <Image width={viewport.size} height={viewport.size} src="/images/ic_medal.png" alt="Medal" />
        <h2>최다 추천 번역</h2>
      </div>
      <div className={styles.head}>
        <div className={styles.user}>
          <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
          <div className={styles.nicknameAndGrade}>
            <span className={styles.nickname}>{nickname}</span>
            {/* <span className={styles.grade}>{GRADE[grade]}</span> */}
          </div>
        </div>
        <div className={styles.like}>
          <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src={isLiked ? "/images/ic_heart_active.svg" : "/images/ic_heart_inactive.svg"} alt="Like" />
          <span>{likeCount}</span>
        </div>
        <div className={styles.date}>
          <span>{moment(createdAt).format("YYYY.MM.DD")}</span>
        </div>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{__html: sanitizeHtml(content, SANITIZE_OPTIONS)}}></div>
    </div>
  );
}

function ChallengeDetail() {
  const user = useUser();
  const [error, setError] = useState(null);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [works, setWorks] = useState([]);
  const [maxLikeWorks, setMaxLikeWorks] = useState([]);
  const viewport = useViewport();
  const router = useRouter();
  const { challengeId } = router.query;
  const queryClient = useQueryClient();
  const { data: challenge, isPending, isError } = useQuery({
    queryKey: ["challenges", challengeId],
    queryFn: () => getChallengeWithId(challengeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!challengeId,
  });
  // console.log("ChallengeDetail challenge", challenge);
  // console.log("ChallengeDetail user", user);
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    const updateData = async () => {
      if (challenge) {
        const newPageMax = Math.ceil(challenge.works?.list.length / PAGE_SIZE) || 1;
        setPageMax(newPageMax);

        let rank = 1;
        let prevWork = null;
        let offset = 1;
        const rankedWorks = challenge.works?.list.sort((work1, work2) => work2.likeCount - work1.likeCount).map(work => {
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
        const filteredMaxLikeWorks = rankedWorks.filter(work => work.rank === 1);
        const detailedMaxLikeWorks = await Promise.all(filteredMaxLikeWorks.map(async work => await getWorkById(work.id)));

        setMaxLikeWorks(detailedMaxLikeWorks);
      }
    };

    updateData();
  }, [challenge]);

  if (isPending) return <Loading />;
  if (!maxLikeWorks) return <Loading />
  console.log("maxLikeWorks", maxLikeWorks);
  // (async function() {
  //   console.log(await Promise.all(maxLikeWorks));
  // })();
  // maxLikeWorks?.map(work => console.log(work));

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
            {(isAdmin || user?.id === challenge?.applications?.user?.id) && <div className={styles.kebabMenu}>
              <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_kebab_menu.png" alt="Kebab menu" onClick={() => setIsKebabOpen(prev => !prev)} />
              {isKebabOpen && <div className={styles.kebabMenuItems}>
                <div className={styles.kebabMenuItem} onClick={() => router.push(`/challenges/${challengeId}/edit`)}>수정하기</div>
                <div className={styles.kebabMenuItem} onClick={() => router.push(`/challenges/${challengeId}/delete`)}>삭제하기</div>
              </div>}
            </div>}
          </div>
          <div className={styles.content}>
            <div className={styles.description}>{challenge.description}</div>
            <div className={styles.writerContainer}>
              <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
              <span>{challenge?.applications?.user.nickname}</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.challengeDateAndParti}>
            <div className={styles.challengeDeadLine}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_alarm.svg" alt="Alarm" />{moment(new Date(challenge.deadLine)).format("YYYY년 M월 D일 마감")}</div>
            <div className={styles.challengeParticipants}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_participants.svg" alt="Alarm" />{challenge.participants}/{challenge.maxParticipants}</div>
          </div>
          <div className={styles.buttons}>
            <button className={`${styles.button} ${styles.seeOriginal}`} type="button" onClick={() => window.open(challenge.docUrl)}>원문 보기</button>
            <button className={styles.button} type="button" onClick={async () => {
              const { workId, message } = await doChallenge(challengeId);
              setError({ message, onClose:() => {
                queryClient.invalidateQueries({ queryKey: ["challenges", challengeId] });
                if (workId) {
                  router.push(`/work/${workId}/edit`);
                }
              } })
            }} disabled={new Date(challenge.deadLine).getTime() < Date.now()}>작업 도전하기</button>
            {/* {challenge.participants >= challenge.maxParticipants ||} */}
          </div>
        </div>
      </main>
      <div className={styles.maxLikeWorksContainer}>
        {maxLikeWorks?.length > 1
        ? <div className={styles.works}>
            {maxLikeWorks.map(work => <WorkDetail work={work} viewport={viewport} key={work.id} />)}
          </div>
        : maxLikeWorks?.length === 1
        && <WorkDetail work={maxLikeWorks[0]} viewport={viewport} />}
      </div>
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
          {works?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(work => <Work work={work} viewport={viewport} key={work.id} />)}
        </div>
      </div>
      <PopUp error={error} setError={setError} />
    </>
  );
}

export default ChallengeDetail;