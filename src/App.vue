<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>

      <v-btn href="https://www.ermao.net/" target="_blank" text>
        <v-icon>mdi-account-outline</v-icon>
        <span class="mr-2">登录</span>
      </v-btn>
    </v-app-bar>

    <v-main class="ma-16">
      <v-expansion-panels multiple v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header> 节点信息 </v-expansion-panel-header>
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
  </v-app>
</template>

<script>
import NoneInfo from "./components/NoneInfo";
import UserInfo from "./components/UserInfo";

export default {
  name: "App",

  components: {
    NoneInfo,
    UserInfo,
  },

  data: () => ({
    panel: [1],
  }),
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
