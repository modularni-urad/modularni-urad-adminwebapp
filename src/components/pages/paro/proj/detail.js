/* global axios, API, marked */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null,
      support: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const projID = this.$router.currentRoute.params.id
      let res = await axios.get(`${API}/paro/project/?id=${projID}`)
      const p = res.data.length ? res.data[0] : null
      this.$data.project = p
      res = await axios.get(`${API}/paro/call/?id=${p.call_id}`)
      this.$data.call = res.data[0]
      this.$data.loading = false
    }
  },
  computed: {
    budgetJSON: function () {
      return JSON.parse(this.project.budget)
    },
    contentHTML: function () {
      return marked(this.project.content)
    }
  },
  template: `
  <div v-if="!loading">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <i class="fas fa-home"></i>
      </b-breadcrumb-item>
      <b-breadcrumb-item :to="{name: 'paro_calllist'}">
        Participativní rozpočet
      </b-breadcrumb-item>
      <b-breadcrumb-item :to="{name: 'paro_projlist', params: {id: call.id}}">
        {{ call.name }} projekty
      </b-breadcrumb-item>
      <b-breadcrumb-item active>{{ project.name }} detail</b-breadcrumb-item>
    </b-breadcrumb>

    <div class="row">
      <div class="col-sm-12 col-md-6">

        <img v-if="project.photo" :src="project.photo" class="card-img-top" alt="ilustrační foto">

        <h5>{{project.desc}}</h5>
      </div>

      <div class="col-sm-12 col-md-6">
        <h3>Rozpočet</h3>
        <p>Celkem: {{project.total}}</p>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Počet</th>
              <th scope="col">Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in budgetJSON">
              <td>{{ i.name }} <a v-if="i.link" v-bind:href="i.link" target="_blank">(odkaz)</a></td>
              <td>{{ i.count }}</td>
              <td>{{ i.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <p v-html="contentHTML"></p>
      </div>
    </div>
  </div>
  `
}
