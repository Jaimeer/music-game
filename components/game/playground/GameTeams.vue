<template>
  <div>
    <v-row dense>
      <v-col
        v-for="(team, code) in game.teams"
        :key="code"
        cols="12"
        :sm="12 / Object.keys(game.teams).length"
      >
        <v-card>
          <v-card-title>
            <span class="title">{{ $t('general.team') }} {{ code }}</span>
            <v-chip label small class="ml-2" :color="teamColor(code)"></v-chip>
            <v-spacer />
            <span>{{ team.score }}</span>
          </v-card-title>
          <v-card-text>
            <div v-for="player in game.teams[code].players" :key="player.uuid">
              <v-btn
                v-if="isOwner"
                small
                icon
                @click="removePlayer(code, player.uuid)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <span class="ml-1">{{ player.name }}</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!userTeam"
              block
              class="primary"
              @click="addPlayer(code)"
            >
              {{ $t('teams.join') }}
            </v-btn>
            <v-btn
              v-else-if="userTeam === code"
              block
              text
              color="secondary"
              @click="removePlayer(code, user.uuid)"
            >
              {{ $t('teams.leave') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card v-if="isOwner">
          <v-card-title>{{ $t('general.configuration') }}</v-card-title>
          <v-card-text>
            <v-alert outlined dense color="orange" border="left">
              <v-icon color="orange">mdi-alert</v-icon>
              <span class="caption">
                {{ $t('teams.changeNumTeamsAlert') }}
              </span>
            </v-alert>
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
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
import GameMixin from '@/components/mixins/GameMixin'
const debug = require('debug')('app:GameTeams')

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
          const currentNumTeam = Object.keys(this.game.teams).length
          if (!oldValue) this.numTeams = currentNumTeam
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
      debug('addPlayer', teamCode)
      const game = this.game || this.gameCopy
      const teamUsers = Array.isArray(game.teams[teamCode].players)
        ? game.teams[teamCode].players
        : []
      teamUsers.push(this.user)
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({
          [`teams.${teamCode}.players`]: JSON.parse(JSON.stringify(teamUsers))
        })
    },
    async removePlayer(teamCode, uuid) {
      debug('removePlayer', teamCode, uuid)
      const game = this.game || this.gameCopy
      let teamUsers = Array.isArray(game.teams[teamCode].players)
        ? game.teams[teamCode].players
        : []
      teamUsers = teamUsers.filter((a) => a.uuid !== uuid)
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({
          [`teams.${teamCode}.players`]: JSON.parse(JSON.stringify(teamUsers))
        })
    },
    async createTeams() {
      debug('createTeams', '?')
      if (
        this.game &&
        this.isOwner &&
        Object.keys(this.game.teams).length !== this.numTeams
      ) {
        debug('createTeams', 'DO IT')
        const teams = {}
        for (let i = 1; i <= this.numTeams; i++) {
          teams[i] = {
            score: 0,
            players: []
          }
        }
        debug('bbbbbbb', teams)
        await db
          .collection('music-games')
          .doc(this.game.id)
          .update({ teams })

        await this.resetPlays()
      }
    }
  }
}
</script>
