const Line = window.VueChartJs.Line

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      type: 'time',
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'čas'
      },
      minRotation: 20,
      time: { unit: 'day', displayFormats: { day: 'DD.MM.YYYY' } }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Value'
      }
    }]
  }
}

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartdata, options)
  }
}
