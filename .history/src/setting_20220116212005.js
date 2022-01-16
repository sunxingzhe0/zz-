// 请求接口地址 如果没有配置自动获取当前网址路径
const Url = 'http://121.43.230.79'

const VUE_APP_API_URL = (Url?`${Url}/adminapi`:'') || process.env.VUE_APP_API_URL || `${location.origin}/adminapi`
//第一帧
const VUE_first_API_URL = (Url?`${Url}/api`:'') || process.env.VUE_first_API_URL || `${location.origin}/api`
// 管理端ws
const VUE_APP_WS_ADMIN_URL = process.env.VUE_APP_WS_ADMIN_URL || `ws:${location.hostname}:20002`

// 客服端ws
const VUE_APP_WS_KEFU_URL = process.env.VUE_APP_WS_KEFU_URL || `ws:${location.hostname}:20003`




const Setting = {
    baseURL:Url,
    // 接口请求地址
    apiBaseURL: VUE_APP_API_URL,
    //获取视频第一帧
    apiFirstURL: VUE_first_API_URL,
    // adminsocket连接
    wsAdminSocketUrl: VUE_APP_WS_ADMIN_URL,
    // kefusocket连接
    wsKefuSocketUrl: VUE_APP_WS_KEFU_URL,
    // 路由模式，可选值为 history 或 hash
    routerMode: 'history',
    url:function url(url){
        if(url.substring(0,4)==='http'){return url}
        else{return localStorage.getItem('ossUrl')+url}
       },
    // 页面切换时，是否显示模拟的进度条
    showProgressBar: true,
    getSliceUrl:(prop)=>{
        return prop.split('//')[1].split('/').slice(1).join('/')
    }
  
}


// export function url(url){
//     if(url.substring(0,4)==='http'){return url}
//     else{return Setting.oss_domain+url}
//    }
   
//    export function url2(url){
//     if(url.substring(0,4)==='http'){return oss_domain+url.substring(url.indexOf('/',8));}
//     else{return Setting.oss_domain+url}
//    }
export default Setting