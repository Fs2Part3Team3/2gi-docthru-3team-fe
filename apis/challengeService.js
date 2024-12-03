import instance from "./instance";

export async function getChallenges(query) {
	try {
		const result = await instance.get(`/challenges`, { params: query });
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function getChallengeWithId(id) {
	try {
		const result = await instance.get(`/challenges/${id}`);
		return result?.data;
	} catch (err) {
		console.error(err);
		// throw err;
		return err?.response?.data || err;
	}
}

export async function getMyChallsOngoing(query) {
	try {
		const result = await instance.get(`/me/challenges/ongoing`, { params: query });
		return result?.data;
	} catch (err) {
		console.error(err);
		// throw err;
		return err?.response?.data || err;
	}
}

export async function getMyChallsCompleted(query) {
	try {
		const result = await instance.get(`/me/challenges/completed`, { params: query });
		return result?.data;
	} catch (err) {
		console.error(err);
		// throw err;
		return err?.response?.data || err;
	}
}

export async function getMyChallsApplied(query) {
	try {
		const result = await instance.get(`/me/challenges/application`, { params: query });
		return result?.data;
	} catch (err) {
		console.error(err);
		// throw err;
		return err?.response?.data || err;
	}
}

export async function doChallenge(challengeId) {
	try {
		const result = await instance.post(`/challenges/${challengeId}/participations`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function deleteChallenge(challengeId, invalidationComment) {
	const data = { invalidationComment };
	console.log(data);
	try {
		const result = await instance.patch(`/challenges/${challengeId}/invalidate`, data);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function deleteChallengeByUser(challengeId) {
	try {
		const result = await instance.delete(`/challenges/${challengeId}`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export const updateChallenge = async (challengeId, data) => {
    try {
      const response = await instance.patch(`/challenges/${challengeId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("챌린지 수정 실패:", error);
      throw error;
    }
  };