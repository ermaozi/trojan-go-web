<template>
  <v-app>
    <div id="app">
      <v-app-bar app color="primary">
        <v-spacer></v-spacer>
        <span v-if="is_login">
            <v-btn text @click="logout">
              <span class="mr-2">登出</span>
              <v-icon>mdi-home-export-outline</v-icon>
            </v-btn>
        </span>
        <span v-else>
          <router-link to="/login">
            <v-btn text>
              <v-icon>mdi-account-outline</v-icon>
              <span class="mr-2">登录</span>
            </v-btn>
          </router-link>
        </span>
      </v-app-bar>
      <router-view />
    </div>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    is_login: false,
  }),
  created() {
    this.check_login();
  },
  methods: {
    check_login() {
      if (localStorage.token) {
        this.is_login = true;
      }
    },
    logout() {
      localStorage.token = ""
      location.reload();
    }
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
  /* height: 1px; */
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(37, 36, 37);
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #181818;
}
</style>
