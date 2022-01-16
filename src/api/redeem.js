import request from '@/libs/request'

/**
 * @description 兑换卡列表
 * @param {Object} param params {Object} 传值参数
 */
export function reedeemQuery (params) {
    return request({
        url: '/marketing/redeem',
        method: 'get',
        params
    });
}
// export function reedeemQuery () {
//     return request({
//         url: 'marketing/redeem/create',
//         method: 'get',
//     });
// }
//商品名称 规格
export function reedeemQueryShop () {
    return request({
        url: 'marketing/redeem/product_suk',
        method: 'post',
    });
}
// 新增
export function reedeemAddCard (params) {
    return request({
        url: '/marketing/redeem',
        method: 'post',
        params
    });
}
//启用停用
export function reedeemStateEdit(params) {
    return request({
        url: 'marketing/redeem/change_field',
        method: 'post',
        params
    });
}
/**
 * @description 充值卡列表
 * @param {Object} param params {Object} 传值参数
 */
// 充值记录列表
export function rechargeList(params) {
    return request({
        url: 'finance/recharge',
        method: 'get',
        params
    });
}

/**
 * @description 批次列表接口
 * @param {Object} param params {Object} 传值参数
 */
// 批次列表接口
export function getBatchList(params) {
    return request({
        url: 'marketing/redeem/check',
        method: 'get',
        params
    });
}

