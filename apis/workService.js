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

export async function deleteWorkById(workId) {
	try {
		const result = await instance.delete(`/works/${workId}`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}
