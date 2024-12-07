import { FIELD, TYPE } from '@/apis/translate.js';
import { useViewport } from '@/context/ViewportProvider';
import styles from './Challenge.module.css';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ic_kebab from '@/public/images/ic_kebab_menu.png';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserProvider';
import Modal from '@/components/Modal.jsx';
import { deleteChallenge } from '@/apis/challengeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function Field({ field }) {
  return <div className={`${styles.challengeField} ${styles[field]}`}>{FIELD[field]}</div>;
}

export function Type({ type }) {
  return <div className={`${styles.challengeType} ${styles[type]}`}>{TYPE[type]}</div>;
}

function Challenge({ challenge, status }) {
  const queryClient = useQueryClient();
  const viewport = useViewport();
  const router = useRouter();
  const user = useUser();
  const kebabRef = useRef();
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');

  const mutation = useMutation({
    mutationFn: data => deleteChallenge(data.id, data.invalidationComment),
    onSuccess: data => {
      setIsModalOpen(false);
      queryClient.invalidateQueries(['challenges']);
    },
    onError: error => {
      console.error(error);
    },
  });

  useEffect(() => {
    const handleClickOutside = e => {
      if (kebabRef.current && !kebabRef.current.contains(e.target)) {
        setIsKebabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  }, [isKebabOpen]);

  const toggleMenu = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const handleEdit = () => {
    router.push(`/challenges/${challenge.id}/editChallenge`);
  };

  const handleDelete = () => {
    mutation.mutate({ id: challenge.id, invalidationComment: invalidMessage });
    setIsModalOpen(false);
  };

  const { id: challengeId, deadLine, maxParticipants, participants, title, field, docType, myWork } = challenge;

  return (
    <div className={styles.challenge}>
      <div className={styles.titleAndKebab}>
        {new Date(deadLine).getTime() < Date.now() && (
          <div className={`${styles.challengeInfo} ${styles.alarm}`}>
            <Image width={viewport.size} height={viewport.size} src="/images/ic_alarm_white.svg" alt="Alarm" />
            <span>챌린지가 마감되었어요.</span>
          </div>
        )}
        {new Date(deadLine).getTime() >= Date.now() && maxParticipants <= participants && (
          <div className={`${styles.challengeInfo} ${styles.fullParticipants}`}>
            <Image width={viewport.size} height={viewport.size} src="/images/ic_participants.svg" alt="Participants" />
            <span>모집이 완료된 상태에요.</span>
          </div>
        )}
        <h2 className={styles.challengeTitle}>
          <Link href={`/challenges/${challengeId}`}>{title}</Link>
        </h2>
        {(user?.id === challenge?.applications?.userId || user?.role === 'Admin') && (
          <Image className={styles.kebab} src={ic_kebab} alt="Kebab menu" onClick={toggleMenu} />
        )}
        {isKebabOpen && (
          <div ref={kebabRef} className={styles.kebabMenu}>
            <button type="button" onClick={handleEdit}>
              수정하기
            </button>
            {user?.role === 'Admin' && (
              <button type="button" onClick={() => setIsModalOpen(true)}>
                삭제하기
              </button>
            )}
          </div>
        )}
      </div>
      <div className={styles.challengeFieldAndType}>
        <Field field={field} />
        <Type type={docType} />
      </div>
      <hr className={styles.hr} />
      <div className={styles.bottomContainer}>
        <div className={styles.challengeDateAndParti}>
          <div className={styles.challengeDeadLine}>
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_alarm.svg" alt="Alarm" />{' '}
            {moment(new Date(deadLine)).format('YYYY년 M월 D일 마감')}
          </div>
          <div className={styles.challengeParticipants}>
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_participants.svg" alt="Alarm" />{' '}
            {participants}/{maxParticipants}&nbsp;{participants >= maxParticipants ? '참여 완료' : '참여중'}
          </div>
        </div>
        {status === 'ongoing' && (
          <button
            className={`${styles.button} ${styles.contiChall}`}
            type="button"
            onClick={() => router.push(`/work/${myWork.id}/edit`)}
          >
            도전 계속하기&nbsp;
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_arrow_right.png" alt="Arrow right" />
          </button>
        )}
        {status === 'completed' && (
          <button
            className={`${styles.button} ${styles.seeMine}`}
            type="button"
            onClick={() => router.push(`/work/${myWork.id}/workdetail`)}
          >
            내 작업물 보기&nbsp;
            <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_document.png" alt="Arrow right" />
          </button>
        )}
      </div>
      {isModalOpen && (
        <Modal
          title="삭제"
          value={invalidMessage}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleDelete}
          onChange={e => setInvalidMessage(e.target.value)}
        />
      )}
    </div>
  );
}

export default Challenge;
