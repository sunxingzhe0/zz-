import request from '@/libs/request'

/**
 * @description 数据统计--板块
 * @param {Object} param params {Object} 传值参数
 */
//数据统计
export function userStaticsListApi (params) {
    return request({
        url: '/user/user/statistic',
        method: 'get',
        params
    })
}
//下载注册访问统计(2)1-11
export function appdownListApi (params) {
    return request({
        url: '/statistic/user/down_list',
        method: 'get',
        params
    })
}
//获取渠道名称
export function chanelNAmeListApi (params) {
    return request({
        url: '/setting/group_data',
        method: 'get',
        params
    })
}
// 渠道访问统计---1-11点击查看
export function appdownChannelApi (params) {
    return request({
        url: '/user/user',
        method: 'get',
        params
    })
}
// 视频数据列表
export function videoDataApi (params) {
    return request({
        url: '/vedio/vedio/user_list',
        method: 'get',
        params
    })
}
//视频回收站删除
export function videoRecycleDelApi (params) {
    return request({
        url: '/vedio/vedio/del_resource',
        method: 'POST',
        params
    })
}
//充值率(2)1-12
export function payListApi (params) {
    return request({
        url: '/statistic/user/pay_list',
        method: 'get',
        params
    })
}
//留存率(2)1-12
export function userRateListApi (params) {
    return request({
        url: '/statistic/user/keep_list',
        method: 'get',
        params
    })
}
///活跃用户数1-12---日

export function userActiveDateApi (params) {
    return request({
        url: '/statistic/user/active_date_list',
        method: 'get',
        params
    })
}
///活跃用户数1-12---月

export function userActiveMonthApi (params) {
    return request({
        url: '/statistic/user/active_month_list',
        method: 'get',
        params
    })
}
///活跃用户数1-12---周

export function userActiveWeekApi (params) {
    return request({
        url: '/statistic/user/active_week_list',
        method: 'get',
        params
    })
}
///手动统计1-13

export function hanfSelfTotalApi (params) {
    return request({
        url: '/statistic/user/stats',
        method: 'post',
        params
    })
}

