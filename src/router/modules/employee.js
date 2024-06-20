import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: '/employee/detail/:id?',
    component: () => import('@/views/employee/detail.vue'),
    hidden: true,//隐藏在左侧菜单的显示
    meta: {
      title: '员工详情',//显示在导航的文本
    }
  }

  ]
}
