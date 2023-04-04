import request from "./request";
import { BFFApi } from "./config";

export function list(params) {
  return request({
    url: BFFApi + "/ns/list",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: BFFApi + "/ns",
    method: "post",
    data,
  });
}

export function update(data, id) {
  return request({
    url: BFFApi + `/ns/${id}`,
    method: "put",
    data,
  });
}

export function remove(id) {
  return request({
    url: BFFApi + `/ns/${id}`,
    method: "delete",
  });
}
