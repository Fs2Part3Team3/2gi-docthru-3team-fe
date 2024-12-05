import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeedbacks, deleteFeedback, updateFeedback } from "@/apis/feedbackService";
import TextareaItem from "./TextareaItem";
import menu from "@/public/images/feedback_menu.png";
import styles from "./FeedbackList.module.css";
import Image from "next/image";
import { format } from "date-fns";
import { useUser } from "@/context/UserProvider";

const FeedbackItem = ({ feedback }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(feedback.content);
  const kebabRef = useRef();

  const user = useUser();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeedback(feedback.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks", feedback.workId]);
    },
    onError: (error) => {
      console.error("삭제 중 에러 발생:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateFeedback({feedbackId: feedback.id, content}),
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks", feedback.workId]);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("수정 중 에러 발생:", error);
    },
  });

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = () => {
    deleteMutation.mutate(feedback.id);
    setIsMenuOpen(false);
  };

  const handleUpdate = () => {
    if (content.trim()) {
      updateMutation.mutate({ feedbackId: feedback.id, content });
    }
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (kebabRef.current && !kebabRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className={styles.feedbackItem}>
      <div className={styles.profile}>
        <Image
          src={feedback?.user?.profileUrl || "/images/ic_profile.png"}
          alt="프로필 이미지"
          width={32}
          height={32}
        />
        <div className={styles.nameDate}>
          <p>{feedback?.user?.nickname}</p>
          <small>
            {format(new Date(feedback.createdAt), "yyyy/MM/dd HH:mm")}
          </small>
        </div>
      </div>
      {isEditing ? (
        <div className={styles.editFeedback}>
          <div className={styles.editBtn}>
            <button className={styles.cancel} onClick={() => setIsEditing(false)}>취소</button>
            <button className={styles.edit} onClick={handleUpdate} disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? "수정 중..." : "수정 완료"}
            </button>
          </div>
          <TextareaItem
            id="editfeedback"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
        </div>
      ) : (
        <>
          <p>{feedback.content}</p>
          <div className={styles.menuContainer}>
            {feedback.userId === user?.id && (
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
              <div ref={kebabRef} className={styles.dropdownMenu}>
                <button onClick={() => setIsEditing(true)}>수정하기</button>
                <button onClick={handleDelete} disabled={deleteMutation.isLoading}>
                  {deleteMutation.isLoading ? "삭제 중..." : "삭제하기"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FeedbackList = ({ workId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feedbacks", workId],
    queryFn: fetchFeedbacks,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  return (
    <div className={styles.feedbackList}>
      {data?.pages.map((page) =>
        page.list.map((feedback) => (
          <FeedbackItem key={feedback.id} feedback={feedback} />
        ))
      )}
      {hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton}
          >
            {isFetchingNextPage ? "로딩 중..." : "더보기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;