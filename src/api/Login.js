import request from "@/api/base/request";

export function Login(username, password) {
	return request({
		url: "/loginChatgpt",
		method: 'post',
		data: {
			"user_name": username,
			"password": password
		}
	})
}
