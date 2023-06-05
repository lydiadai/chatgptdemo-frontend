import request from "@/api/base/request";

export function getRobotGreeting(robot_type) {
	return request({
		url: "getGreeting",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
			"aiType": robot_type
		}
	})
}
