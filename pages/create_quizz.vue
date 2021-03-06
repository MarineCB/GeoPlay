<template>
  <div>
    <v-stepper
      v-model="e1"
      linear
    >
      <v-stepper-header>
        <v-stepper-step
          editable
          :complete="e1 > 1"
          step="1"
        >
          Quizz details
        </v-stepper-step>

        <v-divider />

        <v-stepper-step
          :editable="quizzValid"
          :complete="e1 > 2"
          step="2"
        >
          Questions
        </v-stepper-step>

        <v-divider />

        <v-stepper-step
          :editable="quizzValid && currentQuestNb === questionsNumber"
          step="3"
        >
          Sumary
        </v-stepper-step>
      </v-stepper-header>
      <v-divider />
      <v-card>
        <v-stepper-items style="min-height: 100vh">
          <v-stepper-content step="1">
            <v-container>
              <v-form v-model="quizzValid">
                <v-text-field
                  v-model="Name"
                  :counter="25"
                  maxlength="25"
                  label="Name of the quizz"
                  :rules="requiredRules"
                />
                <v-textarea
                  v-model="Description"
                  :counter="500"
                  label="Description"
                  rows="3"
                />
                <v-radio-group
                  v-model="Difficulty"
                  row
                >
                  <v-radio
                    label="Easy"
                    color="success"
                    value="Easy"
                  />
                  <v-radio
                    label="Normal"
                    color="secondary"
                    value="Normal"
                  />
                  <v-radio
                    label="Hard"
                    color="error"
                    value="Hard"
                  />
                </v-radio-group>
                <v-select
                  v-model="ChoosenMap"
                  :items="mapItems"
                  item-text="map_name"
                  item-value="map_id"
                  label="Map"
                  data-vv-name="select"
                  :rules="[(e) => !!e || 'Please select a map']"
                />

                <v-col
                  cols="6"
                  sm="6"
                  md="6"
                >
                  <v-slider
                    v-model="questionsNumber"
                    max="20"
                    :min="currentQuestNb < 5 ? 5 : currentQuestNb"
                    class="align-center"
                    thumb-label="always"
                    ticks
                  >
                    <template #append>
                      <v-text-field
                        v-model="questionsNumber"
                        class="mt-0 pt-0"
                        type="number"
                        :min="currentQuestNb < 5 ? 5 : currentQuestNb"
                        max="20"
                        style="width: 60px"
                      />
                    </template>
                  </v-slider>
                </v-col>
                <v-col
                  cols="10"
                  md="10"
                />
              </v-form>
            </v-container>
          </v-stepper-content>
          <v-stepper-content
            v-if="!!ChoosenMap"
            step="2"
          >
            <v-row>
              <v-col
                cols="20"
                sm="6"
                md="8"
              >
                <v-container
                  class="flex-grow-1"
                  fluid
                >
                  <radio-svg-map
                    id="map"
                    v-model="selectedLocationId"
                    style="height: 90vh"
                    :map="ChoosenMap"
                    @click="onLocationClicked"
                  />
                </v-container>
              </v-col>
              <v-col
                cols="5"
                sm="6"
                md="4"
              >
                <v-container fluid>
                  <v-form
                    ref="form"
                    v-model="questionsValid"
                  >
                    <v-text-field
                      v-model="selectedLocationName"
                      readonly
                      hint="Click on the map !"
                      label="Choosen location"
                      :rules="requiredRules"
                      required
                    />
                    <v-text-field
                      v-model="questionTag"
                      label="Your question"
                      :rules="requiredRules"
                    />
                    <v-text-field
                      v-model="duration"
                      label="Number of seconds to find the answer"
                      type="number"
                      min="5"
                      max="40"
                      :rules="[
                        (e) => !!e || 'Please select a duration',
                        (e) => e > 4 || 'Minimum time is 5 seconds',
                        (e) => e < 46 || 'Maximum time is 45 seconds',
                      ]"
                    />
                  </v-form>
                  <v-row
                    class="mb-12"
                    align="center"
                  >
                    <v-btn
                      class="mt-5"
                      color="primary"
                      :disabled="!questionsValid"
                      @click="submitQuestion"
                    >
                      Save question
                    </v-btn>
                  </v-row>
                  <h3 v-if="!!questions.length">
                    Questions: {{ currentQuestNb }}/{{ questionsNumber }}
                  </h3>
                  <v-row class="mb-6">
                    <v-virtual-scroll
                      :items="questions"
                      height="270"
                      item-height="64"
                    >
                      <template
                        #default="{ item }"
                        fluid
                      >
                        <v-list-item :key="questions.indexOf(item)">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.question_tag }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              Location: {{ item.locationName }} ({{
                                item.duration
                              }}
                              sec)
                            </v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-icon
                              small
                              @click="
                                questions.splice(questions.indexOf(item), 1)
                              "
                            >
                              mdi-delete
                            </v-icon>
                          </v-list-item-action>
                        </v-list-item>

                        <v-divider />
                      </template>
                    </v-virtual-scroll>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-container>
              <v-text-field
                v-model="$store.getters['users/user'].username"
                label="Creator of the quizz"
                readonly
              />
              <v-text-field
                v-model="name"
                label="Name of the quizz"
                readonly
              />
              <v-text-field
                v-model="Difficulty"
                label="Difficulty"
                readonly
              />
              <v-textarea
                v-if="!!description"
                v-model="description"
                label="Description"
                rows="3"
                readonly
              />
              <v-text-field
                v-if="!!ChoosenMap"
                v-model="ChoosenMap.label"
                label="Map"
                readonly
              />
              <h3>
                {{ questionsNumber }} questions: ({{ totalDuration }} sec)
              </h3>
              <v-virtual-scroll
                :items="questions"
                height="270"
                item-height="64"
              >
                <template
                  #default="{ item }"
                  fluid
                >
                  <v-list-item :key="questions.indexOf(item)">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.question_tag }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Location: {{ item.locationName }} ({{
                          item.duration
                        }}sec)
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider />
                </template>
              </v-virtual-scroll>
              <v-spacer />
              <v-col class="d-flex align-center flex-column mt-10">
                <v-btn
                  color="primary"
                  @click="submitQuizz"
                >
                  Save quizz
                </v-btn>
              </v-col>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-card>
    </v-stepper>
    <v-dialog
      v-model="successDialog"
      persistent
      max-width="320"
    >
      <v-card>
        <v-card-title class="headline">
          Creation of your quizz
        </v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            to="/my_quizzes"
            color="green darken-1"
            text
            @click="successDialog = false"
          >
            My quizzes
          </v-btn>
          <v-btn
            href="/create_quizz"
            color="green darken-1"
            text
            @click="successDialog = false"
          >
            Create new quizz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="errorDialog"
      persistent
      max-width="320"
    >
      <v-card>
        <v-card-title class="headline">
          Creation of your quizz
        </v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            to="/my_quizzes"
            color="green darken-1"
            text
            @click="errorDialog = false"
          >
            My quizzes
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="errorDialog = false"
          >
            Modify
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { RadioSvgMap } from 'vue-svg-map'
import FranceReg from '@svg-maps/france.regions'
import World from '@svg-maps/world'
import France from '@svg-maps/france.departments'
import socket from '~/plugins/socket.io.js'

export default {
  components: {
    RadioSvgMap
  },
  layout: 'blank',
  middleware: 'auth',
  data: () => ({
    e1: 1,
    quizzValid: false,
    questionsValid: false,
    Name: '',
    Description: '',
    Difficulty: 'Normal',
    ChoosenMap: null,
    mapItems: [
      { map_id: World, map_name: 'World' },
      { map_id: France, map_name: 'France, departments' },
      { map_id: FranceReg, map_name: 'France, regions' }
    ],
    questionsNumber: 10,
    France,
    FranceReg,
    World,
    questions: [],
    questionTag: '',
    selectedLocationId: '',
    selectedLocationName: '',
    defaultDuration: 15,
    duration: 15,
    errorDialog: false,
    successDialog: false,
    message: 'Your quizz has been successfully created',
    requiredRules: [
      (input) => (!!input && input.trim() !== '') || 'This cannot be empty'
    ]
  }),
  computed: {
    currentQuestNb: function () {
      return this.questions.length
    },
    name: function () {
      return this.Name.trim()
    },
    description: function () {
      return this.Description.trim()
    },
    totalDuration: function () {
      let totalDuration = 0
      this.questions.forEach((q) => (totalDuration += q.duration))
      return totalDuration
    }
  },
  watch: {
    ChoosenMap: function (val) {
      this.questions = []
    },
    questionsNumber: function (val) {
      if (this.questions.length > val) {
        alert('You already have more questions created')
        this.questionsNumber = this.questions.length
      }
    }
  },
  mounted () {
    this.duration = this.defaultDuration
    socket.emit('disableServerTimer', {
      player: this.$store.getters['users/user']
    })
  },
  methods: {
    /**
     * Fetch a location name from the location id of the clicked location on the map
     */
    onLocationClicked () {
      this.selectedLocationName = this.ChoosenMap.locations.find(
        (loc) => loc.id === this.selectedLocationId
      ).name
    },
    submitQuestion () {
      if (this.questions.length >= this.questionsNumber) {
        alert(
          'Please modify the number of questions if you want to add questions'
        )
      } else {
        this.duration = parseInt(this.duration)
        this.questions.push({
          locationName: this.selectedLocationName,
          response_location_id: this.selectedLocationId,
          question_tag: this.questionTag,
          duration: this.duration
        })
        this.$refs.form.resetValidation()
        this.selectedLocationId = ''
        this.selectedLocationName = ''
        this.questionTag = ''
        this.questionsValid = false
      }
    },
    async submitQuizz () {
      try {
        const response = await this.$axios.post('/api/quizzes/add', {
          name: this.name,
          description: this.description,
          mapid: this.ChoosenMap.label,
          difficulty: this.Difficulty,
          duration: this.totalDuration,
          id_user: this.$store.getters['users/user'].id,
          nb_questions: this.questionsNumber
        })
        const idQuiz = response.data.id_quiz
        await this.submitQuestions(idQuiz)
      } catch (error) {
        this.message = error.response.data
        this.errorDialog = true
      }
    },
    async submitQuestions (idQuiz) {
      try {
        await this.$axios.post('/api/questions/add', {
          quizId: idQuiz,
          questionList: this.questions
        })
        this.message = 'Your quizz has been successfully created'
        this.successDialog = true
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style src="vue-svg-map/dist/index.css"></style>
<style></style>
