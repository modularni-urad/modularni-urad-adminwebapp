/* global Vue, Vuex, localStorage, API, axios */

const KEY = '_opencomm_user_'
const savedUser = localStorage.getItem(KEY)

export default function (router) {
  return new Vuex.Store({
    state: {
      user: savedUser && JSON.parse(savedUser)
    },
    getters: {
      userLogged: state => {
        return state.user !== null
      }
    },
    mutations: {
      logout: state => {
        state.user = null
      },
      profile: (state, profile) => {
        localStorage.setItem(KEY, JSON.stringify(profile))
        state.user = profile
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts)
      },
      login: function (ctx, opts) {
        return axios.post(`${API}/privateauth/login`, opts, {
          withCredentials: false
        }).then(res => {
          this.commit('profile', res.data)
          return res.data
        })
      },
      logout: async function (ctx, opts) {
        await axios.post(`${API}/privateauth/logout`)
        localStorage.removeItem(KEY)
        router.push('/')
      },
      init: async function (ctx, opts) {
        try {
          const res = await axios.get(`${API}/profile`)
          this.commit('profile', res.data.user)
        } catch (_) {}
      }
    }
  })
}
