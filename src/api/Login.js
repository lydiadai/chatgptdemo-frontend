import request from "@/api/base/request";

export function Login(username, password) {
	return request({
		url: "/login",
		method: 'post',
		data: {
			"username": username,
			"password": password
		}
	})
}
