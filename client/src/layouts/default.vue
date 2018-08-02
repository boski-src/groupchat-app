<template>
  <v-app
          id="inspire"
  >
    <v-navigation-drawer
            v-model="notifyDrawer"
            fixed
            right
            clipped
            app
    >
      <v-list>
        <v-subheader class="grey--text text--darken-1">
          Notifications
        </v-subheader>
        <v-list three-line>
          <notify-chip v-for="notify in notifications" :notification="notify" :key="notify.date" />
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
            v-model="drawer"
            fixed
            app
    >
      <v-list>
        <v-subheader class="mt-3 grey--text text--darken-1">
          <router-link :to="{ name: 'UserProfile', params: { id: user.id } }">Hello, {{ user.username }}</router-link>
        </v-subheader>
        <template v-for="(item, i) in items">
          <v-list-tile :key="i" v-if="item.click === 'openCreateModal'" @click="openCreateModal">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :key="i" v-else-if="item.route" :to="{ name: item.route }">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :key="i" @click="" v-else>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <v-list dense>
        <v-subheader class="grey--text text--darken-1">
          Your groups
          <v-btn flat icon color="primary" @click="fetchGroups">
            <v-icon>cached</v-icon>
          </v-btn>
        </v-subheader>
        <v-list two-line>
          <group-chip v-for="group in groups.owned" :group="group" :key="group._id" />
          <group-chip v-for="group in groups.joined" :group="group" :key="group._id" />
        </v-list>
        <v-list>
          <group-chip v-for="group in groups.published" :group="group" :key="group._id" />
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
            color="blue darken-3"
            dark
            fixed
            clipped
            app
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="title ml-3 mr-5">GroupChat.app</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon small>
        <v-icon color="green" v-if="isConnected && isAuth">router</v-icon>
        <v-icon color="red" v-else>router</v-icon>
      </v-btn>
      <v-badge
              overlap
              color="blue lighten-1"
      >
        <span slot="badge" v-if="notifications.length">{{ notifications.length }}</span>
        <v-btn small icon @click="notifyDrawer = !notifyDrawer">
          <v-icon>notifications</v-icon>
        </v-btn>
      </v-badge>
      <v-btn icon @click="logout">
        <v-icon>power_settings_new</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
          <router-view :key="$route.fullPath" />
        </v-layout>
      </v-container>
    </v-content>
    <create-group-modal
            :open="createModal"
            @modalClose="createModal = false"
            @createGroup="createGroup"
    ></create-group-modal>
  </v-app>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { GroupService } from '../services'
  import createGroupModal from '../components/createGroupModal'
  import groupChip from '../components/groupChip'
  import NotifyChip from '../components/notifyChip'

  export default {
    name: 'default',
    computed: mapGetters({
      user: 'getUser',
      notifications: 'getNotifications',
      isConnected: 'socketConnected',
      isAuth: 'socketAuth'
    }),
    components: {
      NotifyChip,
      createGroupModal,
      groupChip
    },
    data: () => ({
      drawer: true,
      notifyDrawer: false,
      items: [
        { icon: 'home', text: 'Home', route: 'Home' },
        { icon: 'add_circle_outline', text: 'Create Group', click: 'openCreateModal' },
        { icon: 'list', text: 'Group list', route: 'GroupList' },
        { icon: 'settings', text: 'Manage Profile', route: 'Account' }
      ],
      createModal: false,
      groups: {
        owned: [],
        joined: [],
        published: []
      }
    }),
    watch: {
      search (value) {
        this.searchGroups = []
        this.searchLoading = true
        GroupService.search(value)
          .then(response => response.data.data)
          .then(data => this.searchGroups = data)
          .finally(() => (this.searchLoading = false))
      }
    },
    mounted () {
      this.fetchUser()
      this.fetchGroups()
    },
    methods: {
      ...mapActions(['fetchUser', 'logout']),
      fetchGroups () {
        GroupService.fetchAll()
          .then(response => response.data.data)
          .then(data => this.groups = data)
      },
      openCreateModal () {
        this.createModal = true
      },
      createGroup (data) {
        GroupService.create(data)
          .then(response => response.data.data)
          .then(data => {
            this.groups.owned.push(data)
            this.$router.push({ name: 'GroupChat', params: { id: data._id } })
            this.createModal = false
          })
      }
    }
  }
</script>

<style scoped>
  .search-box {
    top: 65px;
    position: absolute;
    width: 100%;
    max-width: 650px;
  }
</style>