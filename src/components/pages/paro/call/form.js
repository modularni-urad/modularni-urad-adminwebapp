/* global Vue, axios, API, _ */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      name: '',
      submission_start: '',
      submission_end: '',
      thinking_start: '',
      voting_start: '',
      voting_end: '',
      minimum_support: '',
      allocation: ''
    }
  },
  validations: {
    name: {
      required: validators.required
    },
    submission_start: {
      required: validators.required
    },
    submission_end: {
      required: validators.required
    },
    thinking_start: {
      required: validators.required
    },
    voting_start: {
      required: validators.required
    },
    voting_end: {
      required: validators.required
    },
    minimum_support: {
      required: validators.required
    },
    allocation: {
      required: validators.required
    }
  },
  created () {
    if (this.$props.item) {
      Object.assign(this.$data, this.$props.item)
      this.$data.submission_start = this.$props.item.submission_start.format('MM/DD/YYYY')
    }
  },
  props: ['item'],
  methods: {
    save () {
      this.sentdata = _.pick(this.$data, 'name', 'submission_start',
        'submission_end', 'thinking_start', 'voting_start', 'voting_end',
        'minimum_support', 'allocation')
      return this.$data.id
        ? axios.put(`${API}/paro/call/${this.$data.id}`, this.sentdata)
        : axios.post(`${API}/paro/call`, this.sentdata)
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
            :state="!$v.minimum_support.$error"
            label="Minimální podpora"
            label-for="minimum_support-input"
            invalid-feedback="Toto je povinný atribut"
          >
            <b-form-input
              id="minimum_support-input"
              type="number"
              v-model="$v.minimum_support.$model"
              :state="!$v.minimum_support.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.allocation.$error"
            label="Alokace"
            label-for="allocation-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input
              id="allocation-input"
              type="number"
              v-model="$v.allocation.$model"
              :state="!$v.allocation.$error"
            ></b-form-input>
          </b-form-group>
        </div>

        <div class="col-sm-6">
          <b-form-group
            :state="!$v.submission_start.$error"
            label="začátek podávání"
            label-for="submission_start-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input
              id="submission_start-input"
              type="date"
              v-model="$v.submission_start.$model"
              :state="!$v.submission_start.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.submission_end.$error"
            label="konec podávání"
            label-for="submission_end-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input
              id="submission_end-input"
              type="date"
              v-model="$v.submission_end.$model"
              :state="!$v.submission_end.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.thinking_start.$error"
            label="konec ověřování"
            label-for="thinking_start-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input
              id="thinking_start-input"
              type="date"
              v-model="$v.thinking_start.$model"
              :state="!$v.thinking_start.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.voting_start.$error"
            label="začátek hlasování"
            label-for="voting_start-input"
            invalid-feedback="Toto musí být"
          >
            <b-form-input
              id="voting_start-input"
              type="date"
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
            <b-form-input
              id="voting_end-input"
              type="date"
              v-model="$v.voting_end.$model"
              :state="!$v.voting_end.$error"
            ></b-form-input>
          </b-form-group>

        </div>
      </div>

      <b-button class="mt-3" block
        :disabled="$v.$anyError"
        @click="handleSubmit">
        Save
      </b-button>
    </form>
  `
})
