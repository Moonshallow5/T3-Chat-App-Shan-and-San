<template>
  <AppNavigation>
    <v-container fluid>
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
  .avatar-wrapper {
    position: relative;
    display: inline-block;
    overflow: hidden; /*prevents avatar from overlapping into menu on mobile view*/
  }
  
  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }
  
  .avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
    cursor: pointer;
  }
  
  .green-text {
    color: #475569;
    font-weight: 700;
  }
  
  </style>