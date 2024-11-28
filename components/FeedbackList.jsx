import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/apis/instance";
import TextareaItem from "./TextareaItem";
import menu from "@/public/images/feedback_menu.png";
import styles from "./FeedbackList.module.css";
import Image from "next/image";
import { format } from "date-fns";


const fetchFeedbacks = async ({ pageParam = 1, queryKey }) => {
  const [_, workId] = queryKey;
  const { data } = await instance.get(`/works/${workId}/feedbacks`, {
    params: { page: pageParam, limit: 3 },
  });
  console.log("Fetched feedbacks:", data);
  return data;
};

const deleteFeedback = async (feedbackId) => {
  await instance.delete(`/feedbacks/${feedbackId}`);
};

const updateFeedback = async ({ feedbackId, content }) => {
  const { data } = await instance.patch(`/feedbacks/${feedbackId}`, { content });
  return data;
};

const FeedbackItem = ({ feedback }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(feedback.content);

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
    mutationFn: () => updateFeedback( {feedbackId: feedback.id, content}),
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

  return (
    <div className={styles.feedbackItem}>
      <p>
        {feedback.userId}
      </p>
      <small>
        {format(new Date(feedback.createdAt), "yyyy/MM/dd HH:mm")}
      </small>
      {isEditing ? (
        <div className={styles.editFeedback}>
          <TextareaItem
            id="editfeedback"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div>
            <button onClick={() => setIsEditing(false)}>취소</button>
            <button onClick={handleUpdate} disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>{feedback.content}</p>
          <div className={styles.menuContainer}>
            <button className={styles.menuButton} onClick={handleMenuToggle}>
              <Image
                src={menu}
                alt="더보기"
                width={16}
                height={16}
              />
            </button>
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
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
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    }
  );

  return (
    <div>
      {data?.pages.map((page) =>
        page.list.map((feedback) => (
          <FeedbackItem key={feedback.id} feedback={feedback} />
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "로딩 중..." : "더보기"}
        </button>
      )}
    </div>
  );
};

export default FeedbackList;