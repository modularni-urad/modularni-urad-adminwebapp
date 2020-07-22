/* global axios, API, _, moment */
import LineChart from './history-chart.js'

export default {
  data: () => ({
    loaded: false,
    chartdata: null
  }),
  async mounted () {
    this.loaded = false
    try {
      const params = {
        pointid: this.value.id
      }
      const res = await axios.get(`${API}/wm/data`, { params })
      this.chartdata = {
        labels: _.map(res.data, i => moment(i.created)),
        datasets: [{
          label: 'Stav vodoměru',
          backgroundColor: '#1819D9',
          data: _.map(res.data, i => i.value)
        }]
      }

      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  },
  props: ['value'],
  components: { LineChart },
  template: `
  <div class="container">
    <line-chart
      v-if="loaded"
      :chartdata="chartdata" />
  </div>
  `
}
