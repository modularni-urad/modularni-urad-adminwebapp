/* global Vue */

Vue.filter('formatDate', function (value) {
  if (value) {
    return value.format('DD.MM.YYYY')
  }
})
