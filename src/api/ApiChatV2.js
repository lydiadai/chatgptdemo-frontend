import request from "@/api/base/request";

export function getChatResponseV2(text, conversation_id) {
	return request({
		url: "v2/message",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
			"conversation_id": conversation_id,
			"message": text
		}
	})
}
