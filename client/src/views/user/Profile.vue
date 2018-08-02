<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
      <h1 class="headline mb-2">User: admin</h1>
      <user-card :user="user" />
    </v-flex>
  </v-layout>
</template>

<script>
  import { UserService } from '../../services'
  import UserCard from '../../components/userCard'

  export default {
    components: {
      UserCard
    },
    name: 'user-profile',
    data: () => ({
      user: {}
    }),
    mounted () {
      this.fetchUser(this.$route.params.id)
    },
    methods: {
      fetchUser (id) {
        UserService.fetch(id)
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => this.user = data)
          .catch(() => {
            // todo toast message
            this.$router.push({ name: 'Home' })
          })
      }
    }
  }
</script>

<style scoped>

</style>