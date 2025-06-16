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
              <strong>{{user.username}}</strong> <span style="color: grey;" class="ml-2">{{ timeAgo(message.created_at) }}</span>
            </div>
            <div class="message-box-user mt-1" style="color: black;">{{ message.content }}</div>
          </v-col>
        </v-row>

        <v-row class="align-start mb-4" v-if="message.role === 'persona'">
          <v-col class="d-flex justify-end">
            <div class="d-flex flex-column align-end">
              <div class="d-flex align-center">
                <strong>{{ chatbot_name }}</strong> <span style="color: grey;" class="ml-2">{{ timeAgo(message.created_at) }}</span>
              </div>
              <div class="message-box-persona mt-1">
                <div v-html="message.content" class="custom-list"></div> 
              </div>
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


    <v-row v-show="pageTitle !== ''" align="center" justify="space-between" class="control-buttons-row" style="
        position: absolute;
        bottom: 10vh;
        left: 0;
        right: 0;
        z-index: 20;
        width: 100%;
        padding-left: 80px;
        padding-right: 16px;
      ">
      <v-col>
        <v-col>
          <div class="typing-indicator" v-if="$store.state.settings.processingMsg">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </v-col>
      </v-col>
      <v-col>
      </v-col>
    </v-row>

    <v-row v-show="pageTitle == '' " align="center" justify="space-between" class="control-buttons-row" style="
        position: absolute;
        bottom: 40vh;
        left: 13%;
        right: 0;
        z-index: 20;
        width: 100%;
        padding-left: 24px;
        padding-right: 16px;
      ">
      <v-col>
        <v-col>
          <div class="typing-indicator" v-if="$store.state.settings.processingMsg">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </v-col>
      </v-col>
      <v-col>
      </v-col>
    </v-row>


      

      <v-row v-if="pageTitle == ''" class="text-h5 poppins mb-5 welcome-message">
        <span class="d-flex justify-center align-center font-weight-medium"
          :style="{ color: $vuetify.theme.global.current.colors.green_button }"> Hi, how may I help you today? </span>
      </v-row>

      <div class="input-wrapper">
        <v-row v-if="pageTitle !== ''" no-gutters class="message-container chat-mode">
          <v-col>
            <input type="text" class="custom-input" placeholder="Ask me anything..." style="width: 100%;height: 100%;"
              v-model="message_input" @keyup.enter="sendMessage">
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-arrow-up" @click="sendMessage" color="#00C3B2" size="x-small" class="ml-2"
              style="color: white;"></v-btn>
          </v-col>
        </v-row>
        <v-row v-else no-gutters class="message-container empty-mode">
          <v-col>
            <input type="text" class="custom-input" placeholder="Ask me anything..." style="width: 100%;height: 100%;"
              v-model="message_input" @keyup.enter="sendMessage">
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-arrow-up" @click="sendMessage" color="#00C3B2" size="x-small" class="ml-2"
              style="color: white;"></v-btn>
          </v-col>
        </v-row>
      </div>
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
      chatbot_name:'T3 chat',
      pageTitle:'',
      chatbot_avatar,
    }
  },

  computed: {
    ...mapState(['user', 'chatSessions','pageTitle','session_id',"processingMsg", 'messages'])
  },

  watch: {
    messages() {
      this.scrollToBottom();
    },
    pageTitle(newValue) {
      if (newValue) {
        this.$store.commit("setPageTitle", newValue);
      }  
    },

    session_id(newValue) {
      this.$store.commit("setSessionId", newValue);
      this.currentSessionId = newValue;
      console.log('chat session watch', this.currentSessionId)
    },

    '$store.state.pageTitle': {
      handler(newTitle) {
        this.pageTitle = newTitle;
      },
      immediate: true
    }
  },

  methods: {
    timeAgo,
    async createNewSession() {
      try {
        console.log('creating new session')
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
        
      } catch (error) { 
        this.$toast.error("Failed to create chat session");
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
      this.$store.commit("setSettings", { key: "processingMsg", value: true });

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

        // Add user message to store
        this.$store.commit('appendMessage', userMessage);

        this.message_input = "";

        // Handle bot response
        if (response.data.bot_response) {
          const botMessage = {
            content: response.data.bot_response,
            role: 'persona',
            created_at: new Date().getTime()
          };
          
          // Add bot message to store
          this.$store.commit('appendMessage', botMessage);

          // Only update page title if we don't have one yet (new chat)
          if (response.data.session_title && !this.pageTitle) {
            this.$store.commit('setPageTitle', response.data.session_title);
            this.$store.commit('setSessionId', this.currentSessionId);
          }
        }
        this.$store.commit("setSettings", { key: "processingMsg", value: false });
      } catch (error) {
        this.$toast.error("Failed to send message");
      }
    },
  },
  beforeUnmount(){
    this.$store.commit("clearSessionId");
    this.$store.commit("clearMessage");
    this.$store.commit("clearPageTitle");
  },

  mounted() {
    if (this.$store.state.pageTitle && this.session_id) {
      this.pageTitle = this.$store.state.pageTitle;
      this.currentSessionId=this.session_id
      this.$store.commit("setPageTitle", this.pageTitle);
    }
    console.log('chat session', this.currentSessionId)

    console.log('Current user:', this.user);
    console.log('messages yo',this.messages)
    this.scrollToBottom();
  }
}
</script>


<style scoped>
  .chat-app {
    flex: 1;
    height: 100vh;
    border-radius: 15px;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .chat-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 380px);
    flex: 1;
    border-radius: 15px;
    padding-bottom: 100px;
    margin-bottom: 20px;
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .welcome-message {
    position: absolute;
    bottom: 50vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .input-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background-color: #363942;
  }

  .message-container {
    background-color: white;
    border-radius: 25px;
    align-items: center;
    padding: 0 7px;
    border: 1px solid #ccc;
    z-index: 1;
    transition: all 0.3s ease;
    margin: 0 auto;
  }

  .message-container.chat-mode {
    width: 70%;
    height: 50px;
  }

  .message-container.empty-mode {
    width: 70%;
    height: 50px;
    margin-bottom: 30vh;
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
  }

  .custom-input::selection {
    background: #3065cf;
    color: black;
  }

  .custom-input:focus {
    border: none;
    outline: none;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(128, 128, 128, 0.5);
    padding: 10px;
    border-radius: 32px;
    width: 72px;
    height: 36px;
  }

  .dot {
    width: 4px;
    height: 4px;
    margin: 0 3px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1s infinite ease-in-out;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  .dot:nth-child(4) {
    animation-delay: 0.6s;
  }

  .dot:nth-child(5) {
    animation-delay: 0.8s;
  }

  .dot:nth-child(6) {
    animation-delay: 1s;
  }

  .custom-list {
    list-style-position: inside;
  }

  ::v-deep(.custom-list p) {
    display: inline;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }

    40% {
      transform: scale(1);
    }
  }

</style>
