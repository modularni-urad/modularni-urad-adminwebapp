/* global Vue, moment, VueFormGenerator */

VueFormGenerator.validators.resources.fieldIsRequired = 'Toto je povinné'
VueFormGenerator.validators.resources.textTooSmall =
  'Text je moc krátký! Teď: {0}, minimum: {1}'

Vue.use(VueFormGenerator, {
  validators: {
    nonEmptySelection: function (value) {
      if (!value.length) {
        return 'Výběr nesmí být prázdný'
      }
    }
  }
})

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY')
  }
})
