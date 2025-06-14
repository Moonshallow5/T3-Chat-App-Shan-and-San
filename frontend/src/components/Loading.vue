<template>
    <div class="pa-4 text-center">
      <v-dialog v-model="dialog" max-width="320" persistent>
        <v-list class="py-2" color="dark_gray_green" elevation="12" rounded="lg">
          <v-list-item prepend-avatar="../assets/logo.jpg" title="Loading...">
            <template v-slot:append>
              <v-progress-circular
                color="dark_gray_green"
                indeterminate="disable-shrink"
                size="32"
                width="2"
              ></v-progress-circular>
            </template>
          </v-list-item>
        </v-list>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: true,
      };
    },
  
    watch: {
      dialog(val) {
        if (!val) return;
  
        setTimeout(() => (this.dialog = false), 4000);
      },
    },
  };
  </script>
  