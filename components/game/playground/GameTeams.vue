<template>
  <v-container>
    <!-- TEAMS -->
    <v-row>
      <v-col v-for="(team, code) in game.teams" :key="code">
        <v-card>
          <v-card-title>
            <span class="title">Team {{ code }}</span>
            <v-chip label small class="ml-2" :color="teamColor(code)"></v-chip>
          </v-card-title>
          <v-card-text>
            <div v-for="user in game.teams[code]" :key="user.uuid">
              {{ user.name }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!userTeam"
              block
              class="primary"
              @click="addPlayer(code)"
            >
              Unirme
            </v-btn>
            <v-btn
              v-else-if="userTeam === code"
              block
              text
              color="secondary"
              @click="removePlayer()"
            >
              Abandonar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card v-if="isOwner">
          <v-card-text>
            <v-slider
              v-model="numTeams"
              :min="2"
              :max="4"
              :tick-labels="[2, 3, 4]"
              ticks="always"
              tick-size="4"
              label="Número de equipos"
              ><template v-slot:prepend>
                <v-icon :disabled="numTeams <= minNumTeams" @click="numTeams--">
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon :disabled="numTeams >= maxNumTeams" @click="numTeams++">
                  mdi-plus
                </v-icon>
              </template></v-slider
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/plugins/firebase'
import GameMixin from '@/components/mixins/GameMixin'

export default {
  mixins: [GameMixin],
  data: () => ({
    numTeams: 2,
    minNumTeams: 2,
    maxNumTeams: 4
  }),
  computed: {},
  watch: {
    game: {
      immediate: true,
      handler(newValue, oldValue) {
        if (this.game) {
          if (!oldValue) this.numTeams = this.game.teams.length
          this.createTeams()
        }
      }
    },
    numTeams: {
      immediate: true,
      handler(newValue, oldValue) {
        this.createTeams()
      }
    }
  },
  methods: {
    async addPlayer(teamCode) {
      const game = this.game || this.gameCopy
      const teamUsers = Array.isArray(game.teams[teamCode])
        ? game.teams[teamCode]
        : []
      teamUsers.push(this.user)
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({
          [`teams.${teamCode}`]: JSON.parse(JSON.stringify(teamUsers))
        })
    },
    async removePlayer() {
      const teamCode = this.userTeam
      const game = this.game || this.gameCopy
      let teamUsers = Array.isArray(game.teams[teamCode])
        ? game.teams[teamCode]
        : []
      teamUsers = teamUsers.filter((a) => a.uuid !== this.user.uuid)
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({
          [`teams.${teamCode}`]: JSON.parse(JSON.stringify(teamUsers))
        })
    },
    async createTeams() {
      console.log(
        'createTeams',
        Object.keys(this.game.teams).length,
        this.numTeams,
        Object.keys(this.game.teams).length !== this.numTeams
      )
      if (
        this.game &&
        this.isOwner &&
        Object.keys(this.game.teams).length !== this.numTeams
      ) {
        console.log('createTeams', 'entro')
        const teams = {}
        for (let i = 1; i <= this.numTeams; i++) {
          teams[i] = []
        }
        await db
          .collection('music-games')
          .doc(this.game.id)
          .update({ teams })
      }
    }
  }
}
</script>
