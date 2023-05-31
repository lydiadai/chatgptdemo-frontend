import request from "@/api/base/request";

export function FileUpload(file_urls, conversation_id) {
	return request({
		url: "/file/upload",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
			"file_urls": file_urls,
			"conversation_id": conversation_id
		}
	})
}
