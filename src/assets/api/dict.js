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
