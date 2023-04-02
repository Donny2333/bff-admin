import request from './request'
import { UserManagement } from './config'
import qs from "qs";
// 登录日志
export function getLoginLogList(data) {
    return request({
        url: `${UserManagement}/loginlog/getLoginLogList`,
        method: 'post',
        data
    })
}

// 导出
export const exportLoginLogList = params => {
    const url = UserManagement + "/loginlog/exportLoginLogList?" + qs.stringify(params);
    window.open(url);


}
