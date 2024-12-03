import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFeedback } from "@/apis/feedbackService";
import styles from "./FeedbackInput.module.css";
import inactiveImage from "@/public/images/ic_inactivedown.png";
import activeImage from "@/public/images/ic_activedown.png";
import TextareaItem from "./TextareaItem";
import Image from "next/image";

const FeedbackForm = ({ workId }) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ workId, content }) => postFeedback({ workId, content }),
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
      <TextareaItem
        id="feedback"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="피드백을 남겨주세요"
        className={styles.textarea}
      />
      <button type="submit" disabled={mutation.isLoading || !content.trim()} className={styles.submitButton}>
        <Image
          src={content.trim() ? activeImage : inactiveImage}
          alt="Submit Button"
          width={40}
          height={40}
        />
      </button>
    </form>
  );
};

export default FeedbackForm;