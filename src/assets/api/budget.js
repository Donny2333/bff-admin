import request from "./request";
import { VBApi } from "./config";

export function queryBranchBankList(data, pageNum, pageSize) {
  return request({
    url: VBApi + `/branchBank/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

export function queryDeptList(data, pageNum, pageSize) {
  return request({
    url: VBApi + `/dept/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

export function list(data, pageNum, pageSize) {
  return request({
    url: VBApi + `/bankBudgetissued/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

export function append(data) {
  return request({
    url: VBApi + `/bankBudgetissued/append`,
    method: "post",
    data,
  });
}

export function queryQuotaList(params) {
  return request({
    url: VBApi + `/bankBudgetissued/quota`,
    method: "get",
    params,
  });
}

// 总行预算下发列表
export function distributeList(data, pageNum, pageSize) {
  return request({
    url: VBApi + `/brankBankBudgetIssued/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

// 支行预算下发列表
export function distributeList2(data, pageNum, pageSize) {
  return request({
    url: VBApi + `/deptBudgetIssued/list/${pageNum}/${pageSize}`,
    method: "post",
    data,
  });
}

// 总行下发预算
export function distributeAppend(data) {
  return request({
    url: VBApi + `/brankBankBudgetIssued/append`,
    method: "post",
    data,
  });
}

// 支行下发预算
export function distributeAppend2(data) {
  return request({
    url: VBApi + `/deptBudgetIssued/append`,
    method: "post",
    data,
  });
}
