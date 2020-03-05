/* global axios, API */

export default {
  data: () => {
    return {
      currentCall: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      // const res = await axios.get(`${API}/paro_call/`)
    }
  },
  template: `
  <div>

  </div>
  `
}
