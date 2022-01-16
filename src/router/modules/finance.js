import BasicLayout from '@/components/main'

const pre = 'finance_'
export default {
  path: '/admin/finance',
  name: 'finance',
  header: 'finance',
  meta: {
    // 授权标识
    auth: ['admin-finance']
  },
  redirect: {
    name: `${pre}cashApply`
  },
  component: BasicLayout,
  children: [
    {
      path: 'user_extract/index',
      name: `${pre}cashApply`,
      meta: {
        auth: ['finance-user_extract'],
        title: '提现申请'
      },
      component: () => import('@/pages/finance/userExtract/index')
    },
    {
      path: 'payVideo',
      name: `${pre}payVideo`,
      meta: {
        auth: ['finance-user_extract'],
        title: '付费视频明细'
      },
      component: () => import('@/pages/finance/payVideo/index')
    },
    {
      path: 'payVideo-total',
      name: `${pre}payVideoTotal`,
      meta: {
        auth: ['finance-user_total'],
        title: '付费视频统计'
      },
      component: () => import('@/pages/finance/payVideoTotal/index')
    },
    {
      path: 'detail',
      name: `${pre}detail`,
      meta: {
        auth: ['finance-user_extract'],
        title: '提现明细'
      },
      component: () => import('@/pages/finance/detail/index')
    },
    {
      path: 'payRecord',
      name: `${pre}payRecord`,
      meta: {
        auth: ['finance-user_extract'],
        title: '付费记录'
      },
      component: () => import('@/pages/finance/payRecord/index')
    },
    {
      path: 'recharge',
      name: `${pre}recharge`,
      meta: {
        auth: ['finance-user_extract'],
        title: '充值记录'
      },
      component: () => import('@/pages/finance/recharge/index')
    },
    {
      path: 'user_recharge/index',
      name: `${pre}recharge`,
      meta: {
        auth: ['finance-user-recharge'],
        title: '充值记录'
      },
      component: () => import('@/pages/finance/financialRecords/recharge')
    },
    {
      path: 'vipRecharge',
      name: `${pre}vipRecharge`,
      meta: {
        auth: ['finance-vup_user'],
        title: '会员充值记录'
      },
      component: () => import('@/pages/finance/vipRecharge/index')
    },
    
    {
      path: 'finance/bill',
      name: `${pre}bill`,
      meta: {
        auth: ['finance-finance-bill'],
        title: '资金记录'
      },
      component: () => import('@/pages/finance/financialRecords/bill')
    },
    {
      path: 'finance/commission',
      name: `${pre}commissionRecord`,
      meta: {
        auth: ['finance-finance-commission'],
        title: '佣金记录'
      },
      component: () => import('@/pages/finance/commission/index')
    }
  ]
}
