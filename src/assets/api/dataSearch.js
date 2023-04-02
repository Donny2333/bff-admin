import request from "./request";
import { demandApi } from "./config";

// 数据查询列表
export function getDataList(data) {
    return request({
        url: demandApi + "/search/getDataList",
        method: "post",
        data,
    });
}

// 数据查询详情
export function getDataInfo(id) {
    return request({
        url: demandApi + `/search/getDataInfo/${id}`,
        method: "get",
    });
}