// import host from './host'
import request from './request'
import { MessageApi } from './config'
const baseurl = process.env.NODE_ENV == 'development' ? 'http://dev.vendor.dataspace.cestc.cn' : location.origin
// 创建连接
export function createConnnectionUrl(userId) {
    return baseurl + MessageApi + '/sse/connect/' + userId
}
// 关闭链接
export function closeConnnectionUrl(userId) {
    return baseurl + MessageApi + '/sse/close/' + userId
}
//获取所有未读消息
export function getnoReadMessage(params) {
    return request({
      url: MessageApi + `/noReadMessage/${params.pageNumber}/${params.pageSize}`,
      method: 'get',
    })
  }
  //获取所有未读消息
  export function pushMessage(data) {
    return request({
      url: MessageApi + `/push/onlineUser`,
      method: 'post',
      data
    })
  }
  // //标记消息为已读
  // export function readMessage(messageId) {
  //   return request({
  //     url: MessageApi + `/readMessage/${messageId}`,
  //     method: 'get',
  //   })
  // }
  
  // 消息类型
  export function typeList() {
    return request({
      url: `${MessageApi}/type/list`,
      method: 'get',
    })
  }
  
  // 消息来源
  export function sourceList() {
    return request({
      url: `${MessageApi}/source/list`,
      method: 'get',
    })
  }
  
  // 消息列表
  export function messageList(data, params) {
    return request({
      url: `${MessageApi}/messageList/${params.status}/${params.pageSize}/${params.pageNum}`,
      method: 'post',
      data,
    })
  }
  
  // 标记已读
  export function readMessage(params) {
    return request({
      url: `${MessageApi}/readMessage`,
      method: 'get',
      params,
    })
  }
  
  // 全部标记已读
  export function readMessageAll() {
    return request({
      url: `${MessageApi}/readMessage/all`,
      method: 'get',
    })
  }
  
  // 标记未读
  export function noReadMessage(params) {
    return request({
      url: `${MessageApi}/noReadMessage`,
      method: 'get',
      params,
    })
  }
  
  // 删除
  export function delMessage(params) {
    return request({
      url: `${MessageApi}/delMessage`,
      method: 'get',
      params,
    })
  }
  