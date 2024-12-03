import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkById, deleteWorkById, toggleLike } from "@/apis/workService";
import styles from "@/styles/WorkDetail.module.css";
import likeIconActive from "@/public/images/ic_heart.png";
import likeIconInactive from "@/public/images/ic_inactiveheart.png";
import FeedbackForm from "@/components/FeedbackInput";
import FeedbackList from "@/components/FeedbackList";
import Image from "next/image";
import { format } from "date-fns";
import { FIELD, TYPE } from "@/apis/translate";
import { useUser } from "@/context/UserProvider";
import menu from "@/public/images/feedback_menu.png"
import useAuth from "@/utills/useAuth";
import PopUp from "@/components/PopUp";

const WorkDetail = () => {
  const router = useRouter();
  const { id: workId } = router.query;
  const queryClient = useQueryClient();
  const user = useUser();
  const kebabRef = useRef();
  const { errorMessage, setErrorMessage } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workDetail", workId],
    queryFn: () => getWorkById(workId),
    enabled: !!workId,
  });

  console.log(data);

  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkById(workId),
    onSuccess: () => {
      queryClient.invalidateQueries(["workDetail"]);
      router.push("/");
    },
    onError: (error) => {
      console.error("삭제 처리 중 에러:", error);
    },
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

  if (isLoading) {
    return <div>로딩 중...</div>;
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
      deleteMutation.mutateAsync(data.id);
      setIsMenuOpen(false);
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
          {data?.user?.id === user?.id && (
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
                  <button onClick={handleDelete} disabled={deleteMutation.isLoading}>
                    {deleteMutation.isLoading ? "삭제 중..." : "삭제하기"}
                  </button>
                </div>
              )}
              </div>
        </div>
        <div className={styles.tag}>
          <span className={styles.type}>{TYPE[data?.challenge?.docType] || "문서 타입 없음"}</span>
          <span className={styles.field}>{FIELD[data?.challenge?.field] || "카테고리 없음"}</span>
        </div>
        <div className={styles.meta}>
          <div className={styles.information}>
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
        <p className={styles.content}>{data?.content || "내용 없음"}</p>
      </div>
      <FeedbackForm workId={workId} />
      <FeedbackList workId={workId} />
    </div>
  );
};

export default WorkDetail;
