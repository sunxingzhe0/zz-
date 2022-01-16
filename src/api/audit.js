import request from '@/libs/request'

/**
 * @description 审核--列表
 * @param {Object} param params {Object} 传值参数
 */
//获取审核拒绝理由
export function auditRefusesApi (params) {
    return request({
        url: '/setting/group_data',
        method: 'get',
        params
    })
}
// //获取视频审核列表
// export function videoAuditListApi (params) {
//     return request({
//         url: '/examine/video/index',
//         method: 'get',
//         params
//     })
// }
//获取视频审核列表新的----------20211209
export function videoAuditListApi (params) {
    return request({
        url: '/vedio/vedio/user_list',
        method: 'get',
        params
    })
}
//获取视频审核状态修改
// export function videoAuditStatusApi (params) {
//     return request({
//         url: '/examine/video/adopt',
//         method: 'get',
//         params
//     })
// }
//获取视频审核状态修改新的----20211209
export function videoAuditStatusApi (params) {
    return request({
        url: '/examine/video/reasons',
        method: 'post',
        params
    })
}
//获取视频拒绝理由提交

export function videoAuditReasonApi (data) {
    return request({
        url: '/examine/video/reasons',
        method: 'post',
        data
    })
}
//获取评论审核列表
export function commentAuditListApi (params) {
    return request({
        url: '/examine/comment/index',
        method: 'get',
        params
    })
}
//获取评论审核通过
export function conmentAuditStatusApi (params) {
    return request({
        url: '/examine/comment/adopt',
        method: 'get',
        params
    })
}
//获取评论审核不通过
export function conmentRefuseStatusApi(params) {
    return request({
        url: '/examine/comment/refuse',
        method: 'post',
        params
    })
}
//获取提现审核列表
export function withdrawalListApi (params) {
    return request({
        url: '/examine/withdrawal/index',
        method: 'get',
        params
    })
}
// /examine/withdrawal/pay_method
//获取提现审核---支付方式
export function patTypeListApi (params) {
    return request({
        url: '/examine/withdrawal/pay_method',
        method: 'get',
        params
    })
}
///examine/withdrawal/pay/:id
//获取提现审核---支付账号
export function patTypeApi (params) {
    return request({
        url: '/examine/withdrawal/pay',
        method: 'get',
        params
    })
}
//获取提现审核---通过
export function passAuditApi (params) {
    return request({
        url: '/examine/withdrawal/adopt',
        method: 'post',
        params
    })
}
//获取提现审核---拒绝
export function refuseAuditApi (params) {
    return request({
        url: '/examine/withdrawal/refuse',
        method: 'post',
        params
    })
}
//获取举报视频列表
export function reportVideoApi (params) {
    return request({
        url: '/vedio/vedio/user_list',
        method: 'get',
        params
    })
}
//获取举报记录
export function reportVideoDetailApi (params) {
    return request({
        url: '/vedio/vedio/report_list',
        method: 'get',
        params
    })
}
//获取禁用理由
export function bannedResonApi (params) {
    return request({
        url: '/setting/group_data',
        method: 'get',
        params
    })
}
//获取封禁处理
export function bannedActionApi (params) {
    return request({
        url: '/vedio/vedio/report_handling',
        method: 'post',
        params
    })
}
// 12----30合集审核
export function combineAuditApi (data) {
    return request({
        url: '/vedio/total/audit',
        method: 'post',
        data
    })
}

// 合集审核理由
export function AuditConfigApi (params) {
    return request({
        url: '/setting/group_data',
        method: 'get',
        params
    })
}
// 合集审核删除
export function delConfigApi (data) {
    return request({
        url: '/vedio/total/del',
        method: 'post',
        data
    })
}