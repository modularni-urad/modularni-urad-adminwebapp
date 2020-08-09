/* global Vue, axios, API, _ */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      app_id: '',
      dev_id: '',
      coef: 0.001,
      start: 0,
      desc: '',
      sn: '',
      type: '',
      sensor_type: '',
      sensor_sn: '',
      pipe: ''
    }
  },
  validations: {
    app_id: { },
    dev_id: { required: validators.required },
    desc: { required: validators.required },
    coef: { required: validators.required },
    start: { required: validators.required },
    sn: { required: validators.required },
    type: { required: validators.required },
    sensor_type: { },
    sensor_sn: { },
    pipe: { }
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
            :state="!$v.sensor_type.$error"
            label="Typ senzoru"
            label-for="sensor_type-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="sensor_type-input"
              v-model="$v.sensor_type.$model"
              :state="!$v.sensor_type.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.sensor_sn.$error"
            label="Číslo senzoru"
            label-for="sensor_sn-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="sensor_sn-input"
              v-model="$v.sensor_sn.$model"
              :state="!$v.sensor_sn.$error"
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

          <b-form-group
            :state="!$v.start.$error"
            label="Start"
            label-for="start-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="start-input"
              v-model="$v.start.$model"
              :state="!$v.start.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.sn.$error"
            label="Seriové číslo"
            label-for="sn-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="sn-input"
              v-model="$v.sn.$model"
              :state="!$v.sn.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.type.$error"
            label="Typ vodoměru"
            label-for="type-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="type-input"
              v-model="$v.type.$model"
              :state="!$v.type.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.pipe.$error"
            label="Trubka"
            label-for="pipe-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="pipe-input"
              v-model="$v.pipe.$model"
              :state="!$v.pipe.$error"
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
