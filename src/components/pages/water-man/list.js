/* global axios, API */
import ItemForm from './form.js'

export default {
  data: () => {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'app_id', label: 'App ID', sortable: true },
        { key: 'dev_id', label: 'Dev ID', sortable: true },
        { key: 'battery', label: 'Baterie', sortable: true },
        { key: 'value', label: 'Stav', sortable: true },
        { key: 'actions', label: 'Akce' }
      ],
      items: [],
      isBusy: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 3,
      curr: null,
      item: {}
    }
  },
  methods: {
    myProvider (ctx) {
      this.isBusy = true
      const promise = axios.get(`${API}/wm/points`, {
        params: {
          currentPage: this.currentPage,
          perPage: this.perPage
        }
      })
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
    },
    saveState: function (item) {
      const r = prompt('Zadej současnou hodnotu na vodoměru')
      if (r) {
        axios.post(`${API}/wm/data/${item.id}`, { value: r })
          .then(res => alert('ok'))
          .catch(err => alert(err))
      }
    }
  },
  components: {
    'item-form': ItemForm
  },
  template: `
  <div>
    <div>
      <b-breadcrumb class="float-left">
        <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
        <b-breadcrumb-item active>Odběrná místa</b-breadcrumb-item>
      </b-breadcrumb>

      <div class="float-right">
        <a href="/gis/edit/" target="_blank">
          <b-button variant="danger"><i class="fas fa-save"></i> Načítat</b-button>
        </a>
        <b-button variant="primary" @click="add">
          <i class="fas fa-plus"></i> Přidat
        </b-button>
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
        <template v-slot:cell(dev_id)="data">
          <a href="javascript:void(0)" v-on:click="edit(data.item)">
            {{data.item.dev_id}}
          </a>
        </template>
        <template v-slot:cell(voting_start)="data">
          {{ data.item.voting_start | formatDate }}
        </template>
        <template v-slot:cell(actions)="data">
          <b-button size="sm" variant="danger" v-on:click="saveState(data.item)">
            <i class="fas fa-save"></i> uložit stav
          </b-button>
          <b-button size="sm" variant="primary" v-on:click="edit(data.item)">
            <i class="fas fa-edit"></i> upravit
          </b-button>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="maps-table"
      ></b-pagination>

      <b-modal size="xl" id="modal-add" title="Upravit" hide-footer>
        <item-form v-bind:onSubmit="onItemSubmit" v-bind:item="curr"></item-form>
      </b-modal>
    </div>
  </div>
  `
}
