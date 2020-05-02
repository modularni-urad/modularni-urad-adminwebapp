/* global axios, API, alert */
import Detail from './detail.js'

export default {
  data: () => {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'název', sortable: true },
        { key: 'author', label: 'autor' },
        { key: 'total', label: 'rozpočet', sortable: true }
      ],
      items: [],
      isBusy: false,
      curr: null,
      call: null,
      item: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    myProvider (ctx) {
      // Here we don't set isBusy prop, so busy state will be
      // handled by table itself
      this.isBusy = true
      const callID = this.$router.currentRoute.params.id

      return axios.get(`${API}/paro/project?call_id=${callID}`).then(res => {
        this.isBusy = false
        return res.data
      }).catch(err => {
        console.log(err)
        this.isBusy = false
        return []
      })
    },
    fetchData: async function () {
      const callID = this.$router.currentRoute.params.id
      const res = await axios.get(`${API}/paro/call?id=${callID}`)
      if (res.data.length === 0) alert('Výzva neexistuje')
      else this.$data.call = res.data[0]
    },
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    edit: function (item) {
      this.$data.curr = item
      this.$bvModal.show('modal-add')
    },
    onItemSubmit: function (item) {
      if (this.curr) {
        Object.assign(this.curr, item)
      }
    }
  },
  computed: {
    callName: function () {
      return this.$data.call ? this.$data.call.name : ''
    }
  },
  components: {
    'project-detail': Detail
  },
  template: `
  <div>
    <div>
      <b-breadcrumb class="float-left">
        <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
        <b-breadcrumb-item :to="{name: 'paro_calllist'}">Participativní rozpočet</b-breadcrumb-item>
        <b-breadcrumb-item active>{{ callName }} projekty</b-breadcrumb-item>
      </b-breadcrumb>

      <b-table small striped hover sort-icon-left no-local-sorting
        id="maps-table"
        primary-key="id"
        :busy.sync="isBusy"
        :items="myProvider"
        :fields="fields"
      >
        <template v-slot:cell(name)="data">
          <router-link :to="{name: 'paro_projdetail', params: {id: data.item.id}}">
            {{ data.item.name }}
          </router-link>
        </template>
      </b-table>

      <b-modal id="modal-add" size="xl" title="Detail projektu" hide-footer>
        <project-detail v-bind:onSubmit="onItemSubmit" v-bind:item="curr">
        </project-detail>
      </b-modal>
    </div>
  </div>
  `
}
