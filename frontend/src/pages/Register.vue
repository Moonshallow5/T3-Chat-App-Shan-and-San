<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="register-card" style="width: 100%;">
        <v-card-title class="title">Register Here</v-card-title>
        <v-card-subtitle class="subtitle">
          Already have an account?
          <span @click="login" class="register-link ">
            Login
          </span>
        </v-card-subtitle>

        <v-form @submit.prevent="register">
          <!-- Email -->
          <div class="input-group">
            <label >Username</label>
            <v-text-field
              v-model="username"
              required
              hide-details
              outlined
              dense
              style=" color: black;"
            />
          </div>
          <div class="input-group">
            <label >Name</label>
            <v-text-field
              v-model="name"
              required
              hide-details
              outlined
              dense
              style=" color: black;"
            />
          </div>

          <!-- Password -->
          <div class="input-group">
            <label >Password</label>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              required
              hide-details
              outlined
              dense
              style=" color: black;"
            />
          </div>

          <!-- Confirm Password -->
          <div class="input-group">
            <label>Confirm Password</label>
            <v-text-field
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :append-inner-icon="
                showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
              "
              @click:append-inner="toggleConfirmPassword"
              required
              hide-details
              outlined
              dense
              style=" color: black;"

            />
          </div>



          

          <!-- Register Button -->
          <v-btn style="text-transform: none !important ;"  type="submit" class="sign-in-btn" :loading="loading['register-btn']" block>
            Register
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
</template>

<script>
import { API_URL } from "@/configs";
import axios from "axios";
import { mapState } from "vuex";
export default {

  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      name:"",
    };
  },
  computed: {
    ...mapState(["loading"]),
  },

  methods: {
    async register() {
      try {
        this.$store.commit("setLoading", "register-btn");
        const response = await axios.post(`${API_URL}/auth/register`, {
          username: this.username,
          name: this.name,
          password: this.password,
          confirm_password: this.confirmPassword
        });

        if (response.data) {
          this.$toast.success(response.data.message);
          this.$router.push("/");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        this.$toast.error(errorMessage);
      } finally {
        this.$store.commit("stopLoading", "register-btn");
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    login() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>


/* Register Card */
.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  margin: auto;
}

/* Typography */
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

/* Input Group Styling */
.input-group {
  text-align: left;
  margin-bottom: 16px;
}

.input-group label {
  font-weight: 500;
  margin-bottom: 4px;
  color: grey;
}




/* Button */
.sign-in-btn {
  background-color: #3E4658;  
  color: white;
}

</style>