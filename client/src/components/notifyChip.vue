<template>
  <v-list-tile
          avatar
          :to="{ name: 'GroupChat', params: { id: notification.group.id } }"
          @click.native="removeNotification(notification)"
  >
    <v-list-tile-content>
      <v-list-tile-title>{{ notification.group.name }}</v-list-tile-title>
      <v-list-tile-sub-title>
        {{ notification.text }}
      </v-list-tile-sub-title>
      <small style="font-size: 13px">
        - {{ notification.invoker.name }}
      </small>
    </v-list-tile-content>
    <v-btn round icon dark small color="primary" @click="removeNotification(notification)">
      <v-icon dark>close</v-icon>
    </v-btn>
  </v-list-tile>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'notify-chip',
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    methods: mapActions(['removeNotification'])
  }
</script>

<style scoped>

</style>