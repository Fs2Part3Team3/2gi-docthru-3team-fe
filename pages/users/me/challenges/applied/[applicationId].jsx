import { getApplicationWithId, invalidateApplication } from '@/apis/applicationService';
import { Field, Type } from '@/components/Challenge.jsx';
import Error from '@/components/Error.jsx';
import Loading from '@/components/Loading';
import { useViewport } from '@/context/ViewportProvider';
import styles from '@/styles/ManageApp.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment, { invalid } from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { useUser } from '@/context/UserProvider';

function AppliedChallenge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const viewport = useViewport();
  const router = useRouter();
  const user = useUser();
  const { applicationId } = router.query;

  const queryClient = useQueryClient();

  const {
    data: application,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['applications', applicationId, user?.id],
    queryFn: () => getApplicationWithId(applicationId),
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: data => invalidateApplication(applicationId, data.status, data.invalidationComment),
    onSuccess: data => {
      console.log('successfully updated: ', data);
      queryClient.invalidateQueries(['applications', applicationId]);
    },
    onError: error => {
      console.error(error);
    },
  });

  const handleInvalidate = () => {
    mutation.mutate({ status: 'Invalidated' });
  };

  if (isPending) return <Loading />;
  if (isError) return <Error />;

  const { id, challenge } = application;

  return (
    <main className={styles.main}>
      <div className={styles.challengeInfoContainer}>
        <div className={styles.headContainer}>
          <div className={styles.head}>
            <div className={styles.number}>No.&nbsp;{id}</div>
            <div className={styles.pending}>
              <div className={`${styles.status} ${styles[application.status]}`}>
                <p>
                  {application.status === 'Rejected'
                    ? '신청이 거절된 챌린지입니다.'
                    : application.status === 'Accepted'
                      ? '신청이 승인된 챌린지입니다.'
                      : application.status === 'Waiting'
                        ? '승인 대기 중입니다.'
                        : '삭제된 챌린지 입니다.'}
                </p>
              </div>
              {application.status === 'Rejected' && (
                <div className={styles.comment}>
                  <h1>신청 거절 사유</h1>
                  <p className={styles.commentContent}> {application.invalidationComment}</p>
                  <p className={styles.date}>{application.invalidatedAt}</p>
                </div>
              )}
              {application.status === 'Invalidated' && application.invalidationComment && (
                <div className={styles.comment}>
                  <h1>삭제 사유</h1>
                  <p className={styles.commentContent}>{application.invalidationComment}</p>
                  <p className={styles.date}>{moment(new Date(application.invalidatedAt)).format('YYYY-MM-DD hh:mm')}</p>
                </div>
              )}
            </div>
            <h1>{challenge.title}</h1>
            <div className={styles.subHead}>
              <div>
                <Field field={challenge.field} />
                <Type type={challenge.doctype} />
              </div>
              {application.status === 'Waiting' && (
                <div className={styles.buttons}>
                  <button className={`${styles.button} ${styles.invalidate}`} type="button" onClick={handleInvalidate}>
                    취소하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.description}>{challenge.description}</div>
        </div>
        <div className={styles.challengeDateAndParti}>
          <div className={styles.challengeDeadLine}>
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_alarm.svg" alt="Alarm" />
            {moment(new Date(challenge.deadLine)).format('YYYY년 M월 D일 마감')}
          </div>
          <div className={styles.challengeParticipants}>
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_participants.svg" alt="Alarm" />
            {challenge.maxParticipants}
          </div>
        </div>
      </div>
      <div className={styles.originalLinkIframe}>
        <h2>원문 링크</h2>
        <div className={styles.iframeContainer}>
          <iframe src={challenge.docUrl} width="100%" height="100%" />
        </div>
      </div>
    </main>
  );
}

export default AppliedChallenge;
