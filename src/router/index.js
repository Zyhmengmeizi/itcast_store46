import Vue from 'vue';
import Router from 'vue-router';
// 导入组件
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';
import Rights from '@/views/roles/rights';
Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      //子路由，将来子路由的切换是在home组件中完成的
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
});
