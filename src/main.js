/* global Vue, VueRouter */
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'

import Dashboard from './components/pages/dashboard.js'
import MapList from './components/pages/gis/maplist.js'

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/maps', component: MapList, name: 'maplist' },
    { path: '/', component: Dashboard, name: 'home' }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
