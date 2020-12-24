/* global Vue, VueRouter */
import App from './components/App.js'
import './vuecustoms.js'
import Store from './store.js'

import Login from './components/pages/auth/login.js'

import Dashboard from './components/pages/dashboard.js'
import MapList from './components/pages/gis/maplist.js'

import ParoCallsList from './components/pages/paro/call/list.js'
import ParoProjectList from './components/pages/paro/proj/list.js'
import ParoProjectDetail from './components/pages/paro/proj/detail.js'
import AnketyList from './components/pages/ankety/list.js'
import WaterManList from './components/pages/water-man/list.js'
import TaskmanList from './taskman/src/components/list.js'
import GroupsList from './apps/groupman/src/components/list.js'
import UsersList from './apps/userman/src/components/list.js'
import ProjectList from './apps/project-stack/src/components/list.js'

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/maps', component: MapList, name: 'maplist' },
    { path: '/', component: Dashboard, name: 'home' },
    { path: '/paro', component: ParoCallsList, name: 'paro_calllist' },
    { path: '/paro/:id', component: ParoProjectList, name: 'paro_projlist' },
    { path: '/paro/project/:id', component: ParoProjectDetail, name: 'paro_projdetail' },
    { path: '/ankety', component: AnketyList, name: 'ankety_list' },
    { path: '/waterman', component: WaterManList, name: 'wm_list' },
    { path: '/taskman', component: TaskmanList, name: 'tm_list' },
    { path: '/groupman', component: GroupsList, name: 'grpman_list' },
    { path: '/userman', component: UsersList, name: 'usrman_list' },
    { path: '/projects', component: ProjectList, name: 'project_list' }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
