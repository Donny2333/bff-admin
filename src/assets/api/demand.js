import request from "./request";
import { demandApi } from "./config";
import qs from "qs";

// 通过需求ID查询需求
export function demandGet(id) {
  return request({
    url: demandApi + `/demand/${id}`,
    method: "get",
  });
}

// 需求列表-分页
export function demandQuery(data) {
  return request({
    url: demandApi + "/demand/condition",
    method: "post",
    data,
  });
}

// 需求列表-导出
export function demandExport(params) {
  const url = demandApi + "/demand/exportDemandInfo?" + qs.stringify(params);
  window.open(url);
}

// 需求-新增
export function demandCreate(data) {
  return request({
    url: demandApi + "/demand",
    method: "post",
    data,
  });
}

// 需求-修改
export function demandUpdate(data) {
  return request({
    url: demandApi + "/demand",
    method: "put",
    data,
  });
}

// 需求-删除
export function demandDelete(id) {
  return request({
    url: demandApi + `/demand/${id}`,
    method: "delete",
  });
}

// 授权供应商
export function authVendors(data) {
  return request({
    url: demandApi + "/demand/authVendors",
    method: "post",
    data,
  });
}

// 供应商领取需求
export function receiveDemand(demandId) {
  return request({
    url: demandApi + `/demand/${demandId}/receive`,
    method: "get",
  });
}

// 供应商领取需求
export function publishData(data) {
  return request({
    url: demandApi + `/publish`,
    method: "post",
    data,
  });
}

// 获取授权供应商列表
export function getVendorsById(id) {
  return request({
    url: demandApi + `/demand/getVendorsById/${id}`,
    method: "get",
  });
}

// 获取字典接口
export function getDictData(params) {
  return request({
    url: demandApi + `/dict-data`,
    method: "get",
    params,
  });
}

// 发布数据
export function pushData(data) {
  return request({
    url: demandApi + `/search/pushData`,
    method: "post",
    data,
  });
}

export function getDataInfoByDemand(id) {
  return request({
    url: demandApi + `/search/getDataInfoByDemand/${id}`,
    method: "get",
  });
}
