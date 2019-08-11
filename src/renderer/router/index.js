import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app-page',
      component: require('@/components/AppPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
