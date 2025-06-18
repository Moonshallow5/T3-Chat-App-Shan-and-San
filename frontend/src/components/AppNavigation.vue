<template>
<v-layout>
    <v-navigation-drawer v-model="drawer" permanent :width="300" style="background-color: #2b2431">

      <template v-slot:prepend>
        <v-row class="align-center" style=" padding: 5px; margin-top: 20px;">
    <!-- Drawer button (left-aligned) -->


    <!-- Heading (center-aligned) -->
    <v-col cols="12" class="d-flex text-center poppins" style="justify-content: center; text-align: center;">
      <h2 >T3.chat</h2>
    </v-col>
  </v-row>


  <v-row class="align-center"  style="padding-left: 10px; padding-right: 10px;">
    <v-col cols="12" >
      <v-btn class="green_text font-weight-bold plus-jakarta-sans text-margin"
             density="comfortable"
             rounded
             size="large"
             style="text-transform: none; width: 100%;"
             @click="newChat">
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

      <!-- Add chat sessions list -->
      <v-list density="compact" class="pt-2 chat-sessions-list" style="height: calc(100vh - 300px); overflow-y: auto;">
        <v-list-item
          v-for="(session, index) in chatSessions"
          :key="session.id"
          :value="null"
          class="green_text plus-jakarta-sans session-item"
          :class="{
            'editing': editingIndex === index,
            'active-title': session.id === $store.state.session_id,
            'inactive-title': session.id !== $store.state.session_id
          }"
          style="font-weight: 500; font-size: 14px;"
          @click="editingIndex !== index && openChat(session)"
        >
          <template v-slot:title>
            <div v-if="editingIndex !== index" class="d-flex align-center justify-space-between w-100">
              <span :title="session.title" class="text-truncate session-title">{{ session.title }}</span>
              <v-menu :close-on-content-click="false" location="end" :z-index="9999" min-width="135">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" size="x-small" v-bind="props" @click.stop class="menu-button">
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click.stop="startEdit(index)">
                    <template v-slot:prepend>
                      <v-icon class="ma-0 pa-0">mdi-rename-outline</v-icon>
                    </template>
                    <v-list-item-title style="position: absolute; top: 25%; left: 40%;">Rename</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click.stop="confirmDelete(session.id)">
                    <template v-slot:prepend>
                      <v-icon class="">mdi-delete-outline</v-icon>
                    </template>
                    <v-list-item-title class="red-hover" style="position: absolute; top: 25%; left: 40%;">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div v-else style="position: relative;">
              <v-text-field v-model="session.title" dense hide-details autofocus @keyup.enter="saveEdit(index)"
                @keyup.space="session.title += ' '" @keyup.esc="editingIndex = null">
              </v-text-field>
            </div>
          </template>
        </v-list-item>
      </v-list>
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
    <v-dialog v-model="dialogDelete" class="mx-auto my-8" elevation="1" width="400px" max-width="90%">
    <v-card class="poppins">

      <v-card-item>
        <v-card-title class="poppins">
          Are you sure?
        </v-card-title>
        <v-card-subtitle class=" mb-n1 plus-jakarta-sans">
          You will not be able to recover this chat
        </v-card-subtitle>
      </v-card-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red" @click="closeDeleteDialog" style="text-transform: none ;">Cancel</v-btn>
        <v-btn text color="dark_gray_green" @click="deleteSession" style="text-transform: none ;">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
    <v-icon :icon="drawer ? 'mdi-arrow-left-thin-circle-outline' : 'mdi-arrow-right-thin-circle-outline'" size="30" class="fixed-btn"  @click="drawer = !drawer"   ></v-icon>

    <v-main style="height: 100vh; ">
    

    
    <div style="flex: 1; overflow-y: auto; background-color: #363942;">
                <slot></slot>
            </div>
            </v-main>

</v-layout>
<Loading v-if="loading['main']" />
</template>

<script>
import { mapState } from 'vuex';
import { timeAgo } from "@/scripts/common.js";
import Ajax from '@/scripts/axios';
import Loading from './Loading.vue';

export default{

    name:"AppNavigation",

    data(){
        return{
        drawer:true,
        editingIndex: null,
        dialogDelete: false,
        originalTitle: '',
        sessionId: null,
        }
    },

    computed: {
        ...mapState(['chatSessions', 'pageTitle','session_id','user','loading'])
    },
    components:{
      Loading
    },

    watch: {
        '$store.state.pageTitle': {
            handler(newTitle) {
                if (newTitle) {
                    // Find the current session and update its title
                    const currentSession = this.chatSessions.find(s => s.id === this.$store.state.session_id);
                    if (currentSession) {
                        currentSession.title = newTitle;
                    }
                }
            },
            immediate: true
        }
    },

    methods: {
        formatDate(timestamp) {
            return timeAgo(timestamp);
        },
        async loadChatSessions() {
            try {
                const response = await Ajax(`chat/sessions?user_id=${this.user.id}`, {}, 'GET');
                this.$store.commit('setChatSessions', response.data);
            } catch (error) {
                console.error('Error loading chat sessions:', error);
                this.$toast.error("Failed to load chat sessions");
            }
        },
        confirmDelete(session_id) {
            this.sessionId = session_id;
            this.dialogDelete = true;
        },
        async deleteSession() {
            try {
                this.$store.commit("setMainLoading");
                const response = await Ajax(`chat/session/${this.sessionId}`, {
                    user_id: parseInt(this.user.id)
                }, "DELETE");

                // If we're deleting the current session, clear the store
                if (this.sessionId === this.$store.state.session_id) {
                    this.$store.commit("clearSessionId");
                    this.$store.commit("clearMessage");
                    this.$store.commit("clearPageTitle");
                    this.$router.push('/chat');
                }

                // Remove from chatSessions array
                const index = this.chatSessions.findIndex(session => session.id === this.sessionId);
                if (index !== -1) {
                    this.chatSessions.splice(index, 1);
                }

                this.$toast.success("Session deleted successfully");
            } catch (error) {
                this.$toast.error("Failed to delete session");
            } finally {
                this.dialogDelete = false;
                this.sessionId = null;
                this.$store.commit("clearMainLoading");
            }
        },
        closeDeleteDialog() {
        this.dialogDelete = false;
        },
        
        async openChat(session) {
          if (this.editingIndex !== null) return;
          this.$store.commit("setMainLoading");
            try {
                const response = await Ajax(`chat/session/${session.id}?user_id=${this.user.id}`, {}, 'GET');
                
                // Update store with session data
                this.$store.commit('setMessages', response.data.messages);
                this.$store.commit('setPageTitle', response.data.title || 'Chat');
                this.$store.commit('setSessionId', session.id);
                
                // Navigate to chat route
                this.$router.push('/chat');
            } catch (error) {
                this.$toast.error("Failed to load chat session");
            }
            finally{
              this.$store.commit("clearMainLoading")
            }
        },

        newChat() {
            // Reset store state
            this.$store.commit("clearSessionId")
            this.$store.commit("clearMessage")
            this.$store.commit("clearPageTitle")
            this.$router.push('/chat');
        },
        startEdit(index) {
          this.editingIndex = index;
          this.originalTitle = this.chatSessions[index].title;
        },
    
    
    async saveEdit(index) {
      try {
        this.$store.commit("setMainLoading");
        const session_id = this.chatSessions[index].id;
        const title = this.chatSessions[index].title;

        const response = await Ajax(`chat/session/${session_id}/title`, {
          title: title,
          user_id: parseInt(this.user.id)
        }, "PUT");

        // Update the store with new title
        this.$store.commit('setPageTitle', title);
        
        this.$toast.success("Title updated successfully");
      } catch (error) {
        // Revert the title in the UI if update fails
        this.chatSessions[index].title = this.originalTitle;
      } finally {
        this.editingIndex = null;
        this.$store.commit("clearMainLoading");
      }
    },
    },
    mounted() {
        this.loadChatSessions();
    }
}

</script>

<style scoped>

.session-item.active-title {
  background-color:#c0c0c0!important;
  font-weight: bold !important;
}
.session-item {
  position: relative;
}
.fixed-btn {
  position: absolute;
  top: 20px;
  left: 260px;
  z-index: 1100;
  transition: left 0.3s ease-in-out;
}

.v-navigation-drawer:not(.v-navigation-drawer--active) + .fixed-btn {
  left: 1px;
}

.editing {
  background: transparent !important;  /* Removes hover background */
}

.editing:hover {
  background: transparent !important;  /* Ensures no hover effect */
  cursor: default;
}

.editing .v-text-field {
  cursor: default;  /* Ensures text cursor on the input field */
}

.session-title {
  flex: 1;
  margin-right: 8px;
}

.menu-button {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.session-item:hover .menu-button {
  opacity: 1;
}

</style>