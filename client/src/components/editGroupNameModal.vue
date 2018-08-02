<template>
  <v-dialog v-model="open" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit name - {{ group.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                      v-validate="'required|min:3|max:64'"
                      label="Group name"
                      name="name"
                      v-model="group.name"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn round color="blue darken-1" flat @click="$emit('modalClose')">Close</v-btn>
        <v-btn round color="blue darken-1" flat @click="editGroupName">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'edit-group-name-modal',
    props: {
      group: {
        type: Object,
        required: true
      },
      open: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      editGroupName () {
        this.$emit('save', this.group.name)
      }
    }
  }
</script>

<style scoped>

</style>