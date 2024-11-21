import instance from "./instance.js";

export async function postLogin({ email = '', password = '' }) {
	const user = await instance.post(`/auth/login`, { email, password });
	return user.data;
}

export async function postSignup({
	email = '',
	nickname = '',
	password = '',
}) {
	const user = await instance.post(`/auth/signup`, { email, nickname, password });
	return user.data;
}
