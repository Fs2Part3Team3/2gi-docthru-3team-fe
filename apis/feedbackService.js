import instance from "./instance";

export const postFeedback = async ({ workId, content }) => {
    const { data } = await instance.post(`/works/${workId}/feedbacks`, { content });
    return data;
  };

export const fetchFeedbacks = async ({ pageParam = 1, queryKey }) => {
    const [_, workId] = queryKey;
    const { data } = await instance.get(`/works/${workId}/feedbacks`, {
      params: { page: pageParam, limit: 3 },
    });
    console.log("Fetched feedbacks:", data);
    return data;
  };
  
export const deleteFeedback = async (feedbackId) => {
    await instance.delete(`/feedbacks/${feedbackId}`);
  };
  

export  const updateFeedback = async ({ feedbackId, content }) => {
    const { data } = await instance.patch(`/feedbacks/${feedbackId}`, { content });
    return data;
  };