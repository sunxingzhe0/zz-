import request from '@/libs/request'
/**
 * @description 首页头部
 */
export function headerApi () {
    return request({
        url: 'home/header',
        method: 'get'
    })
}

/**
 * @description 首页订单图表
 */
export function orderApi (params) {
    return request({
        url: 'home/order',
        method: 'get',
        params
    })
}

/**
 * @description 首页订单图表
 */
export function userApi () {
    return request({
        url: 'home/user',
        method: 'get'
    })
}

/**
 * @description 首页商品交易额排行
 */
export function rankApi () {
    return request({
        url: 'home/rank',
        method: 'get'
    })
}

export function checkAuth () {
    return request({
        url: 'check_auth',
        method: 'get'
    })
}
//获取短视频首页接口数据

export function userCountApi () {
    return request({
        url: '/home/user_count',
        method: 'get'
    })
}
//获取视频统计接口数据

export function userVideoApi (data) {
    return request({
        url: '/home/vedio_count',
        method: 'get',
        params:data
    })
}

//获取用户留存统计接口数据

export function userRetentionApi (data) {
    return request({
        url: '/home/user_retention',
        method: 'get',
        params:data
    })
}
//获取用户留存率 自定义日期统计接口数据

export function userRetentDateApi (data) {
    return request({
        url: '/home/user_retention_date',
        method: 'get',
        params:data
    })
}


//获取用户财务统计接口数据

export function userFinanceApi (data) {
    return request({
        url: '/home/finance_statics',
        method: 'get',
        params:data
    })
}