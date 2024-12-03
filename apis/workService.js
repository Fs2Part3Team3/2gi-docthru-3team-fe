import instance from "./instance";

export async function getWorkById(workId) {
	try {
		const result = await instance.get(`/works/${workId}`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function patchWorkById(workId, content) {
	try {
		const result = await instance.patch(`/works/${workId}`, { content });
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function deleteWorkById(workId, reasonDel) {
	try {
		const result = await instance.delete(`/works/${workId}`, reasonDel ? { data: { message: reasonDel } } : undefined);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function toggleLike(workId) {
	try {
		const result = await instance.post(`/works/${workId}/likes`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}
