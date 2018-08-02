<template>
  <v-list-tile :key="member.user_id" @click="">
    <v-list-tile-action>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title><router-link :to="{ name: 'UserProfile', params: { id: member.user_id } }">{{ member.user_name }}</router-link></v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-action v-if="online">
      <v-icon color="green">done</v-icon>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
  export default {
    name: 'member-chip',
    props: {
      member: {
        type: Object,
        required: true
      },
      online: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>

</style>