import instance from "./instance.js";

export async function getNotis({ page = 1, limit = 10, is_read = false }) {
	try {
		const { data } = await instance.get(`/notifications`, { params: { page, limit, is_read }});
		return data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}

export async function readNoti(notiId) {
	try {
		const { data } = await instance.patch(`/notifications/${notiId}/read`);
		return data;
	} catch (err) {
		console.error(err);
		return err?.response?.data || err;
	}
}
