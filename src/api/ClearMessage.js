import request from "@/api/base/request";

export function clearMessage(username, conversation_id) {
	return request({
		url: "chat/clear",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
			"conversation_id": conversation_id,
			"username": username
		}
	})
}
