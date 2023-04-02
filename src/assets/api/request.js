
import { Message } from '@arco-design/web-vue';
import axios from 'axios'
import store from "@/store/index";
const service = axios.create({
	baseURL: '/', // url = base url + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 1500000 // request timeout
})
service.interceptors.request.use(
	config => {
		config.headers['Access-Control-Allow-Origin'] = '*'
		config.headers['Content-Type'] = 'application/json;charset=UTF-8'
		const { methed } = config
		if (methed === 'get') {
			config.params = Object.assign({}, config.params, { _t: Math.random() })
			console.log('config.params:', JSON.stringify(config.params));
		}
		config.headers = config.headers || {}
		const token = store.state.user.token
		config.headers.token = token
		return config
	},
	error => {
		Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response
		const code = res.code || 0
		if (code < 200 && code >= 300) {
			Message.error(res.data.message || '网络错误')
			if (code == 401) {
				localStorage.clear()
				sessionStorage.clear()
				window.replace('#/login')
			}
			return Promise.reject(new Error('Error'))
		} else {
			return res.data
		}
	},
	error => {
		if (error && error.response) {
			const { response: { status = 0 } } = error
			const msg = `接口请求失败，错误码为${status}`
			Message.error(error.response.data.message || msg)
			if (status && status === 401) {
				if (status == 401) {
					localStorage.clear()
					sessionStorage.clear()
					window.replace('#/login')
				}
			}
		} else {
			Message.error("网络错误")
		}
		return Promise.reject(error)
	}
)

export default service
