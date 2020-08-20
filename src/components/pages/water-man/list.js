/* global axios, API, prompt */
import ItemForm from './form.js'
import HistoryModal from './history.js'

export default {
  data: () => {
    return {
      fields: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'dev_id', label: 'Dev ID', sortable: true },
        { key: 'sn', label: 'S/N', sortable: true },
        { key: 'type', label: 'Typ', sortable: true },
        { key: 'desc', label: 'Popis' },
        { key: 'battery', label: 'Baterie', sortable: true },
        { key: 'value', label: 'Stav', sortable: true },
        { key: 'actions', label: 'Akce' }
      ],
      items: [],
      isBusy: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      curr: null,
      currHistory: null,
      item: {}
    }
  },
  methods: {
    myProvider (ctx) {
      const params = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        sort: ctx.sortBy ? `${ctx.sortBy}:${ctx.sortDesc ? 'desc' : 'asc'}` : 'id:asc'
      }
      const promise = axios.get(`${API}/wm/points`, { params })
      return promise.then(res => {
        this.totalRows = res.data.pagination.total
          ? res.data.pagination.total : this.totalRows
        return res.data.data
      }).catch(err => {
        console.log(err)
        return []
      })
    },
    setPageSize: function (newSize) {
      this.perPage = newSize
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
    openHistory: function (item) {
      this.$data.currHistory = item
      this.$bvModal.show('modal-history')
    },
    saveState: function (item) {
      const r = prompt('Zadej současnou hodnotu na vodoměru')
      if (r) {
        axios.post(`${API}/wm/data/${item.id}`, { value: r })
          .then(res => {
            this.$store.dispatch('toast', { message: 'uloženo' })
          })
          .catch(err => {
            const message = err.response.data
            this.$store.dispatch('toast', { message, type: 'error' })
          })
      }
    },
    rowClass: function (item, type) {
      if (!item || type !== 'row') return
      if (item.alerts) return 'table-danger'
    }
  },
  components: {
    'item-form': ItemForm,
    'history-modal': HistoryModal
  },
  template: `
  <div>
    <div>
      <b-breadcrumb class="float-left">
        <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
        <b-breadcrumb-item active>Odběrná místa</b-breadcrumb-item>
      </b-breadcrumb>

      <div class="float-right">
        <a href="/scan/api=waterman" target="_blank"
          v-if="$store.getters.isMember('waterman_data')">
          <b-button variant="danger"><i class="fas fa-save"></i> Načítat</b-button>
        </a>
        <b-button
          v-if="$store.getters.isMember('waterman_admin')"
          variant="primary" @click="add">
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
        :tbody-tr-class="rowClass"
        head-variant="dark"
      >
        <template v-slot:cell(dev_id)="data">
          <a href="javascript:void(0)" v-on:click="openHistory(data.item)">
            {{data.item.dev_id}}
          </a>
        </template>
        <template v-slot:cell(desc)="data">
          {{data.item.desc.substr(0, 20)}}
        </template>
        <template v-slot:cell(actions)="data">
          <b-dropdown text="akce" right size="sm" variant="primary">
            <b-dropdown-item
              v-if="$store.getters.isMember('waterman_data')"
              @click="saveState(data.item)" variant="danger">
              <i class="fas fa-save"></i> uložit stav
            </b-dropdown-item>
            <b-dropdown-item @click="edit(data.item)" variant="primary"
              v-if="$store.getters.isMember('waterman_admin')">
              <i class="fas fa-edit"></i> upravit
            </b-dropdown-item>
            <b-dropdown-item @click="openHistory(data.item)" variant="info">
              <i class="fas fa-clock"></i> historie
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>

      <div class="float-left">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="maps-table"
        ></b-pagination>
      </div>

      <div class="float-right">
        <b-dropdown dropup text="Velikost stránky" variant="primary">
          <b-dropdown-item @click="setPageSize(5)">5</b-dropdown-item>
          <b-dropdown-item @click="setPageSize(10)">10</b-dropdown-item>
          <b-dropdown-item @click="setPageSize(50)">50</b-dropdown-item>
        </b-dropdown>
      </div>

      <b-modal size="xl" id="modal-add" title="Upravit" hide-footer>
        <item-form v-bind:onSubmit="onItemSubmit" v-bind:item="curr"></item-form>
      </b-modal>

      <b-modal size="xl" id="modal-history" title="Historie dat" hide-footer>
        <history-modal v-model="currHistory">
        </history-modal>
      </b-modal>
    </div>
  </div>
  `
}
