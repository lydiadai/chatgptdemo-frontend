import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: "/",
		redirect:'/login',
	},
	{
		path: '/login',
		name: 'Login',
		component: () =>
			import ('@/components/LoginUser.vue')
	},
	{
		path: '/register',
		name: 'Register',
		component: () =>
			import ('@/components/RegisterUser.vue')
	},
	{
		path: '/chat',
		name: 'Chat',
		component: () =>
			import('@/components/ChatGPT')
	},
	{
		path: '/choose_robot',
		name: 'ChooseRobot',
		component: () =>
			import('@/components/ChooseRobot')
	}
]

const router = createRouter({
	//history模式：createWebHistory , hash模式：createWebHashHistory
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
