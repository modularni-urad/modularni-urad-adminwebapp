/* global Vue, Vuex, localStorage, API, axios, _ */

const KEY = '_opencomm_user_'
const savedUser = localStorage.getItem(KEY)
const loadedUsers = {}

Vue.filter('username', function (uid) {
  return loadedUsers[uid] || 'unknown'
})

export default function (router) {
  //
  const store = new Vuex.Store({
    state: {
      user: savedUser && JSON.parse(savedUser)
    },
    getters: {
      userLogged: state => {
        return state.user !== null
      },
      UID: state => (state.user.id),
      isMember: state => group => {
        try {
          return state.user.groups.indexOf(group) >= 0
        } catch (_) {
          return false
        }
      }
    },
    mutations: {
      profile: (state, profile) => {
        localStorage.setItem(KEY, JSON.stringify(profile))
        state.user = profile
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts)
      },
      login: async function (ctx, opts) {
        try {
          const reqOpts = { withCredentials: false }
          const u = await axios.post(`${API}/public/user/login`, opts, reqOpts)
          const user = u.data
          const g = await axios.get(`${API}/groupman/mship/${user.id}/groups`)
          user.groups = g.data
          this.commit('profile', user)
          return user
        } catch (e) {
          const message = e.response.data
          this.dispatch('toast', { message, type: 'error' })
        }
      },
      logout: async function (ctx, opts) {
        try {
          await axios.post(`${API}/public/user/logout`)
          localStorage.removeItem(KEY)
          this.commit('profile', null)
          router.push('/')
        } catch (e) {
          const message = e.response.data
          this.dispatch('toast', { message, type: 'error' })
        }
      },
      init: async function (ctx, opts) {
        try {
          const res = await axios.get(`${API}/profile`)
          this.commit('profile', res.data.user)
        } catch (_) {}
      },
      handleError: function (ctx, opts) {
      },
      loadusers: function (ctx, opts) {
        const toBeLoaded = _.filter(opts, i => !(i in loadedUsers))
        if (toBeLoaded.length === 0) return
        axios.get(`${API}/auth/uinfo/${toBeLoaded.join(',')}`)
          .then(res => {
            res.data.map(i => {
              loadedUsers[i.id] = i.username
            })
          })
          .catch(__ => {
            console.log(`loaded: ${JSON.stringify(toBeLoaded)}`)
            _.each(toBeLoaded, uid => {
              loadedUsers[uid] = 'uživatel ' + uid
            })
          })
      }
    }
  })

  axios.interceptors.response.use(
    function (response) { return response },
    function (error) {
      switch (error.response.status) {
        case 401:
          store.dispatch('logout')
          return store.dispatch('toast', {
            message: 'Přihlášení vypršelo',
            type: 'success'
          })
        default:
          throw error
      }
    })

  return store
}
