<template>
<v-layout>
    <v-navigation-drawer v-model="drawer" floating :width="300" style="background-color: #2b2431">

      <template v-slot:prepend>
        <v-row class="align-center" style=" padding: 5px; margin-top: 20px;">
    <!-- Drawer button (left-aligned) -->


    <!-- Heading (center-aligned) -->
    <v-col cols="12" class="d-flex text-center" style="justify-content: center; text-align: center;">
      <h2 >T3.chat</h2>
    </v-col>
  </v-row>


  <v-row class="align-center"  style="padding-left: 10px; padding-right: 10px;">
    <v-col cols="12" >
      <v-btn class="green_text font-weight-bold plus-jakarta-sans text-margin"
             density="comfortable"
             rounded
             size="large"
             style="text-transform: none; width: 100%;">
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

    <template v-slot:append>
      <v-list density="compact" class="pt-4" nav>
        <v-list-item   class="green_text plus-jakarta-sans" prepend-icon="mdi-cog-outline"
          style="font-weight: 550; font-size: 14px;" value="Settings"
          @click="this.$router.push(`/settings`)">Settings</v-list-item>
        <VDivider></VDivider>
        </v-list>
    </template>

    


    </v-navigation-drawer>
    <v-icon :icon="drawer ? 'mdi-arrow-left-thin-circle-outline' : 'mdi-arrow-right-thin-circle-outline'" size="30" class="fixed-btn"  @click="drawer = !drawer"   ></v-icon>

    <v-main style="height: 100vh; ">
    

    
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
        drawer:true,
        }
    }
}

</script>

<style scoped>

.fixed-btn{

position: absolute;
top: 20px;
left: 260px; /* Moves button just outside drawer */
z-index: 1100;
transition: left 0.3s ease-in-out;

}
.v-navigation-drawer:not(.v-navigation-drawer--active) + .fixed-btn {
left: 1px;
}
</style>