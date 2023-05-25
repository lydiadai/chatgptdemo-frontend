import request from "@/api/base/request";

export function getChatResponse(text, username) {
	// return request({
	// 	url: "https://openaiseandemo.openai.azure.com/openai/deployments/demo/chat/completions?api-version=2023-03-15-preview",
	// 	method: 'post',
	// 	headers: {
	// 		"api-key": "7ba82d33b2664516a291bb17c4c43771"
	// 	},
	// 	data: {
	// 		"messages":[
	// 			{
	// 				"role":"user",
	// 				"content":text
	// 			}
	// 		],
	// 		"temperature":0.7,
	// 		"top_p":0.95,
	// 		"frequency_penalty":0,
	// 		"presence_penalty":0,
	// 		"max_tokens":800,
	// 		"stop":null,
	// 		"stream":true
	// 	}
	// })
	return request({
		url: "/chatgptCall",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
			"user_name": username,
			"message": text
		}
	})
}
