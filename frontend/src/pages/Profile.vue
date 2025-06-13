<template>
  <AppNavigation>
    <v-container class="chat-app" fluid>
      <h3  class="text-center poppins green-text">Profile Settings</h3>
  
      <!-- Show user profile with avatar on left, name and email on right, name and email editable, have a save button and a button to edit password -->
      <v-row class="mt-5"  >
  
        <v-col cols="12" md = "6" offset-md="3" >
          <v-text-field label="Name" v-model="profile.name" disabled ></v-text-field>
          <v-text-field label="Username" v-model="profile.username" disabled></v-text-field>    
        </v-col>
      </v-row>

    </v-container>
  
  </AppNavigation>
  </template>
    
  <script>
    import { mapState } from "vuex";
    import Ajax from "@/scripts/axios.js";
    import AppNavigation from "@/components/AppNavigation.vue";  
    export default {
      name: "Settings",
 
      data() {
        return {
  
          profile: {
              name: "",
              username: ""
          },
  
        };
      },
      computed: {
        ...mapState(["user"]),

      },
      methods: {
     
      },
      mounted: function () {
        this.profile.name = this.user.name
        this.profile.username = this.user.username
      



      }
    };
  </script>
    
  <style scoped>
   .chat-app {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    flex: 1;
    border-radius: 15px;
  }
  
  
  </style>