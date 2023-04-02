// import host from './host'
import request from './request'
import { Api, LoginApi } from './config'


// 登录
export function login(data) {
	return request({
		url: LoginApi + '/loginuser/login',
		method: 'post',
		data
	})
}
// 登出
export function logout(data) {
	return request({
		url: LoginApi + '/loginuser/unlogin',
		method: 'post',
		data
	})
}
// 获取所有案件列表'
export function getAllAj(params) {
	return request({
		url: Api + '/getAllAj',
		method: 'get',
		params
	})
}
// 获取所有案件列表'
export function getMergeAj(params) {
	return request({
		url: Api + '/getMergeAj',
		method: 'get',
		params
	})
}

// 获取自增流水号
export function getZzlsh(params) {
	return request({
		url: Api + '/getZzlsh',
		method: 'get',
		params
	})
}

// 获取详情
export function getAjByYwzm(params) {
	return request({
		url: Api + '/getAjByYwzm',
		method: 'get',
		params
	})
}

// 提交/保存
export function save(params) {
	return request({
		url: Api + '/getId',
		method: 'get',
		params
	})
}
export function updateXs(params) {
	return request({
		url: Api + '/updateXs',
		method: 'post',
		params
	})
}
export function getXslyDictionary(params) {
	return request({
		url: Api + '/getXslyDictionary',
		method: 'get',
		params
	})
}



