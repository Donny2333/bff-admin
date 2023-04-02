import request from "./request";
import { demandApi } from "./config";

export function typeList() {
  return request({
    url: demandApi + "/supplier/type/list",
    method: "get",
  });
}

export function levelList() {
  return request({
    url: demandApi + "/supplier/level/list",
    method: "get",
  });
}

export function supplierQuery(data, pageNum, pageSize) {
  return request({
    url: demandApi + `/supplier/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

export function supplierQueryById(id) {
  return request({
    url: demandApi + `/supplier/${id}`,
    method: "get",
  });
}

export function saveOrUpdate(data) {
  return request({
    url: demandApi + `/supplier/saveOrUpdate`,
    method: "post",
    data,
  });
}

export function change(id, status) {
  return request({
    url: demandApi + `/supplier/change/${id}/${status}`,
    method: "get",
  });
}

export function changeList(id) {
  return request({
    url: demandApi + `/supplier/changeList/${id}`,
    method: "get",
  });
}
