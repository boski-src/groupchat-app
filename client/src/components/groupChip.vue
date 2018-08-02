<template>
  <v-list-tile avatar :to="{ name: 'GroupChat', params: { id: group._id } }">
    <v-list-tile-avatar>
      <img :src="`https://ui-avatars.com/api/?name=${group.name}`">
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{ group.name }}</v-list-tile-title>
      <v-list-tile-sub-title v-if="group.messages[0]">
        Last message: {{ group.messages[0].invoker_name }}
      </v-list-tile-sub-title>
      <v-list-tile-sub-title v-else>
        Admin: {{ group.admin_username }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
  export default {
    name: 'group-chip',
    props: {
      group: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>