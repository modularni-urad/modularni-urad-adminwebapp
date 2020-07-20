/* global Vue, axios, API, _ */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      app_id: '',
      dev_id: '',
      coef: '1000',
      desc: ''
    }
  },
  validations: {
    app_id: { },
    dev_id: { required: validators.required },
    desc: { required: validators.required },
    coef: { required: validators.required }
  },
  created () {
    this.$props.item && Object.assign(this.$data, this.$props.item)
  },
  props: ['item'],
  methods: {
    save () {
      return this.$data.id
        ? axios.put(`${API}/wm/points/${this.$data.id}`, this.$data)
        : axios.post(`${API}/wm/points`, this.$data)
    },
    handleSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.save()
        .then(res => {
          this.$attrs.onSubmit(this.$data)
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-add')
          })
        })
        .catch(err => {
          const message = err.response.data
          this.$store.dispatch('toast', { message, type: 'error' })
        })
    }
  },
  // components: {
  //   infoeditor: InfoEditor
  // },
  template: `
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <div class="row">
        <div class="col-sm-6">
          <b-form-group
            :state="!$v.app_id.$error"
            label="App ID"
            label-for="app_id-input"
            invalid-feedback="Název je povinný"
          >
            <b-form-input
              id="app_id-input"
              v-model="$v.app_id.$model"
              :state="!$v.app_id.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.dev_id.$error"
            label="Dev ID"
            label-for="dev_id-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="dev_id-input"
              v-model="$v.dev_id.$model"
              :state="!$v.dev_id.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.desc.$error"
            label="Popis"
            label-for="desc-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-textarea rows="3"
              id="desc-input"
              v-model="$v.desc.$model"
              :state="!$v.desc.$error"
            ></b-form-textarea>
          </b-form-group>
        </div>

        <div class="col-sm-6">
          <b-form-group
            :state="!$v.coef.$error"
            label="Koeficient"
            label-for="coef-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="coef-input"
              v-model="$v.coef.$model"
              :state="!$v.coef.$error"
            ></b-form-input>
          </b-form-group>
        </div>

      </div>

      <b-button class="mt-3" block :disabled="$v.$anyError" @click="handleSubmit">
        Save
      </b-button>
    </form>
  `
})
