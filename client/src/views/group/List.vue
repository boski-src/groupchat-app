<template>
  <v-layout>
    <v-flex xs12>
      <h1 class="headline mb-2">Public Group List</h1>
      <v-card>
        <v-card-title>
          Search Group
          <v-spacer></v-spacer>
          <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search..."
                  single-line
                  hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="groups"
                :search="search"
        >
          <template slot="items" slot-scope="props">
            <td>
              <small>{{ props.item._id }}</small>
            </td>
            <td class="text-xs-right">{{ props.item.name }}</td>
            <td class="text-xs-right">
              <router-link :to="{ name: 'UserProfile', params: { id: props.item._id } }">
                {{ props.item.admin_username }}
              </router-link>
            </td>
            <td class="text-xs-center">
              <v-btn round small color="primary" :to="{ name: 'GroupProfile', params: { id: props.item._id } }">
                Profile
              </v-btn>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { GroupService } from '../../services'

  export default {
    name: 'group-list',
    data: () => ({
      search: '',
      headers: [
        { text: 'Id', align: 'left', value: '_id' },
        { text: 'Name', align: 'right', value: 'name' },
        { text: 'Admin', align: 'right', value: 'admin_username' },
        { text: 'Go to', align: 'center', value: 'name', sortable: false }
      ],
      groups: []
    }),
    mounted () {
      this.fetchGroups()
    },
    methods: {
      fetchGroups () {
        GroupService.fetchPublic()
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => this.groups = data)
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