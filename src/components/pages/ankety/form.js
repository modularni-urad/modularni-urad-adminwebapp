/* global Vue, axios, API, _ */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      name: '',
      desc: '',
      image: '',
      maxpositive: 1,
      maxnegative: 0,
      maxperoption: 1,
      voting_start: '',
      voting_end: ''
    }
  },
  validations: {
    name: { required: validators.required },
    desc: { required: validators.required },
    image: '',
    maxpositive: { required: validators.required },
    maxnegative: { required: validators.required },
    maxperoption: { required: validators.required },
    voting_start: { required: validators.required },
    voting_end: { required: validators.required }
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
      return this.$data.id
        ? axios.put(`${API}/ankety/surveys/${this.$data.id}`, this.$data)
        : axios.post(`${API}/ankety/surveys`, this.$data)
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
  template: `
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <div class="row">
        <div class="col-sm-6">
          <b-form-group
            :state="!$v.name.$error"
            label="Název"
            label-for="name-input"
            invalid-feedback="Název je povinný"
          >
            <b-form-input
              id="name-input"
              v-model="$v.name.$model"
              :state="!$v.name.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.desc.$error"
            label="Nastavení"
            label-for="desc-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-textarea
              id="desc-input"
              v-model="$v.desc.$model"
              :state="!$v.desc.$error"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group :state="!$v.image.$error" label="Název" label-for="image-input">
            <b-form-input id="name-input" v-model="$v.image.$model"
              :state="!$v.image.$error"></b-form-input>
          </b-form-group>

          <b-form-group :state="!$v.maxpositive.$error" label="Maximum pozitivních" label-for="maxpositive-input">
            <b-form-input id="maxpositive-input"
              v-model="$v.maxpositive.$model"
              :state="!$v.maxpositive.$error"></b-form-input>
          </b-form-group>

          <b-form-group :state="!$v.maxnegative.$error" label="Maximum negativních" label-for="maxnegative-input">
            <b-form-input id="maxnegative-input"
              v-model="$v.maxnegative.$model"
              :state="!$v.maxnegative.$error"></b-form-input>
          </b-form-group>

          <b-form-group :state="!$v.maxperoption.$error" label="Maximum na možnost" label-for="maxperoption-input">
            <b-form-input id="maxperoption-input"
              v-model="$v.maxperoption.$model"
              :state="!$v.maxperoption.$error"></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.voting_start.$error"
            label="začátek hlasování"
            label-for="voting_start-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input id="voting_start-input" type="date"
              v-model="$v.voting_start.$model"
              :state="!$v.voting_start.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.voting_end.$error"
            label="konec hlasování"
            label-for="voting_end-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input id="voting_end-input" type="date"
              v-model="$v.voting_end.$model"
              :state="!$v.voting_end.$error"
            ></b-form-input>
          </b-form-group>

        <div>
        <div class="col-sm-6">

        </div>
      </div>

      <b-button class="mt-3" block :disabled="$v.$anyError" @click="handleSubmit">
        Save
      </b-button>
    </form>
  `
})
