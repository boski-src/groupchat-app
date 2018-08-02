<template>
  <v-card>
    <v-card-title primary-title class="py-5">
      <div class="headline">
        <v-avatar size="64">
          <img :src="`https://ui-avatars.com/api/name=${group.name}`" alt="">
        </v-avatar>
        {{ group.name }}
      </div>
    </v-card-title>
    <v-card-actions>
      <small class="grey--text">
        Admin: <router-link :to="{ name: 'UserProfile', params: { id: group.admin_id } }">{{ group.admin_username }}</router-link><br>
        ID: {{ group._id }}<br>
        Created: {{ group.createdAt }}
      </small>
      <v-spacer></v-spacer>
      <v-btn
              color="primary"
              :disabled="!is_member"
              :to="{ name: 'GroupChat', params: { id: group._id } }"
              v-if="group.unlisted"
      >
        JOIN
      </v-btn>
      <v-btn
              round
              color="primary"
              :to="{ name: 'GroupChat', params: { id: group._id } }"
              v-else
      >
        JOIN
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'group-card',
    props: {
      group: {
        type: Object,
        required: true
      },
      is_member: {
        required: true
      }
    }
  }
</script>

<style scoped>

</style>