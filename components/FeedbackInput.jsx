import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styles from "@/styles/FeedbackForm.module.css";

const postFeedback = async ({ workId, content }) => {
  const { data } = await axios.post(`/api/works/${workId}/feedbacks`, { content });
  return data;
};

const FeedbackForm = ({ workId }) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(postFeedback, {
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks", workId]);
      setContent("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      mutation.mutate({ workId, content });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.feedbackForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="피드백을 남겨주세요"
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "전송 중..." : "피드백 남기기"}
      </button>
    </form>
  );
};

export default FeedbackForm;