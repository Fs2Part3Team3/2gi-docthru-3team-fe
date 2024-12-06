import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkById, deleteWorkById, toggleLike } from "@/apis/workService.js";
import styles from "@/styles/WorkDetail.module.css";
import likeIconActive from "@/public/images/ic_heart.png";
import likeIconInactive from "@/public/images/ic_inactiveheart.png";
import FeedbackForm from "@/components/FeedbackInput.jsx";
import FeedbackList from "@/components/FeedbackList.jsx";
import Image from "next/image";
import { format } from "date-fns";
import { FIELD, TYPE } from "@/apis/translate.js";
import { useUser } from "@/context/UserProvider.jsx";
import menu from "@/public/images/feedback_menu.png"
import useAuth from "@/hooks/useAuth.jsx";
import PopUp from "@/components/PopUp.jsx";
import Loading from "@/components/Loading.jsx";
import sanitizeHtml from 'sanitize-html';
import { SANITIZE_OPTIONS } from "./edit.jsx";
import DelModal from "@/components/DelModal.jsx";

const WorkDetail = () => {
  const router = useRouter();
  const { id: workId } = router.query;
  const queryClient = useQueryClient();
  const user = useUser();
  const reasonDelRef = useRef("");
  const kebabRef = useRef();
  const { errorMessage, setErrorMessage } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [errorDel, setErrorDel] = useState(null);
  const [reasonDel, setReasonDel] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workDetail", workId],
    queryFn: () => getWorkById(workId),
    enabled: !!workId,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(workId),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["workDetail", workId], (oldData) => ({
        ...oldData,
        isLiked: !oldData.isLiked,
        likeCount: updatedData.likeCount,
      }));
    },
    onError: (error) => {
      console.error("좋아요 처리 중 에러:", error);
    },
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      const { target } = e;
      if (kebabRef.current && !kebabRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    reasonDelRef.current = reasonDel;
  }, [reasonDel]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error.response?.status === 404) {
      return <div>작업물을 찾을 수 없습니다.</div>;
    }
    return <div>오류가 발생했습니다: {error.message}</div>;
  }


  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    router.push(`/work/${workId}/edit`)
  }

  const handleDelete = () => {
    if (user?.role === "Admin") {
      setIsDelModalOpen(true);
      setErrorDel({
        onClose: async () => {
          try {
            const latestReasonDel = reasonDelRef.current;
            if (!latestReasonDel.trim()) {
              alert("삭제 사유를 입력해주세요.");
              return;
            }
            await deleteWorkById(workId, latestReasonDel)
            await queryClient.invalidateQueries(["workDetail", workId])
            queryClient.invalidateQueries(["challenges"]);
            router.push(`/challenges/${data?.challenge?.id}`)
          } catch (error) {
              console.error("삭제 중 오류:", error);
              alert(error.response.data?.message);
          };
          console.log("data", data);
          setIsDelModalOpen(false);
        },
        onCancel: () => {
          setIsDelModalOpen(false);
        },
      });
    } else {
      deleteWorkById(workId)
        .then(() => {
          queryClient.invalidateQueries(["workDetail"]);
          queryClient.invalidateQueries(["challenges"]);
          router.push(`/challenges/${data.challenge.id}`);
        })
        .catch((error) => {
          console.error("삭제 중 오류:", error);
        });
    }
  };

  const handleLikeClick = () => {
    likeMutation.mutate();
  };

  return (
    <div className={styles.container}>
      {errorMessage && <PopUp onlyCancel={true} error={errorMessage} setError={setErrorMessage} />}
      <div className={styles.workDetail}>
        <div className={styles.head}>
          <h1 style={{ fontSize: "24px", padding: "1rem 0 1rem"}}>{data?.challenge?.title || "제목 없음"}</h1>
          <div ref={kebabRef} className={styles.kebab}>
          {(data?.user?.id === user?.id || user?.role === "Admin") && (
                <button className={styles.menuButton} onClick={handleMenuToggle}>
                  <Image
                    src={menu}
                    alt="더보기"
                    width={16}
                    height={16}
                  />
                </button>
              )}
              {isMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleEdit}>수정하기</button>
                  <button onClick={handleDelete}>
                    삭제하기
                  </button>
                </div>
              )}
              {isDelModalOpen && <DelModal error={errorDel} setError={setErrorDel} reasonDel={reasonDel} setReasonDel={setReasonDel} />}
          </div>
        </div>
        <div className={styles.tag}>
          <span className={styles.field}>{FIELD[data?.challenge?.field] || "카테고리 없음"}</span>
          <span className={styles.type}>{TYPE[data?.challenge?.docType] || "문서 타입 없음"}</span>
        </div>
        <div className={styles.meta}>
          <div className={styles.information}>
            <Image className={styles.profileImg} width={24} height={24} src="/images/ic_profile.png" alt="프로필" />
            <span className={styles.nickname}>{data?.user?.nickname || "작성자 없음"}</span>
            <button
              className={styles.likeButton}
              onClick={handleLikeClick}
              disabled={likeMutation.isLoading}
            >
              <Image
                width={16}
                height={16}
                src={data?.isLiked ? likeIconActive : likeIconInactive}
                alt="좋아요 아이콘"
                className={styles.likeIcon}
              />
            </button>
            <span className={styles.likes}>{data?.likeCount}</span>
          </div>
          <span className={styles.date}>
          {data?.lastModifiedAt
              ? format(new Date(data.lastModifiedAt), "yyyy-MM-dd")
              : "날짜 정보 없음"}
          </span>
        </div>
        <p className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.content, SANITIZE_OPTIONS) }}></p>
      </div>
      <FeedbackForm workId={workId} />
      <FeedbackList workId={workId} />
    </div>
  );
};

export default WorkDetail;
