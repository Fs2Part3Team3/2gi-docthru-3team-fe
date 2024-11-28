import React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkById, toggleLike } from "@/apis/workService";
import styles from "@/styles/WorkDetail.module.css";
import moment from "moment";
import likeIconActive from "@/public/images/ic_heart.png";
import likeIconInactive from "@/public/images/ic_inactiveheart.png";
import FeedbackForm from "@/components/FeedbackInput";
import FeedbackList from "@/components/FeedbackList";
import Image from "next/image";

const WorkDetail = () => {
  const router = useRouter();
  const { id: workId } = router.query;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workDetail", workId],
    queryFn: () => getWorkById(workId),
    enabled: !!workId,
  });
  console.log("WorkDetail data", data);
    const likeMutation = useMutation({
      mutationFn: () => toggleLike(workId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workDetail", workId] });
      },
      onError: (error) => {
        console.error("좋아요 처리 중 에러:", error);
      },

    });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    if (error.response?.status === 404) {
      return <div>작업물을 찾을 수 없습니다.</div>;
    }
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const handleLikeClick = () => {
    likeMutation.mutate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.workDetail}>
        <h1 style={{ fontSize: "24px"}}>{data?.challenge?.title || "제목 없음"}</h1>
        <div>
          <span className={styles.type}>{data?.challenge?.type || "문서 타입 없음"}</span>
          <span className={styles.field}>{data?.challenge?.field || "카테고리 없음"}</span>
        </div>
        <div className={styles.meta}>
          <div>
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
            <span className={styles.likes}>{data?.likes || 0}</span>
          </div>
          <span className={styles.date}>
          {data?.submittedAt
              ? moment(new Date(data.submittedAt), "yyyy-MM-dd")
              : "날짜 정보 없음"}
          </span>
        </div>
        <p style={{maxWidth: "890px"}}>{data?.content || "내용 없음"}</p>
      </div>
      <FeedbackForm workId={workId} />
      <FeedbackList workId={workId} />
    </div>
  );
};

export default WorkDetail;
