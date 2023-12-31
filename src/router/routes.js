
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/List.vue') },
      { path: '/chat/:otherUserId', component: () => import('pages/Chat.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
