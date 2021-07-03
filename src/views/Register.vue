<template>
  <v-main class="ma-16">
    <v-form ref="form" lazy-validation>
      <v-card class="mx-auto" width="450px">
        <v-card-title> 注册 </v-card-title>
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
          <v-btn color="success" class="mr-4" @click="register"> 添加 </v-btn>
          <v-btn class="mr-4" @click="cancel"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-main>
</template>

<script>
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
import { userRegister } from "@/utils/api";

export default {
  data() {
    return {
      alert: false,
      show: false,
      username: "",
      password: "",
      rules: {
        required: (value) => !!value || "不可为空",
        password: (value) => value.length >= 8 || "密码不可小于 8 位",
      },
    };
  },
  methods: {
    async register() {
      var userdata = {
        username: this.username,
        password: this.password,
      };
      await userRegister(userdata).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
      });
      this.$router.push("/login");
    },
    cancel() {
      this.$router.push("/login");
    },
  },
};
</script>