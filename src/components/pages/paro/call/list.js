/* global axios, API, moment */
import MapForm from './form.js'

export default {
  data: () => {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'název', sortable: true },
        { key: 'submission_start', label: 'začátek podávání', sortable: true },
        { key: 'submission_end', label: 'konec podávání', sortable: true },
        { key: 'thinking_start', label: 'konec ověřování', sortable: true },
        { key: 'voting_start', label: 'začátek hlasování', sortable: true },
        { key: 'voting_end', label: 'konec hlasování', sortable: true },
        { key: 'minimum_support', label: 'min.podpora', sortable: true },
        { key: 'allocation', label: 'alokace', sortable: true }
      ],
      items: [],
      isBusy: false,
      curr: null,
      item: {}
    }
  },
  methods: {
    myProvider (ctx) {
      // Here we don't set isBusy prop, so busy state will be
      // handled by table itself
      this.isBusy = true
      const promise = axios.get(`${API}/paro/call`)

      return promise.then(res => {
        this.isBusy = false
        return res.data.map(i => {
          i.submission_start = moment(i.submission_start)
          i.submission_end = moment(i.submission_end)
          i.thinking_start = moment(i.thinking_start)
          i.voting_start = moment(i.voting_start)
          i.voting_end = moment(i.voting_end)
          return i
        })
      }).catch(err => {
        console.log(err)
        this.isBusy = false
        return []
      })
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
  components: {
    'map-form': MapForm
  },
  template: `
  <div>
    <div>
      <b-breadcrumb class="float-left">
        <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
        <b-breadcrumb-item active>Participativní rozpočet</b-breadcrumb-item>
      </b-breadcrumb>

      <div v-if="$store.getters.isMember('paroadmin')" class="float-right">
        <b-button variant="primary" @click="add">+ Přidat</b-button>
      </div>
      <b-table small striped hover sort-icon-left no-local-sorting
        id="maps-table"
        primary-key="id"
        :busy.sync="isBusy"
        :items="myProvider"
        :fields="fields"
      >
        <template v-slot:cell(name)="data">
          <router-link :to="{name: 'paro_projlist', params: {id: data.item.id}}">
            {{ data.item.name }}
          </router-link>
        </template>
        <template v-slot:cell(submission_start)="data">
          {{ data.item.submission_start | formatDate }}
        </template>
        <template v-slot:cell(submission_end)="data">
          {{ data.item.submission_end | formatDate }}
        </template>
        <template v-slot:cell(thinking_start)="data">
          {{ data.item.thinking_start | formatDate }}
        </template>
        <template v-slot:cell(voting_start)="data">
          {{ data.item.voting_start | formatDate }}
        </template>
        <template v-slot:cell(voting_end)="data">
          {{ data.item.voting_end | formatDate }}
        </template>
      </b-table>

      <b-modal id="modal-add" size="xl" title="Upravit výzvu" hide-footer>
        <map-form v-bind:onSubmit="onItemSubmit" v-bind:item="curr"></map-form>
      </b-modal>
    </div>
  </div>
  `
}
