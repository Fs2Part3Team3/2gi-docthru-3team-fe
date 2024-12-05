import { getApplicationWithId, invalidateApplication } from '@/apis/applicationService';
import { Field, Type } from '@/components/Challenge.jsx';
import Error from '@/components/Error.jsx';
import Loading from '@/components/Loading';
import { useViewport } from '@/context/ViewportProvider';
import styles from '@/styles/ManageApp.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment, { invalid } from 'moment';
import Image from 'next/image';
import ic_kebab_menu from '@/public/images/ic_kebab_menu.png';
import ic_open_link from '@/public/images/ic_open_link.png';
import { useRouter } from 'next/router';
import UserDelModal from '@/components/UserDelModal';
import { useState } from 'react';
import { useUser } from '@/context/UserProvider';
import { deleteApplication } from '@/apis/applicationService';

function AppliedChallenge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const viewport = useViewport();
  const router = useRouter();
  const user = useUser();
  const { applicationId } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const onSubmit = async applicationId => {
    try {
      const applicationData = await deleteApplication(applicationId);
      console.log('취소 성공', applicationData);
      queryClient.setQueryData(['applications', applicationId], null);
      queryClient.invalidateQueries({ queryKey: ['applications', '*'] });
      router.push('/users/me/challenges/applied');
    } catch (error) {
      console.log('취소 실패', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
            <div className={styles.subHeadBox}>
              <div className={styles.subHead}>
                <Field field={challenge.field} />
                <Type type={challenge.docType} />
              </div>
              <div className={styles.delKebab}>
                {application.status === 'Waiting' && (
                  <button className={styles.menuButton} onClick={handleMenuToggle}>
                    <Image src={ic_kebab_menu} alt="더보기" width={24} height={24} />
                  </button>
                )}
                {isMenuOpen && (
                  <button className={styles.delButton} type="button" onClick={() => setIsModalOpen(true)}>
                    취소하기
                  </button>
                )}
              </div>
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
          <a href={challenge.docUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
            <Image src={ic_open_link} height={26} width={79} alt="원문 링크 열기" />
          </a>
        </div>
      </div>
      {isModalOpen && (
        <UserDelModal
          title="정말 취소하시겠어요?"
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {
            onSubmit(applicationId);
            setIsModalOpen(false);
          }}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}

export default AppliedChallenge;
