<template>
  <AppNavigation>
    <v-container  fluid class="chat-app" ref="chatContainer">
      <v-container v-if="pageTitle !== ''" fluid class="chat-container" ref="chatContainer">
      <v-row v-for="(message, index) in messages" class="mb-3" :key="index">
        <v-row class="align-start mb-4" v-if="message.role === 'user'">
          <v-col cols="auto">
            <v-avatar>
              <v-img cover :src="avatarImage" alt="Avatar" />
            </v-avatar>
          </v-col>
          <v-col>
            <div class="d-flex align-center">
              <strong>You</strong> <span style="color: grey;" class="ml-2">{{ timeAgo(message.created_at) }}</span>
            </div>
            <div class="message-box-user mt-1" style="color: black;">{{ message.content }}</div>
          </v-col>
        </v-row>

        <v-row class="align-start mb-4" v-if="message.role === 'persona'">
          <v-col>
            <div class="d-flex align-center justify-end">
              <strong>{{ chatbot_name }}</strong> <span style="color: grey;" class="ml-2">{{ timeAgo(message.created_at) }}</span>
            </div>
            <div class="message-box-persona mt-1 d-flex justify-end">
              <div v-html="message.content" class="custom-list" style="text-align: right;"></div> 
            </div>
          </v-col>
          <v-col cols="auto">
            <v-avatar>
              <v-img cover :src="chatbot_avatar" alt="Avatar" />
            </v-avatar>
          </v-col>
        </v-row>
      </v-row>
    </v-container>

      

      <v-row v-if="pageTitle == ''"  class="text-h5 poppins mb-5"
      style="position: absolute; bottom: 40vh; display: flex; justify-content: center; align-items: center; width: 100%;">
      <span class="d-flex justify-center align-center font-weight-medium"
        :style="{ color: $vuetify.theme.global.current.colors.green_button }"> Hi, how may I help you today? </span>
    </v-row>

    <v-row v-if="pageTitle !== ''" no-gutters class="message-container" style="position: fixed; bottom: 10vh; width: 95%;">
      <v-col>
        <input type="text" class="custom-input" placeholder="Ask me anything..." style="width: 100%;height: 100%;"
          v-model="message_input" @keyup.enter="sendMessage">
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-arrow-up" @click="sendMessage" color="#00C3B2" size="x-small" class="ml-2"
          style="color: white;"></v-btn>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="message-container" style="position: fixed; bottom: 30vh; width: 70%;">
      <v-col>
        <input type="text" class="custom-input" placeholder="Ask me anything..." style="width: 100%;height: 100%;"
          v-model="message_input" @keyup.enter="sendMessage">
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-arrow-up" @click="sendMessage" color="#00C3B2" size="x-small" class="ml-2"
          style="color: white;"></v-btn>
      </v-col>
    </v-row>
    </v-container>

  </AppNavigation>
</template>


<script>
import AppNavigation from '@/components/AppNavigation.vue';
import { mapState } from 'vuex';
import Ajax from '@/scripts/axios';
import { timeAgo } from "@/scripts/common.js";
import avatarImage from '@/assets/avatar.webp';
import chatbot_avatar from '@/assets/default_avatar.png';
export default{
  name:'Chat',
  components: {
    AppNavigation
  },
  data(){
    return{
      avatarImage,
      message_input:"",
      currentSessionId: null,
      messages: [],
      chatbot_name:'T3 chat',
      pageTitle:'',
      chatbot_avatar,
    }
  },
  computed: {
    ...mapState(['user', 'chatSessions'])
  },
  
  watch: {
    '$route.params.sessionId': {
      immediate: true,
      handler(newSessionId) {
        if (newSessionId) {
          this.loadChatSession(newSessionId);
        } else {
          this.currentSessionId = null;
          this.messages = [];
          this.pageTitle = '';
          this.$store.commit('setMessages', []);
          this.$store.commit('setPageTitle', '');
        }
      }
    }
  },

  methods: {
    timeAgo,
    async createNewSession() {
      try {
        const response = await Ajax('chat/session', {
          user_id: parseInt(this.user.id)
        });
        this.currentSessionId = response.data.session_id;
        this.$store.commit('setSessionId', this.currentSessionId);
        
        const chatSession = {
          id: this.currentSessionId,
          title: '',
          last_message: '',
          updated_at: new Date().getTime()
        };
        this.$store.commit('appendChatSessions', chatSession);
        
        // Update route to include session ID
        this.$router.push(`/chat/${this.currentSessionId}`);
      } catch (error) { 
        this.$toast.error("Failed to create chat session");
      }
    },

    async loadChatSession(sessionId) {
      try {
        const response = await Ajax(`chat/session/${sessionId}?user_id=${this.user.id}`, {}, 'GET');
        
        this.currentSessionId = sessionId;
        this.messages = response.data.messages;
        this.pageTitle = response.data.title || 'Chat';
        this.$store.commit('setPageTitle', this.pageTitle);
        this.$store.commit('setMessages', this.messages);
        
        this.scrollToBottom();
      } catch (error) {
        this.$toast.error("Failed to load chat session");
      }
    },

    scrollToBottom() {
        this.$nextTick(() => {
          const chatContainer = document.querySelector(".chat-container");
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        });
      },

    async sendMessage() {
      if (!this.message_input.trim()) return;

      try {
        // Create new session if it doesn't exist
        if (!this.currentSessionId) {
          await this.createNewSession();
        }

        const response = await Ajax('chat/message', {
          session_id: this.currentSessionId,
          user_id: parseInt(this.user.id),
          content: this.message_input,
          is_bot: false
        });

        const userMessage = {
          content: this.message_input,
          role: 'user',
          created_at: new Date().getTime()
        };

        // Add user message to messages array and store
        this.messages.push(userMessage);
        this.$store.commit('appendMessage', userMessage);

        // Update chat session title if it's the first message
        if (this.messages.length === 1) {
          const title = this.message_input.substring(0, 30) + (this.message_input.length > 30 ? '...' : '');
          this.pageTitle = title;
          this.$store.commit('updateChatSession', {
            id: this.currentSessionId,
            title: title,
            last_message: this.message_input,
            updated_at: new Date().getTime()
          });
        }

        this.message_input = "";

        // Handle bot response
        if (response.data.bot_response) {
          const botMessage = {
            content: response.data.bot_response,
            role: 'persona',
            created_at: new Date().getTime()
          };
          
          this.messages.push(botMessage);
          this.$store.commit('appendMessage', botMessage);
        }

        // Scroll to bottom after messages are added
        this.scrollToBottom();
      } catch (error) {
        this.$toast.error("Failed to send message");
      }
    }
  },
}
</script>


<style scoped>
  .chat-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 200px); 
    flex: 1;
    border-radius: 15px;
    padding-bottom: 100px; 
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  

.chat-app {
    flex: 1;
    height: 100vh;
    border-radius: 15px;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
  }
  .message-container {
    width: 100%; 
    height: 50px; 
    background-color: white; 
    border-radius: 25px; 
    align-items: center; 
    padding: 0 7px;
    border: 1px solid #ccc;
    z-index: 1;
  }

  .custom-input {
    border: none;
    padding: 10px;
    font-size: 16px;
  color: #1a1a1a;

  }
  .message-box-user {
    background-color: #F8FAFC;
    border-radius: 8px;
    padding: 12px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.2);
    display: inline-block;
    max-width: 70%;
    word-wrap: break-word;
  }

  .message-box-persona {
    background-color: rgba(127, 171, 171, 0.1);
    border-radius: 8px;
    padding: 12px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.2);
    display: inline-block;
    max-width: 70%;
    word-wrap: break-word;
    text-align: right;
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
