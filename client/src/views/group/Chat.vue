<template>
  <v-layout row wrap>
    <v-flex sm8>
      <h1 class="headline mb-2">{{ group.name }}</h1>
      <v-alert
              :value="group.closed === true"
              type="warning"
      >
        Group status is closed!
      </v-alert>
      <v-alert
              :value="!messagesCount()"
              type="success"
              v-if="group.closed === false"
      >
        What's up? Send first message to group!
      </v-alert>
      <v-card sm8 style="height: 60vh;overflow-y: auto;" class="scroll-y" ref="chatBox">
        <v-container grid-list-xl fluid row>
          <template v-for="(message, index) in group.messages">
            <v-layout
                    :key="index"
                    row
                    v-if="!message.invoker"
            >
              <v-flex>
                <small>
                  <v-card-text class="black--text text-xs-center py-0">
                    <router-link :to="{ name: 'UserProfile', params: { id: message.invoker_id } }">{{ message.invoker_name }}</router-link>,
                    {{ message.text.toLocaleLowerCase() }}
                  </v-card-text>
                </small>
              </v-flex>
            </v-layout>
            <v-layout
                    :key="index"
                    row
                    v-else-if="message.invoker_id === user.id"
            >
              <v-flex sm11 offset-sm1>
                <v-card color="blue darken-1" style="border-radius: 28px">
                  <v-card-text class="white--text">
                    {{ message.text }}
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout
                    :key="index"
                    row
                    v-else
            >
              <v-flex sm11>
                <v-list-tile-title>
                  <router-link :to="{ name: 'UserProfile', params: { id: message.invoker_id } }">
                    {{ message.invoker_name }}
                  </router-link>
                </v-list-tile-title>
                <v-card :color="(isAdmin(message.invoker_id) ? 'warning' : 'grey lighten-5')" style="border-radius: 28px">
                  <v-card-text class="black--text">
                    {{ message.text }}
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </template>
        </v-container>
      </v-card>
      <v-textarea
              name="message"
              label="Your message"
              class="mt-2 mb-0"
              solo
              auto-grow
              rows="2"
              v-model="message"
              @keyup.enter="sendMessage"
              :disabled="group.closed"
              hide-details
      ></v-textarea>
      <div>
        <v-btn
                round
                color="primary"
                class="right mx-0"
                @click="sendMessage"
                :disabled="group.closed"
        >
          Send
        </v-btn>
        <v-btn
                round
                :color="`${(group.closed ? 'success' : 'error' )}`"
                class="mx-0"
                @click="changeStateGroup"
                v-if="isAdmin(user.id)"
        >
          {{ `${(group.closed ? 'Open group' : 'Close group' )}` }}
        </v-btn>
        <v-btn
                round
                color="warning"
                @click="leaveGroup"
                v-if="group.unlisted"
        >
          LEAVE
        </v-btn>
      </div>
    </v-flex>
    <v-flex sm4>
      <template v-if="!manageMembersTab">
        <v-btn round color="primary" class="right" v-if="group.unlisted && isAdmin(user.id)" @click="manageMembersTab = true">
          Edit members
        </v-btn>
        <v-btn round color="primary" class="right" v-if="isAdmin(user.id)" @click="editNameModal = true">
          Edit name
        </v-btn>
        <div style="display: inline-block;width: 100%;">
          <v-list class="py-0">
            <v-list-group
                    v-for="(tab, index) in membersTab()"
                    :key="index"
                    v-model="tab.active"
                    :prepend-icon="tab.icon"
                    v-if="tab.expr"
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ tab.name }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <member-chip v-for="(member, i) in tab.array" :key="i" :member="member" :online="tab.online"></member-chip>
            </v-list-group>
          </v-list>
        </div>
      </template>
      <template v-else>
        <div>
          <v-btn round color="success" block @click="editGroupMembers">
            Save
          </v-btn>
          <v-btn round color="primary" block @click="resetTab">
            Back
          </v-btn>
        </div>
        <v-chip
                v-for="(member, i) in addMembers"
                color="green"
                text-color="white"
                :key="i"
        >{{ member.user_name }}
        </v-chip>
        <v-chip
                v-for="(member, i) in removeMembers"
                color="error"
                text-color="white"
                :key="i"
        >{{ member.user_name }}
        </v-chip>
        <div>
          <v-text-field
                  v-model="search"
                  label="Search user"
                  required
                  @keyup="searchUser"
          ></v-text-field>
          <v-list v-if="search.length">
            <v-list-tile v-for="user in searchUsers" :key="user._id">
              <template v-if="isInGroup(user._id)">
                <v-list-tile-title>
                  {{ user.username }}
                </v-list-tile-title>
                <v-btn round color="error" small @click="sliceMember(user)">Delete</v-btn>
              </template>
              <template v-else>
                <v-list-tile-title>
                  {{ user.username }}
                </v-list-tile-title>
                <v-btn round color="primary" small @click="pushMember(user)">Invite</v-btn>
              </template>
            </v-list-tile>
          </v-list>
        </div>
      </template>
    </v-flex>
    <edit-group-name-modal
            :open="editNameModal"
            :group="group"
            @modalClose="editNameModal = false"
            @save="editGroupName"
    ></edit-group-name-modal>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { GroupService, UserService } from '../../services'
  import GroupJoin from '../../components/groupCard'
  import MemberChip from '../../components/memberChip'
  import EditGroupNameModal from '../../components/editGroupNameModal'

  export default {
    components: {
      EditGroupNameModal,
      MemberChip,
      GroupJoin
    },
    name: 'group-chat',
    computed: mapGetters({
      user: 'getUser',
      isConnected: 'socketConnected',
      isAuth: 'socketAuth'
    }),
    data: () => ({
      message: '',
      group: {
        messages: []
      },
      onlineMembers: [],
      onlineActivator: true,
      editNameModal: false,
      editMembersModal: false,
      manageMembersTab: false,
      addMembers: [],
      removeMembers: [],
      search: '',
      searchUsers: []
    }),
    created () {
      this.$options.sockets.group_updated_members = (data) => {
        if (!this.isInGroup(this.user.id)) return this.$router.push({ name: 'Home' })
        if (data.message) this.pushMessage(data.message)
        if (data.members) this.group.members = data.members
        if (data.closed) this.group.closed = data.closed
        if (data.online) this.onlineMembers = data.online
      },
        this.$options.sockets.group_updated_name = (data) => {
          if (data.message) this.pushMessage(data.message)
          if (data.name) this.group.name = data.name
        },
        this.$options.sockets.group_updated_status = (data) => {
          if (data.message) this.pushMessage(data.message)
          this.group.closed = data.closed
        },
        this.$options.sockets.message_added = (data) => {
          this.pushMessage(data)
        },
        this.$options.sockets.join_room = () => {
          this.fetchGroup()
        },
        this.$options.sockets.member_actived = (data) => {
          this.onlineMembers.push({ user_id: data.invoker_id, user_name: data.invoker_name })
          if (!this.group.closed) this.pushMessage(data)
        },
        this.$options.sockets.member_inactived = (data) => {
          let index = this.onlineMembers.findIndex(m => m.user_id === data.invoker_id)
          this.onlineMembers.splice(index, 1)
          if (!this.group.closed) this.pushMessage(data)
        }
    },
    mounted () {
      this.fetchGroup()
    },
    updated () {
      this.scrollToEnd()
    },
    beforeDestroy () {
      this.$socket.emit('member_quit')
    },
    methods: {
      fetchGroup () {
        GroupService.fetch(this.$route.params.id)
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => {
            if (!data.is_member) return this.$router.push({ name: 'GroupProfile', params: { id: data.group._id } })
            this.group = data.group
            this.$socket.emit('member_join', { chatGroupId: data.group._id })
          })
          .catch(() => {
            // todo toast message
            this.$router.push({ name: 'Home' })
          })
      },
      leaveGroup () {
        this.$socket.emit('member_leave', { chatGroupId: this.$route.params.id })
        this.$router.push({ name: 'GroupProfile', params: { id: this.$route.params.id } })
      },
      editGroupName (value) {
        this.$socket.emit('group_update_name', {
          chatGroupId: this.$route.params.id,
          newName: value
        })
      },
      searchUser () {
        UserService.search(this.search)
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => this.searchUsers = data)
      },
      isAdmin (id) {
        return this.group.admin_id === id
      },
      isInGroup (user_id) {
        return this.group.members.findIndex(m => m.user_id === user_id) > -1
      },
      editGroupMembers () {
        if (!this.addMembers.length && !this.removeMembers.length) return
        this.$socket.emit('group_update_members', {
          chatGroupId: this.$route.params.id,
          updatedMembers: this.group.members
        })
        this.manageMembersTab = false
        this.addMembers = []
        this.removeMembers = []
      },
      changeStateGroup () {
        this.$socket.emit('group_update_status', {
          chatGroupId: this.$route.params.id,
          closed: !this.group.closed
        })
      },
      sendMessage () {
        if (!this.message.replace(/\s+/g, '').length) return
        this.$socket.emit('message_add', { message: this.message })
        this.message = ''
      },
      scrollToEnd () {
        this.$refs.chatBox.$el.scrollTo({
          top: this.$refs.chatBox.$el.scrollHeight + 1000,
          behavior: 'smooth'
        })
      },
      membersTab () {
        return [
          {
            icon: 'accessibility_new',
            name: 'Active Members',
            array: this.onlineMembers,
            online: true,
            active: true,
            expr: true
          },
          {
            icon: 'accessibility',
            name: 'Members',
            array: this.group.members,
            online: false,
            expr: this.group.unlisted
          }
        ]
      },
      resetTab () {
        this.manageMembersTab = false
        if (this.addMembers.length || this.removeMembers.length) this.fetchGroup(this.$route.params.id)
        this.addMembers = []
        this.removeMembers = []
      },
      pushMember ({ _id, username }) {
        let member = { user_id: _id, user_name: username }
        let indexMembers = this.group.members.findIndex(m => m.user_id === member.user_id)
        let indexAddMembers = this.addMembers.findIndex(m => m.user_id === member.user_id)
        if (indexMembers < 0 && indexAddMembers < 0) {
          let indexRemoveMembers = this.removeMembers.findIndex(m => m.user_id === member.user_id)
          this.removeMembers.splice(indexRemoveMembers, 1)
          this.addMembers.push(member)
          this.group.members.push(member)
        }
      },
      sliceMember ({ _id, username }) {
        let member = { user_id: _id, user_name: username }
        let indexMembers = this.group.members.findIndex(m => m.user_id === member.user_id)
        let indexRemoveMembers = this.removeMembers.findIndex(m => m.user_id === member.user_id)
        if (indexMembers > -1 && indexRemoveMembers < 0) {
          let indexAddMembers = this.addMembers.findIndex(m => m.user_id === member.user_id)
          this.addMembers.splice(indexAddMembers, 1)
          this.group.members.splice(indexMembers, 1)
          this.removeMembers.push(member)
        }
      },
      messagesCount () {
        return this.group.messages
          .filter(message => message.invoker)
          .length
      },
      formatText (text) {
        return text
        //return text.replace(/\s+/g, "<br>")
      },
      pushMessage (data) {
        if (data.invoker_id === this.user.id) data.invoker_name = 'You'
        this.group.messages.push(data)
      }
    }
  }
</script>

<style scoped>
  .v-card__text {
    word-wrap: break-word;
  }
</style>