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
