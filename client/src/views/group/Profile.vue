<template>
  <v-layout>
    <v-flex xs12>
      <h1 class="headline mb-2">Group: {{ group.name }}</h1>
      <group-card :group="group" :is_member="is_member" />
    </v-flex>
  </v-layout>
</template>

<script>
  import { GroupService } from '../../services'
  import GroupCard from '../../components/groupCard'

  export default {
    components: {
      GroupCard
    },
    name: 'group-profile',
    data: () => ({
      is_member: {},
      group: {}
    }),
    mounted () {
      this.fetchGroup(this.$route.params.id)
    },
    methods: {
      fetchGroup (id) {
        GroupService.fetch(id)
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => {
            this.is_member = data.is_member
            this.group = data.group
          })
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