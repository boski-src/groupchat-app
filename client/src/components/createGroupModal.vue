<template>
  <v-dialog v-model="open" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create own group</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-validate="'required|min:3|max:64'" label="Group name" name="name" v-model="data.name"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-switch :label="`Group type: ${(data.unlisted ? 'Private' : 'Public' )}`" v-model="data.unlisted"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn round color="blue darken-1" flat @click="$emit('modalClose')">Close</v-btn>
        <v-btn round color="blue darken-1" flat @click="createGroup">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'create-group-modal',
    data: () => ({
      data: {
        name: '',
        unlisted: true
      }
    }),
    props: {
      open: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    methods: {
      createGroup () {
        this.$emit('createGroup', this.data)
      }
    }
  }
</script>

<style scoped>

</style>