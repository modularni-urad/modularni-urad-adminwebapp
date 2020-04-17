/* global Vue, axios, API, _, minLength, required */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      title: '',
      writers: '',
      settings: ''
    }
  },
  validations: {
    title: {
      required: validators.required
    },
    writers: {
      required: validators.required
    },
    settings: {
      jsonrequired: function (value) {
        try {
          JSON.parse(value)
          return true
        } catch (_) {
          return false
        }
      }
    }
  },
  created () {
    if (this.$props.item) {
      Object.assign(this.$data, this.$props.item)
      this.$data.settings = JSON.stringify(this.$data.settings, null, 2)
    }
  },
  props: ['item'],
  methods: {
    save () {
      this.sentdata = _.pick(this.$data, 'title', 'writers', 'settings')
      return this.$data.id
        ? axios.put(`${API}/layers/${this.$data.id}`, this.sentdata)
        : axios.post(`${API}/layers`, this.sentdata)
    },
    handleSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.save().then(res => {
        this.sentdata.settings = JSON.parse(this.sentdata.settings)
        this.$attrs.onSubmit(this.sentdata)
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-add')
        })
      })
    }
  },
  template: `
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        :state="!$v.title.$error"
        label="Název"
        label-for="name-input"
        invalid-feedback="Název je povinný"
      >
        <b-form-input
          id="name-input"
          v-model="$v.title.$model"
          :state="!$v.title.$error"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="!$v.writers.$error"
        label="Právo zapisovat"
        label-for="writers-input"
        invalid-feedback="Toto je povinný atribut"
      >
        <b-form-input
          id="writers-input"
          v-model="$v.writers.$model"
          :state="!$v.writers.$error"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="!$v.settings.$error"
        label="Nastavení"
        label-for="settings-input"
        invalid-feedback="Toto musí být JSON"
      >
        <b-form-textarea
          id="settings-input"
          v-model="$v.settings.$model"
          :state="!$v.settings.$error"
        ></b-form-textarea>
      </b-form-group>

      <b-button class="mt-3" block
        :disabled="$v.$anyError"
        @click="handleSubmit">
        Save
      </b-button>
    </form>
  `
})
