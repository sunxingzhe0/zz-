import BasicLayout from '@/components/main'

const pre = 'recycle_'

export default {
  path: '/admin/recycle',
  name: 'recycle',
  header: 'recycle',
  meta: {
    title: '视频回收站',
    // 授权标识
    auth: ['admin-recycle']
  },
  redirect: {
    name: `${pre}videoRecycle`
  },
  component: BasicLayout,
  children: [
    {
      path: 'videoRecycle',
      name: `${pre}videoRecycle`,
      meta: {
        title: '视频回收站',
        auth: ['admin-recycle-videoRecycle']
      },
      component: () => import('@/pages/recycle/videoRecycle')
    },
 
    
  ]
}
