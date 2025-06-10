<template>
  <AppNavigation>
    <v-container  fluid class="chat-app d-flex flex-column fill-height pa-0">

      

      <v-row  class="text-h5 poppins mb-5"
      style="position: absolute; bottom: 40vh; display: flex; justify-content: center; align-items: center; width: 100%;">
      <span class="d-flex justify-center align-center font-weight-medium"
        :style="{ color: $vuetify.theme.global.current.colors.green_button }"> Hi, how may I help you today? </span>
    </v-row>


    <v-row  no-gutters class="message-container" style=" 
        position: absolute;
        bottom: 30vh;
        
        width: 70%;
        ">
     
      <v-col>
        <input id="message" v-model="message" type="text" class="custom-input" placeholder="Ask me anything..." style="width: 80%;height: 100%;"
        >
      </v-col>
      </v-row>
    </v-container>

  </AppNavigation>
</template>


<script>
import AppNavigation from '@/components/AppNavigation.vue';
  export default{
    name:'HelloWorld',
    data(){
      return{
        message:"",
      }
    }


  }
</script>


<style scoped>

.chat-app {
    flex: 1;
    height: 100%;
    border-radius: 15px;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .message-container {
    width: 100%; 
    height: 50px; 
    background-color: white; 
    border-radius: 25px; 
    align-items: center; 
    padding: 0 7px;
    border: 1px solid #ccc;
  }

  .custom-input {
    border: none;
    padding: 10px;
    font-size: 16px;
  color: #1a1a1a;

  }

  .custom-input::selection {
    background: #3065cf;
    color: black;
  }

  .custom-input:focus {
    border: none;
    outline: none;
  }
</style>
