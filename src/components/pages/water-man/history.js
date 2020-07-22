/* global axios, API, _, moment */
import LineChart from './history-chart.js'

export default {
  data: () => ({
    loaded: false,
    chartdata: null,
    begin: moment().subtract(30, 'days'),
    end: moment() // now
  }),
  async mounted () {
    this._load()
  },
  methods: {
    _load: async function () {
      this.loaded = false
      try {
        const filter = JSON.stringify({
          pointid: this.value.id,
          and: [
            { created: { '>': this.begin } },
            { created: { '<': this.end } }
          ]
        })
        const res = await axios.get(`${API}/wm/data`, { params: { filter } })
        this.chartdata = {
          labels: _.map(res.data, i => moment(i.created)),
          datasets: [{
            label: `Stav vodoměru ${this.begin.format('DD.MM.YYYY')} - ${this.end.format('DD.MM.YYYY')}`,
            backgroundColor: '#1819D9',
            data: _.map(res.data, i => i.value)
          }]
        }

        this.loaded = true
      } catch (e) {
        console.error(e)
      }
    },
    prev: function () {
      this.end = moment(this.begin)
      this.begin = moment(this.begin).subtract(30, 'days')
      this._load()
    },
    next: function () {
      this.begin = moment(this.end)
      this.end = moment(this.end).add(30, 'days')
      this._load()
    }
  },
  props: ['value'],
  components: { LineChart },
  template: `
  <div class="container">
    <line-chart
      v-if="loaded"
      :chartdata="chartdata" />

    <b-button variant="info" v-on:click="prev">
      predchozi
    </b-button>
    <b-button variant="info" v-on:click="next">
      dalsi
    </b-button>
  </div>
  `
}
