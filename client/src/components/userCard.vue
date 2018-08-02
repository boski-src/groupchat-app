<template>
  <v-card>
    <div class="text-xs-center py-4">
      <v-avatar size="100">
        <img
                class="img-circle elevation-7 mb-1"
                :src="`https://ui-avatars.com/api/?size=100&name=${user.profile.name}`"
        >
      </v-avatar>
      <div class="headline" style="font-weight:bold">{{ user.profile.name }}</div>
      <div class="subheading text-xs-center grey--text pt-1 pb-3" v-if="user.profile.website">
        <a :href="user.profile.website" target="_blank">{{ user.profile.website }}</a>
      </div>
    </div>
    <v-card-actions>
      <small class="grey--text">
        Joined: {{ user.created }}<br>
        Last login: {{ user.last_login }}
      </small>
      <v-spacer></v-spacer>
      <v-chip color="orange" text-color="white" v-if="user.is_admin">
        Admin
        <v-icon right>star</v-icon>
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'user-card',
    props: {
      user: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>