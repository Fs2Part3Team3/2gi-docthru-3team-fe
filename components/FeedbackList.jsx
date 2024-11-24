import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchFeedbacks = async ({ pageParam = 1, queryKey }) => {
  const [_, workId] = queryKey;
  const { data } = await axios.get(`/api/works/${workId}/feedbacks`, {
    params: { workId, page: pageParam, limit: 3 },
  });
  return data;
};

const FeedbackList = ({ workId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["feedbacks", workId],
    fetchFeedbacks,
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasMore ? allPages.length + 1 : undefined;
      },
    }
  );

  return (
    <div>
      {data?.list.map((list) =>
        list.feedbacks.map((feedback) => (
          <div key={feedback.id}>
            <small>
              {feedback.author} · {feedback.createdAt}
            </small>
            <p>{feedback.content}</p>
          </div>
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