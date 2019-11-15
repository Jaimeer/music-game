<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" label="Name" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn @click="submit">Enter</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import UserMixin from '@/components/mixins/UserMixin'
export default {
  mixins: [UserMixin],
  data: () => ({
    name,
    valid: false
  }),
  methods: {
    submit() {
      this.login({ name: this.name })
    }
  }
}
</script>
