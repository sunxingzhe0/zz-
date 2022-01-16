import request from '@/libs/request'

/**
 * @description 表格--删除
 * @param {Number} param id {Number} 配置id
 */


//获取公告--------列表
 export function billboardLIsApi (params) {
    return request({
        url: '/setting/billboard/list',
        method: 'get',
        params
    })
}
//获取公告--------添加编辑
export function billboardAddApi (data) {
    return request({
        url: '/setting/billboard/edit',
        method: 'post',
        data
    })
}
//获取公告--------删除
export function billboardDelApi (data) {
    return request({
        url: '/setting/billboard/del',
        method: 'post',
        data
    })
}

