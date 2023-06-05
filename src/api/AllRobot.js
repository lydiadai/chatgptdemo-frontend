import request from "@/api/base/request";

export function getAllRobot() {
	return request({
		url: "getRobotType",
		method: 'post',
		timeout: 1000 * 60 *3,
		data: {
		}
	})
}
