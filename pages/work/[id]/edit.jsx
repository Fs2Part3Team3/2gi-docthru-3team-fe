'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styles from '@/styles/TextEditor.module.css';
import { useRouter } from 'next/router';
import sanitizeHtml from 'sanitize-html';
import { useViewport } from '@/context/ViewportProvider.jsx';
import Image from 'next/image';
import X from '@/components/X.jsx';
import Loading from '@/components/Loading.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteWorkById, getWorkById, patchWorkById } from '@/apis/workService.js';
import PopUp from '@/components/PopUp.jsx';
import { useUser } from '@/context/UserProvider.jsx';
import DelModal from '@/components/DelModal';
import useAuth from '@/utills/useAuth';

const MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ size: [] }],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['clean'],
  ],
};

export const SANITIZE_OPTIONS = {
  allowedTags: [ 'p', 'br', 'span', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'img', 'figure', 'figcaption', 'iframe' ],
  allowedAttributes: {
    span: ['class', 'style'],
    img: ['src', 'alt', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
  },
};

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <Loading />,
});

function TextEditor() {
  const [error, setError] = useState(null);
  const [errorDel, setErrorDel] = useState(null);
  const [reasonDel, setReasonDel] = useState("");
  const user = useUser();
  const router = useRouter();
  const { errorMessage, setErrorMessage } = useAuth();
  const viewport = useViewport();
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const { id } = router.query;
  const STORAGE_KEY = `work_${id}`;
  const queryClient = useQueryClient();
  const { data: work, isPending, isError } = useQuery({
    queryKey: ["works", id],
    queryFn: () => getWorkById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
  console.log("WorkDetail edit work", work);
  const setSanitizedContent = (content) => {
    console.log("content", content);
    const sanitizedContent = sanitizeHtml(content, SANITIZE_OPTIONS);
    setContent(sanitizedContent);
  };
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    setSavedContent(localStorage.getItem(STORAGE_KEY));
    console.log("Saved content", savedContent);
    if (savedContent?.length) {
      setHasDraft(true);
    }
  }, [savedContent, id]);

  useEffect(() => {
    if (work) {
      setSanitizedContent(work.content);
    }
  }, [work]);

  const handleBringBackDraft = () => {
    setSavedContent(localStorage.getItem(STORAGE_KEY));
    console.log("savedContent", savedContent);
    setSanitizedContent(savedContent);
    setHasDraft(false);
  };

  return (
    <>
    {errorMessage && <PopUp onlyCancel={true} error={errorMessage} setError={setErrorMessage} />}
      <div className={styles.head}>
        <h1>{work?.challenge?.title}</h1>
        <div className={styles.buttons}>
          {isAdmin
            ? <button className={`${styles.button} ${styles.giveupButton}`} type="button" onClick={() => {
              setErrorDel({
                onClose: async () => {
                  const result = await deleteWorkById(id, reasonDel);
                  queryClient.invalidateQueries({ queryKey: ["challenges", work?.challenge?.id] });
                  if (result?.message) {
                    setError({ message: result.message, onClose: () => {
                      queryClient.invalidateQueries({ queryKey: ["works", id] });
                      router.push(`/challenges/${work?.challenge?.id}`);
                    }});
                    return;
                  }
                  queryClient.invalidateQueries({ queryKey: ["works", id] });
                  router.push(`/challenges/${work?.challenge?.id}`);
                }
              });
            }}>삭제하기</button>
          : <button className={`${styles.button} ${styles.giveupButton}`} type="button" onClick={() => {
            setError({ message: "작업을 포기하시겠습니까? 이 작업은 되돌릴 수 없습니다.", onClose: () => {
              deleteWorkById(id);
              queryClient.invalidateQueries({ queryKey: ["challenges", work?.challenge?.id] });
              router.push(`/challenges/${work?.challenge?.id}`);
            } });
          }}>포기 <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_giveup.png" alt="Give up" /></button>}
          <button className={`${styles.button} ${styles.tempSave}`} type="button" onClick={() => {
            setSavedContent(content);
            localStorage.setItem(STORAGE_KEY, content);
            console.log("Saved content", content);
            setHasDraft(true);
            alert('임시 저장되었습니다.');
          }}>임시저장</button>
          <button className={`${styles.button} ${styles.submit}`} type="button" onClick={() => {
            setError({
              message: "작업을 제출하시겠습니까? 이전 작업은 덮어씌워집니다.", onClose: () => {
                patchWorkById(id, content);
                queryClient.invalidateQueries({ queryKey: ["challenges", work?.challenge?.id] });
                queryClient.invalidateQueries({ queryKey: ["works", id] });
                router.push(`/challenges/${work?.challenge?.id}`);
              }
            });
          }}>{isAdmin ? "수정하기" : "제출하기"}</button>
        </div>
      </div>
      {hasDraft && (
        <div className={styles.bringBackContainer}>
          <div className={styles.bringBackTitle}>
            &nbsp; &nbsp;<X width={16} height={16} onClick={() => setHasDraft(false)} />
            &nbsp; &nbsp;임시 저장된 작업물이 있어요. 저장된 작업물을 불러오시겠어요??
          </div>
          <button className={styles.bringBackButton} onClick={handleBringBackDraft}>불러오기</button>
        </div>
      )}
      <div className={[styles.iframeContainer, isIframeOpen ? styles.fixed : styles.closed].join(" ")}>
        <iframe
          className={styles.iframe}
          src={work?.challenge?.docUrl ?? "http://example.com"}
          hidden={!isIframeOpen}
        />
        <button className={styles.closeButton} onClick={() => setIsIframeOpen(false)}>
          <X width={viewport.size} height={viewport.size} />
        </button>
        <button className={styles.newOpen} onClick={() => window.open(work?.challenge?.docUrl)}>
          링크 열기
        </button>
      </div>
      <div className={[styles.TextEditor, isIframeOpen ? styles.fixed : ""].join(" ")}>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={MODULES}
          theme="snow"
          placeholder="번역 시작하기..."
        />
      </div>
      <button className={styles.openButton} onClick={() => setIsIframeOpen(true)}><Image width={viewport.size} height={viewport.size} src="/images/ic_list.svg" alt="See original document" />원문</button>
      <PopUp error={error} setError={setError} />
      <DelModal error={errorDel} setError={setErrorDel} reasonDel={reasonDel} setReasonDel={setReasonDel} />
    </>
  );
};

export default TextEditor;
