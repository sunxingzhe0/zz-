import BasicLayout from '@/components/main'

const pre = 'dataStatics_'

export default {
  path: '/admin/dataStatics',
  name: 'dataStatics',
  header: 'dataStatics',
  meta: {
    title: '数据统计',
    // 授权标识
    auth: ['admin-dataStatics']
  },
  redirect: {
    name: `${pre}activeNum`
  },
  component: BasicLayout,
  children: [
    {
      path: 'activeNum',
      name: `${pre}activeNum`,
      meta: {
        title: '活跃用户数',
        auth: ['admin-dataStatics-activeNum']
      },
      component: () => import('@/pages/dataStatics/activeNum')
    },
    {
      path: 'payRate',
      name: `${pre}payRate`,
      meta: {
        title: '付费率与充值率',
        auth: ['admin-dataStatics-payRate']
      },
      component: () => import('@/pages/dataStatics/payRate')
    },
    {
      path: 'userRate',
      name: `${pre}userRate`,
      meta: {
        title: '用户留存率',
        auth: ['admin-dataStatics-userRate']
      },
      component: () => import('@/pages/dataStatics/userRate')
    },
    {
      path: 'downloadNum',
      name: `${pre}downloadNum`,
      meta: {
        title: '下载量和注册量',
        auth: ['admin-dataStatics-downloadNum']
      },
      component: () => import('@/pages/dataStatics/downloadNum')
    },
    {
      path: 'videoData',
      name: `${pre}videoData`,
      meta: {
        title: '视频数据',
        auth: ['admin-dataStatics-videoData']
      },
      component: () => import('@/pages/dataStatics/videoData')
    },
    {
      path: 'combineData',
      name: `${pre}combineData`,
      meta: {
        title: '合集数据',
        auth: ['admin-dataStatics-combineData']
      },
      component: () => import('@/pages/dataStatics/combineData')
    },
    
  ]
}
