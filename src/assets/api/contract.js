import request from "./request";
import { demandApi } from "./config";

export function list(data) {
  return request({
    url: demandApi + "/contract/getContractListByCondition",
    method: "post",
    data,
  });
}

export function detail(params) {
  return request({
    url: demandApi + "/contract/getContractById",
    method: "get",
    params,
  });
}

export function uploadFile(data) {
  return request({
    url: demandApi + "/contract/uploadFile",
    method: "post",
    data,
  });
}

export function create(data) {
  return request({
    url: demandApi + "/contract/createContract",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: demandApi + "/contract/updateContract",
    method: "put",
    data,
  });
}

export function getChangeRecordById(params) {
  return request({
    url: demandApi + "/contract/getChangeRecordById",
    method: "get",
    params,
  });
}

export function updateContractStatus(params) {
  return request({
    url: demandApi + "/contract/updateContractStatus",
    method: "put",
    params,
  });
}
