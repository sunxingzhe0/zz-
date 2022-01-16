import request from '@/libs/request'

/**
 * @description 表格--删除
 * @param {Number} param id {Number} 配置id
 */


//获取合集--------列表
 export function collectionTotalApi (params) {
    return request({
        url: '/vedio/total/list',
        method: 'get',
        params
    })
}
//创建合集--------添加、修改
export function creatCollecApi (data) {
    return request({
        url: '/vedio/total/edit',
        method: 'post',
        data
    })
}
//创建合集--------删除
export function delCollecApi (data) {
    return request({
        url: '/vedio/total/del',
        method: 'post',
        data
    })
}
//合集--------排序
export function sortCollecApi (data) {
    return request({
        url: '/vedio/total/sort',
        method: 'post',
        data
    })
}
///合集视频列表
export function collectionVideoApi (params) {
    return request({
        url: '/vedio/total/total_vedio_list',
        method: 'get',
        params
    })
}
// 不在合集里的视频
// export function collectionOtherVideoApi (params) {
//     return request({
//         url: '/vedio/total/other_vedio_list',
//         method: 'get',
//         params
//     })
// }
//合集视频排序
export function detailSortApi (data) {
    return request({
        url: '/vedio/total/edit',
        method: 'post',
        data
    })
}
//合集中移除视频

export function detailVideoDeltApi (data) {
    return request({
        url: '/vedio/total/total_vedio_remove',
        method: 'post',
        data
    })
}
// 合集添加作品---合集添加视频
export function addWorksApi (data) {
    return request({
        url: '/vedio/total/total_vedio_add',
        method: 'post',
        data
    })
}
// 合集添加作品---合集删除视频
export function delWorksApi (data) {
    return request({
        url: '/vedio/total/total_vedio_remove',
        method: 'post',
        data
    })
}
//获取评论审核列表
// export function commentAuditListApi (params) {
//     return request({
//         url: '/examine/comment/index',
//         method: 'get',
//         params
//     })
// }
