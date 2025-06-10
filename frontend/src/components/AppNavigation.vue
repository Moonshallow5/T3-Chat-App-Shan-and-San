<template>
<v-layout>
    <v-navigation-drawer v-model="drawer" floating :width="300" style="background-color: #2b2431">

      <template v-slot:prepend>
        <v-row class="align-center" style=" padding: 5px;">
    <!-- Drawer button (left-aligned) -->
    <v-col cols="2" class="text-left ">
      <v-btn icon variant="plain" @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-col>

    <!-- Heading (center-aligned) -->
    <v-col cols="8" class="text-center">
      <h2 style="margin: 0;">T3.chat</h2>
    </v-col>
  </v-row>


  <v-row class="align-center"  style="padding-left: 10px;">
    <v-col cols="12" >
      <v-btn class="green_text font-weight-bold plus-jakarta-sans text-margin"
             density="comfortable"
             rounded
             size="large"
             style="text-transform: none; width: 85%;">
        <v-icon left class="mr-2" size="17.5">mdi-plus</v-icon>
        <span class="text-margin mr-2" style="font-size: 14px;">New Chat</span>
      </v-btn>
    </v-col>
  </v-row>
       
     
      <v-list-item class="green_text plus-jakarta-sans mt-3" style="font-weight: 600; font-size: 14px;"
        value="Your Conversations">
        <template v-slot:prepend>
          <v-icon class="icon-color">mdi-message-outline</v-icon>
        </template>
        Your Conversations</v-list-item>
      <v-divider></v-divider>
    </template>
    


    </v-navigation-drawer>
    <v-main style="height: 100vh; display: flex; flex-direction: column">

    <v-app-bar >

    <!-- <v-spacer></v-spacer> -->

    <v-btn icon>
      <v-icon @click.stop="drawer = !drawer">mdi-menu</v-icon>
    </v-btn>
    </v-app-bar>
    

    
    <div style="flex: 1; overflow-y: auto">
                <slot></slot>
            </div>
            </v-main>

</v-layout>
</template>

<script>

export default{

    name:"AppNavigation",

    data(){
        return{
        drawer:false,
        }
    }
}

</script>

<style scoped>


</style>