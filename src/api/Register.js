import request from "@/api/base/request";

export function Register(username, password, email) {
	return request({
		url: "/registerChatgpt",
		method: 'post',
		data: {
			"user_name": username,
			"password": password,
			"email": email
		}
	})
}
