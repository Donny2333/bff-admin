import request from "./request";
import { BFFApi } from "./config";

export function list(data) {
  return request({
    url: BFFApi + "/dict/list",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: BFFApi + "/dict",
    method: "post",
    data,
  });
}

export function update(data, id) {
  return request({
    url: BFFApi + `/dict/${id}`,
    method: "put",
    data,
  });
}

export function remove(id) {
  return request({
    url: BFFApi + `/dict/${id}`,
    method: "delete",
  });
}
