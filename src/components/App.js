/* global Vue, VueToast */

Vue.use(VueToast, {
  // One of options
  position: 'top-right'
})

export default {
  template: `
<div>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <div v-if="$store.getters.userLogged">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Domů</router-link>
          </li>
          <li class="nav-item" v-if="$store.getters.isMember('gisadmin')">
            <router-link class="nav-link" to="/maps">GIS</router-link>
          </li>
          <li class="nav-item" v-if="$store.getters.isMember('parofeedback')">
            <router-link class="nav-link" to="/paro">PaRo</router-link>
          </li>
          <li class="nav-item" v-if="$store.getters.isMember('ankety')">
            <router-link class="nav-link" to="/ankety">Ankety</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/taskman">Úkoly</router-link>
          </li>
        </ul>
      </div>
      <button v-if="$store.getters.userLogged" class="btn btn-warning"
        v-on:click="$store.dispatch('logout')">
        Odhlásit {{$store.state.user.email}}
      </button>
      <router-link v-else class="btn btn-primary" to="/login">
        Přihlásit
      </router-link>
    </div>
  </nav>

  <div class="container-fluid mx-auto p-4">
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</div>
  `
}
