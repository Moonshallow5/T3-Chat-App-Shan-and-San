<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="login-card" style="width: 100%;">
        <v-card-title class="title"> Login Here </v-card-title>
        <v-card-subtitle class="subtitle">
        Don't have an account?
          <span @click="register" class="register-link ">
           Register
          </span>
        </v-card-subtitle>
  
        <v-form @submit.prevent="login">
          <!-- Email Input -->
          <div class="input-group">
            <label>Username</label>
            <v-text-field
              v-model="username"
              required
              hide-details
              outlined
              dense
              style="color: black;"
            />
          </div>
  
          <!-- Password Input -->
          <div class="input-group">
            <label>Password</label>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="togglePassword"
              hide-details
              outlined
              dense
              style=" color: black;"
            />
          </div>
  
          <!-- Remember Me & Forgot Password -->
          <!-- <v-row class="remember-forgot" no-gutters>
            <v-col cols="6" class="d-flex align-center">
              <v-checkbox
                v-model="rememberMe"
                :label="$t('login.rememberMe')"
                class="checkbox-container"
                hide-details
                dense
              />
            </v-col>
            <v-col cols="6" class="d-flex align-center justify-end">
              <span @click="forgotPassword" class="forgot-password hover-effect">
                {{ $t("login.forgotPassword") }}
              </span>
            </v-col>
          </v-row> -->
          <v-btn
            style="
              text-transform: none !important ;
              background-color: #3e4658;
              color: white;
            "
            type="submit"
            block
            :loading="loading['login']"
          >
            Sign in
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import { API_URL } from "@/configs";
  import Ajax from "@/scripts/axios.js";  
  
  export default {
    name:"login",
    computed: {
      ...mapState(["loading"]),
    },
    data() {
      return {
        username: "",
        password: "",
        
        showPassword: false,
      };
    },
    methods: {
      async login() {
        if (!this.username || !this.password) {
          this.$toast.error("Please fill in both username and password.");
          return false;
        }
  
        try {
          this.$store.commit("setLoading", "login");
          const response = await Ajax('auth/login',
          {
            username: this.username,
            password: this.password,
          });

          // await axios.post(`${API_URL}/auth/login`, {
          //   username: this.username,
          //   password: this.password,
          // });
  
          console.log("Response:", response);
  
          if (response.data?.token) {
            this.$store.commit("setToken", response.data.token);
            this.$store.commit("setUser", { id: parseInt(response.data.user_id), username: this.username, name: response.data.name });
            this.$toast.success("Login successful!");
            this.$router.replace('/chat');
          } 
        } catch (err) {
          console.error("Login error:", err);
        } finally {
          this.$store.commit("stopLoading", "login");
        }
      },
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      register() {
        this.$router.push("/register");
      },

    },
  };
  </script>
  
  <style scoped>
  

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 90%;
    margin: auto;
  }
  
  .title {
    font-weight: bold;
    color: black;
  }
  
  .subtitle {
    color: gray;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  
  .register-link {
    text-decoration: underline;
    color: #3f51b5;
    cursor: pointer;
    display: inline-block;
  }
  
  .input-group {
    text-align: left;
    margin-bottom: 16px;
  }
  
  .input-group label {
    font-weight: 500;
    margin-bottom: 4px;
    color: grey;
  }
  
  </style>
  