<template>
  <v-container grid-list-md>
    <v-layout>
      <v-flex xs6>
        <h1 class="headline mb-2">Edit profile:</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field
                      prepend-icon="person"
                      name="name"
                      label="Profile name"
                      type="name"
                      v-validate="'min:3|max:64'"
                      :error-messages="errors.collect('name')"
                      v-model="user.profile.name"
              ></v-text-field>
              <v-text-field
                      prepend-icon="insert_link"
                      name="website"
                      label="Website"
                      type="email"
                      v-validate="'url'"
                      :error-messages="errors.collect('website')"
                      v-model="user.profile.website"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round color="primary" @click="updateProfile">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <h1 class="headline mb-2">Change password:</h1>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                      v-validate="'min:8'"
                      :error-messages="errors.collect('password')"
                      v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round color="primary" @click="updatePassword">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { AuthService } from '../services'

  export default {
    name: 'account',
    computed: mapGetters({
      user: 'getUser'
    }),
    data: () => ({
      password: ''
    }),
    methods: {
      updateProfile () {
        AuthService.UpdateProfile(this.user.profile)
          .then(response => response.data.success ? response.data.data : Promise.reject())
          .then(data => this.$store.dispatch('profile', data))
      },
      updatePassword () {
        AuthService
          .UpdatePassword({ password: this.password })
          .then(() => this.password = '')
      }
    }
  }
</script>

<style scoped>

</style>