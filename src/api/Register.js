import request from "@/api/base/request";

export function Register(username, password, email) {
	return request({
		url: "/register",
		method: 'post',
		data: {
			"username": username,
			"password": password,
			"email": email
		}
	})
}
