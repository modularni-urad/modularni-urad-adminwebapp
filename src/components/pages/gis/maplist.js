/* global axios, API */
import MapForm from './mapform.js'

export default {
  data: () => {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'název', sortable: true },
        { key: 'writers', label: 'zapisovatelé', sortable: false },
        { key: 'owner', label: 'vlastník', sortable: true },
        { key: 'actions', label: 'Akce' }
      ],
      items: [],
      isBusy: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      curr: null,
      item: {}
    }
  },
  methods: {
    myProvider (ctx) {
      // Here we don't set isBusy prop, so busy state will be
      // handled by table itself
      this.isBusy = true
      const promise = axios.get(`${API}/gis/layers?currentPage=${this.currentPage}`)

      return promise.then(res => {
        this.isBusy = false
        this.totalRows = res.data.pagination.total
        return res.data.data
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
      <h3 class="float-left">Mapy</h3>
      <div class="float-right">
        <b-button variant="primary" @click="add">+ Přidat</b-button>
      </div>
      <b-table small striped hover sort-icon-left no-local-sorting
        id="maps-table"
        primary-key="id"
        :current-page="currentPage"
        :per-page="perPage"
        :busy.sync="isBusy"
        :items="myProvider"
        :fields="fields"
      >
        <template v-slot:cell(title)="data">
          <a href="javascript:void(0)" v-on:click="edit(data.item)">
            {{data.item.title}}
          </a>
        </template>
        <template v-slot:cell(actions)="data">
          <a v-bind:href="'/import/?layerid=' + data.item.id" target="_blank">
            importer
          </a>,
          <a v-bind:href="'/edit/?layerid=' + data.item.id" target="_blank">
            editor
          </a>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="maps-table"
      ></b-pagination>

      <b-modal id="modal-add" title="Upravit mapu" hide-footer>
        <map-form v-bind:onSubmit="onItemSubmit" v-bind:item="curr"></map-form>
      </b-modal>
    </div>
  </div>
  `
}
