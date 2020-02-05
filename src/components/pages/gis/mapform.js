/* global Vue, axios, API, minLength, required */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      title: '',
      writers: ''
    }
  },
  validations: {
    title: {
      required: validators.required
    },
    writers: {
      required: validators.required
    }
  },
  methods: {
    save () {
      return axios.post(`${API}/layers`, this.$data)
    },
    handleSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.save().then(() => {
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

      <b-button class="mt-3" block
        :disabled="$v.$anyError"
        @click="handleSubmit">
        Save
      </b-button>
    </form>
  `
})
