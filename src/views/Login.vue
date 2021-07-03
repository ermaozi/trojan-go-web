<template>
  <v-main class="ma-16">
    <v-form v-model="valid">
      <v-card flat class="mx-auto" width="450px">
        <v-card-title> 登录 </v-card-title>
        <v-divider></v-divider>
        <v-alert
          dismissible
          transition="scale-transition"
          :type="alertType"
          :value="alert"
        >
          {{ alertMsg }}
        </v-alert>
        <v-card-text>
          <v-text-field
            v-model="username"
            :rules="[rules.required]"
            label="用户名"
            persistent-hint
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="[
              rules.required,
              () => (!!password && password.length >= 8) || '密码不可小于 8 位',
            ]"
            label="密码"
            clearable
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            counter
            @keyup.enter="submit"
            @click:append="show = !show"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4" @click="register"> 注 册 </v-btn>
          <v-btn
            :disabled="!valid"
            class="mr-4"
            color="success"
            @click="submit"
          >
            登 录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-main>
</template>

<script>
import { login } from "@/utils/api";
export default {
  metaInfo: { title: "登录" },
  data() {
    return {
      valid: false,
      menu: false,
      show: false,
      alert: false,
      username: "",
      password: "",
      rules: {
        required: (value) => !!value || "不可为空",
        password: (value) => value.length >= 8 || "密码不可小于 8 位",
      },
    };
  },
  mounted: function () {
    if (localStorage.token) {
      this.alert = true;
      this.alertType = "success";
      this.alertMsg = "账号已登录, 返回首页..";
      this.$router.push("/");
    }
  },
  methods: {
    async submit() {
      var reqData = {};
      reqData.username = this.username;
      reqData.password = this.password;
      await login(reqData).then((res) => {
        if (res.code !== 200) {
          this.alert = true;
          this.alertType = "warning";
          this.alertMsg = "登陆失败: 账号密码错误";
        } else {
          this.datas = res.data;
          localStorage.setItem("token", this.datas.token);
          localStorage.setItem("username", this.datas.username);
          this.alert = true;
          this.alertType = "success";
          this.alertMsg = "登录成功!";
          this.$router.push("/");
        }
      });
    },
    register() {
      this.$router.push({ path: "/register" });
    },
  },
};
</script>