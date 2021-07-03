<template>
    <v-main class="ma-16">
      <v-alert
        dismissible
        transition="scale-transition"
        :type="alertType"
        :value="alert"
      >
        {{ alertMsg }}
      </v-alert>
      <v-expansion-panels multiple v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>  节点信息 </v-expansion-panel-header>
          <v-expansion-panel-content>
            <NoneInfo />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header> 用户信息 </v-expansion-panel-header>
          <v-expansion-panel-content>
            <UserInfo />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-main>
</template>

<script>
import NoneInfo from "@/components/NoneInfo";
import UserInfo from "@/components/UserInfo";

export default {
  name: "Home",

  components: {
    NoneInfo,
    UserInfo,
  },

  data: () => ({
    panel: [1],
    alert: false
  }),
  created() {
    this.check_login()
  },
  methods: {
    check_login(){
      if (! localStorage.token) {
        this.alert = true;
        this.alertType = "warning";
        this.alertMsg = "账号未登录, 前往登录页面..";
        setTimeout(() =>{
          this.$router.push("/login");
        },2000);
      }
    }
  }
};
</script>
