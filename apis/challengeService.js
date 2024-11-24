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
		return err?.response?.data || err;
	}
}

export async function getMyChallsOngoing() {
	try {
		const result = await instance.get(`/challenges`);
		// const result = await instance.get(`/me/challenges/ongoing`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function getMyChallsCompleted() {
	try {
		const result = await instance.get(`/challenges`);
		// const result = await instance.get(`/me/challenges/completed`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function getMyChallsApplied() {
	try {
		const result = await instance.get(`/challenges`);
		// const result = await instance.get(`/me/challenges/application`);
		return result?.data;
	} catch (err) {
		console.error(err);
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
