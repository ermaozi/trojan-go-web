<template>
  <v-card elevation="0" class="ma-16">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜索"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="success" class="ma-2" dark @click="add_user = true">
        新增用户
      </v-btn>
    </v-card-title>
    <v-data-table
      item-key="username"
      :loading="loadingdata"
      loading-text="数据加载中..."
      :headers="headers"
      :items="desserts"
      :search="search"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              class="mr-2"
              @click="
                set_user_show = true;
                set_user(item);
              "
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>编辑用户</span>
        </v-tooltip>
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              class="mr-2"
              @click="
                get_trojan(item);
                trojan_show = true;
              "
            >
              mdi-eye
            </v-icon>
          </template>
          <span>查看节点</span>
        </v-tooltip>
        <v-tooltip top color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              class="mr-2"
              @click="
                del_user(item);
                del_user_show = true;
                valid = true;
              "
            >
              mdi-delete
            </v-icon>
          </template>
          <span>删除用户</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="add_user" max-width="500px">
      <v-card>
        <v-card-title> 新增用户 </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="username"
                    label="用户名"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="showpwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showpwd ? 'text' : 'password'"
                    label="密码"
                    @click:append="showpwd = !showpwd"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn color="success" class="mr-4" @click="register">
                    添加
                  </v-btn>
                  <v-btn class="mr-4" @click="add_user = false"> 取消 </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="set_user_show" max-width="500px">
      <v-card>
        <v-card-title> 编辑用户 </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="quota"
                    label="流量限制"
                    hint="-1为无限制"
                    type="number"
                    min="-1"
                    suffix="MB"
                    >-1</v-text-field
                  >
                </v-col>
                <v-col cols="12" sm="8">
                  <v-menu
                    v-model="date_menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="到期时间"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      :min="date_min"
                      locale="zh-cn"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <!-- </v-container> -->
              <v-row>
                <v-col cols="12" sm="12">
                  用户节点
                  <v-chip-group column>
                    <span v-for="node in current_nodes" :key="node.id">
                      <v-chip color="primary" @click="remove_user_nodes(node)">
                        {{ node }}
                      </v-chip>
                    </span>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  可用节点
                  <v-chip-group column>
                    <span v-for="node in available_nodes" :key="node.id">
                      <v-chip @click="add_user_nodes(node)">
                        {{ node }}
                      </v-chip>
                    </span>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn color="success" class="mr-4" @click="send_set_user">
                    提交
                  </v-btn>
                  <v-btn class="mr-4" @click="set_user_show = false">
                    取消
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="del_user_show" max-width="500px">
      <v-card>
        <v-card-title> 删除用户 </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-alert dense outlined type="error">
                    是否删除用户"{{ current_user }}"? 该操作不可逆
                  </v-alert>

                  <v-text-field
                    label="输入用户名"
                    :rules="[rules.del_user]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    color="error"
                    :disabled="!valid"
                    class="mr-4"
                    @click="send_del_user"
                  >
                    确定删除
                  </v-btn>
                  <v-btn class="mr-4" @click="del_user_show = false">
                    取消
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="trojan_show" max-width="600px">
      <v-card :loading="trojan_url_loading">
        <v-card-title> trojan 连接 </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row v-for="trojan in trojan_urls" :key="trojan.id">
              <v-col cols="12" sm="12">
                <span>{{ trojan }}</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-title> 订阅连接 </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12">
               {{ subscribe_link}}
              </v-col>
            </v-row>
            <v-row v-if="!trojan_url_loading">
              <v-col>
                <span v-if="subscribe_link">
                  <v-btn @click="update_subscribe_link">
                    重置订阅链接
                  </v-btn>
                </span>
                <span v-else>
                  <v-btn @click="update_subscribe_link">
                    创建订阅链接
                  </v-btn>
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
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
import {
  userRegister,
  getAllUser,
  setUser,
  delUser,
  getTrojanUrl,
  subscribe,
} from "@/utils/api";

export default {
  data() {
    return {
      search: "",
      username: "",
      password: "",
      valid: false,
      loadingdata: true, // 加载用户数据
      trojan_url_loading: true,
      set_user_show: false, // 修改用户
      del_user_show: false, // 删除用户
      trojan_show: false,
      showpwd: false,
      add_user: false,
      date_menu: false, // 时间选择器是否显示
      date_min: new Date(
        Date.now() -
          new Date().getTimezoneOffset() * 60000 +
          24 * 60 * 60 * 1000
      )
        .toISOString()
        .substr(0, 10),
      date: "",
      quota: -1,
      current_user: "", // 当前用户
      all_nodes: [], // 所有节点
      current_nodes: [], // 当前节点
      available_nodes: [], // 可用节点
      trojan_urls: [],
      subscribe_link: "",
      rules: {
        del_user: (value) => value == this.current_user,
      },
      headers: [
        {
          text: "用户",
          align: "start",
          sortable: false,
          value: "username",
        },
        { text: "上传流量", value: "upload" },
        { text: "下载流量", value: "download" },
        { text: "总流量", value: "total" },
        { text: "流量限制", value: "quota" },
        { text: "到期时间", value: "expiry_date" },
        { text: "操作", value: "actions", sortable: false },
      ],
      desserts: [],
    };
  },
  created() {
    this.get_user();
  },
  methods: {
    set_user(user) {
      this.current_user = user.username;
      this.current_nodes = user.nodes;
      if (user.expiry_date != "永久") {
        this.date = user.expiry_date;
      }
      if (user.quota == "无限制") {
        this.quota = -1;
      } else {
        this.quota = user.quota;
      }
      this.available_nodes = this.all_nodes.filter(function (v) {
        return user.nodes.indexOf(v) == -1;
      });
    },
    del_user(user) {
      this.current_user = user.username;
    },
    async send_del_user() {
      if (this.$refs.form.validate()) {
        var userdata = {
          username: this.current_user,
        };
        await delUser(userdata).then((res) => {
          this.add_code = res["code"];
          this.add_msg = res["data"];
        });
        this.del_user_show = false;
        this.get_user();
      }
    },
    async send_set_user() {
      var userdata = {
        username: this.current_user,
        node_list: this.current_nodes,
        user_data: {
          quota: this.quota,
          expiry_date: this.date,
        },
      };
      await setUser(userdata).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
      });
      this.set_user_show = false;
      this.get_user();
    },
    async get_user() {
      this.loadingdata = true;
      await getAllUser().then((res) => {
        this.desserts = res["data"]["user_list"];
        this.all_nodes = res["data"]["node_list"];
      });
      this.loadingdata = false;
    },
    async register() {
      var userdata = {
        username: this.username,
        password: this.password,
      };
      await userRegister(userdata).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
      });
      this.add_user = false;
      this.get_user();
    },
    add_user_nodes(node) {
      this.available_nodes.remove(node);
      this.current_nodes.push(node);
    },
    remove_user_nodes(node) {
      this.current_nodes.remove(node);
      this.available_nodes.push(node);
    },
    async get_trojan(user) {
      this.trojan_url_loading = true
      this.current_user = user.username;
      await getTrojanUrl(user.username).then((res) => {
        this.trojan_urls = res["data"]["trojan_urls"];
        this.subscribe_link = res["data"]["subscribe_link"];
      });
      this.trojan_url_loading = false
    },
    async update_subscribe_link() {
      var userdata = {
        username: this.current_user,
      };
      await subscribe(userdata).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
      });
      this.get_trojan({ username: this.current_user });
    },
  },
};
</script>