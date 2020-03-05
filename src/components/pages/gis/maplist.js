/* global axios, API, _, moment */
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
      totalRows: 30,
      perPage: 3
    }
  },
  methods: {
    myProvider (ctx) {
      // Here we don't set isBusy prop, so busy state will be
      // handled by table itself
      this.isBusy = true
      const promise = axios.get(`${API}/layers`)

      return promise.then(res => {
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false
        return res.data
      }).catch(error => {
        return []
      })
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
        <b-button variant="primary" v-b-modal.modal-add>+ Přidat</b-button>
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
        <template v-slot:cell(actions)="data">
          <a v-bind:href="'/import/?layerid=' + data.item.id" target="_blank">
            import
          </a>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="maps-table"
      ></b-pagination>

      <b-modal id="modal-add" title="Přidat mapu" hide-footer>
        <map-form></map-form>
      </b-modal>
    </div>
  </div>
  `
}
