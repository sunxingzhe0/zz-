import request from '@/libs/request'

/**
 * @description 资金监控 -- 筛选类型
 */
export function billTypeApi () {
    return request({
        url: 'finance/finance/bill_type',
        method: 'get'
    })
};

/**
 * @description 资金监控 -- 列表
 * @param {Object} param data {Object} 传值
 */
export function billListApi (data) {
    return request({
        url: 'finance/finance/list',
        method: 'get',
        params: data
    })
};

/**
 * @description 佣金记录 -- 列表
 * @param {Object} param data {Object} 传值
 */
export function commissionListApi (data) {
    return request({
        url: 'finance/finance/commission_list',
        method: 'get',
        params: data
    })
};

/**
 * @description 佣金记录 -- 详情
 * @param {Number} param id {Number} 佣金记录ID
 */
export function commissionDetailApi (id) {
    return request({
        url: `finance/finance/user_info/${id}`,
        method: 'get'
    })
};

/**
 * @description 佣金记录 -- 个人提现列表
 * @param {Number} param id {Number} 佣金记录 用户ID
 */
export function extractlistApi (id, data) {
    return request({
        url: `finance/finance/extract_list/${id}`,
        method: 'get',
        params: data
    })
};

/**
 * @description 提现申请 -- 列表
 * @param {Object} param data {Object} 提现申请传值
 */
export function cashListApi (data) {
    return request({
        url: `finance/extract`,
        method: 'get',
        params: data
    })
};

/**
 * @description 提现申请 -- 编辑表单
 * @param {Number} param id {Number} 提现申请id
 */
export function cashEditApi (id) {
    return request({
        url: `finance/extract/${id}/edit`,
        method: 'get'
    })
};

/**
 * @description 提现申请 -- 拒绝申请
 * @param {Number} param id {Number} 提现申请id
 */
export function refuseApi (id, data) {
    return request({
        url: `finance/extract/refuse/${id}`,
        method: 'put',
        data
    })
};

/**
 * @description 提现申请 -- 通过申请
 * @param {Number} param id {Number} 提现申请id
 */
export function adoptApi (id, data) {
    return request({
        url: `finance/extract/adopt/${id}`,
        method: 'put',
        data
    })
};
/**
 * @description 付费视频 -- 列表
 */
 export function payListApi (data) {
    return request({
        url: '/finance/video/list',
        method: 'get',
        params: data
    })
};
/**
 * @description 付费视频 -- 详情
 */
 export function payListDetailApi (data) {
    return request({
        url: '/finance/video/pay_list',
        method: 'get',
        params: data
    })
};
/**
 * @description 付费记录 -- 列表
 * @param {Object} param data {Object} 充值记录传值
 */
 export function payRecordlistApi (data) {
    return request({
        url: '/finance/money/list',
        method: 'get',
        params: data
    })
};
/**
 * @description 付费记录 -- 查看
 * @param {Object} param data {Object} 充值记录传值
 */
 export function payRecordDetailApi (data) {
    return request({
        url: '/finance/money/detail',
        method: 'get',
        params: data
    })
};
/**
 * @description 付费记录 -- 退款
 * @param {Object} param data {Object} 充值记录传值
 */
 export function payRecordReturnApi (data) {
    return request({
        url: '/finance/money/set_val',
        method: 'post',
        data
    })
};
// 充值记录---列表now
export function rechargeRecordlApi (data) {
    return request({
        url: '/finance/money/withdrawal',
        method: 'get',
        params: data
    })
};
// 充值记录---列表now22222  2022-1-15
export function rechargeRecordNewApi(data) {
    return request({
        url: '/finance/money/recharge_list',
        method: 'get',
        params: data
    })
};

/**
 * @description 充值记录 -- 列表
 * @param {Object} param data {Object} 充值记录传值
 */
export function rechargelistApi (data) {
    return request({
        url: `finance/recharge`,
        method: 'get',
        params: data
    })
};

/**
 * @description 充值记录 -- 用户充值数据
 * @param {Object} param data {Object} 用户充值数据传值
 */
export function userRechargeApi (data) {
    return request({
        url: `finance/recharge/user_recharge`,
        method: 'get',
        params: data
    })
};

/**
 * @description 充值记录 -- 退款表单
 * @param {Number} param data {Number} 充值记录id
 */
export function refundEditApi (id) {
    return request({
        url: `finance/recharge/${id}/refund_edit`,
        method: 'get'
    })
};

// 会员充值列表
export function rechargeViplistApi (data) {
    return request({
        url: 'finance/vip_history/list',
        method: 'get',
        params: data
    })
};
/**
 * @description 财务记录 -- 用户资金导出
 * @param {Number} param data {Number} 请求参数data
 */
export function userFinanceApi (data) {
    return request({
        url: `export/userFinance`,
        method: 'get',
        params: data
    })
};

/**
 * @description 佣金记录 -- 用户佣金导出
 * @param {Number} param data {Number} 请求参数data
 */
export function userCommissionApi (data) {
    return request({
        url: `export/userCommission`,
        method: 'get',
        params: data
    })
}

/**
 * @description 用户充值记录 -- 用户充值记录导出
 * @param {Number} param data {Number} 请求参数data
 */
export function exportUserRechargeApi (data) {
    return request({
        url: `export/userRecharge`,
        method: 'get',
        params: data
    })
}
// 付费视频统计
export function payVideoCountApi (data) {
    return request({
        url: 'statistic/user/keep_list',
        method: 'get',
        params: data
    })
}
