import instance from "./instance.js";

export async function getApplications(query) {
	try {
		const result = await instance.get(`/applications`, { params: query });
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function getApplicationWithId(id) {
	try {
		const result = await instance.get(`/applications/${id}`);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function invalidateApplication(id, status, invalidationComment) {
	const data = { status, invalidationComment };
	try {
		const result = await instance.patch(`/applications/${id}`, data);
		return result?.data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}
