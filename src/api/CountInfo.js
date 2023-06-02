import request from "@/api/base/request";

export function CountInfo(username) {
	return request({
		url: "/countInfo",
		method: 'post',
		data: {
			"username": username
		}
	})
}
