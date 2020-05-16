/* global axios, API, marked, prompt */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null,
      support: null,
      feedbacks: null
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
      const UID = this.$store.getters.UID
      res = await axios.get(`${API}/paro/feedback/${projID}?author=${UID}`)
      this.$data.feedbacks = res.data
      this.$data.loading = false
    },
    addFeedback: async function () {
      const { call, project, feedbacks } = this.$data
      const message = prompt('zpráva')
      if (message) {
        const url = `${API}/paro/feedback/${call.id}/${project.id}`
        try {
          const res = await axios.post(url, { message })
          feedbacks.push(res.data)
        } catch (err) {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
        }
      }
    },
    resolveFeedback: async function (feedback) {
      const { call } = this.$data
      const url = `${API}/paro/feedback/${call.id}/${feedback.id}`
      try {
        await axios.put(url, { status: 'resolved' })
        feedback.status = 'resolved'
      } catch (err) {
        this.$store.dispatch('toast', { message: err, type: 'error' })
      }
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

      </div>

      <div class="col-sm-12 col-md-6">
        <p>Status: {{project.state}}</p>
        <p>{{project.desc}}</p>
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

        <h2>Mé posudky</h2>
        <b-button v-if="call.status=='verif'" @click="addFeedback">Přidat</b-button>
        <p v-else>Nejdou přidávat, fáze ověřování proveditelnosti:
          {{ call.submission_end | formatDate }} - {{ call.thinking_start | formatDate }}</p>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Zpráva</th>
              <th scope="col">Stav</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in feedbacks">
              <td>{{ i.message }}</td>
              <td>{{ i.status }}
                <b-button v-if="i.status=='unresolved'" @click="resolveFeedback(i)">
                  Vyřešeno
                </b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
}
