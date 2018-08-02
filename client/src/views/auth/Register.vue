<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Register account</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
                  prepend-icon="person"
                  name="email"
                  label="Email"
                  type="email"
                  v-validate="'required|email'"
                  :error-messages="errors.collect('email')"
                  v-model="credentials.email"
          ></v-text-field>
          <v-text-field
                  prepend-icon="person"
                  name="username"
                  label="Username"
                  type="text"
                  v-validate="'required|min:3|max:64'"
                  :error-messages="errors.collect('username')"
                  v-model="credentials.username"
          ></v-text-field>
          <v-text-field
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  v-validate="'required|min:8'"
                  :error-messages="errors.collect('password')"
                  v-model="credentials.password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn round color="primary" :to="{ name: 'AuthLogin' }">Go login</v-btn>
        <v-spacer></v-spacer>
        <v-btn round color="default" @click="clearFields">Clear</v-btn>
        <v-btn round color="primary" @click="submit">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'register',
    data: () => ({
      credentials: {
        email: '',
        username: '',
        password: ''
      }
    }),
    methods: {
      submit () {
        this.$validator.validate()
          .then(result => {
            if (!result) return false
            this.$store.dispatch('register', this.credentials)
          })
      },
      clearFields () {
        this.credentials = {
          email: '',
          username: '',
          password: ''
        }
      }
    }
  }
</script>

<style scoped>

</style>