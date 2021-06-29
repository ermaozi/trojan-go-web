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
      :headers="headers"
      :items="desserts"
      item-key="username"
      :search="search"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <span v-for="node in item.nodes" :key="node.id">
            <v-chip
              label
              color="primary"
              outlined
              close
              class="ma-2"
              close-icon="mdi-delete-outline"
              @click:close="remove_node(item.username, node)"
            >
              {{ node }}
            </v-chip>
          </span>
          <span>
            <v-chip
              class="ma-2"
              color="success"
              @click="
                add_node = true;
                add_node_to_user(item.username);
              "
            >
              <v-avatar left>
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-avatar>
              新增节点
            </v-chip>
          </span>
        </td>
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
    <v-dialog v-model="add_node" max-width="500px">
      <v-card>
        <v-card-title> 新增节点 </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    label="选择节点"
                    multiple
                    chips
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    color="success"
                    class="mr-4"
                    @click="send_add_node_to_user"
                  >
                    确定
                  </v-btn>
                  <v-btn class="mr-4" @click="add_node = false"> 取消 </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { userRegister, getAllUser, addNodeToUser } from "@/utils/api";

export default {
  data() {
    return {
      search: "",
      username: "",
      password: "",
      add_node_user: "",
      add_node: false,
      showpwd: false,
      add_user: false,
      select: [],
      items: [],
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
      ],
      desserts: [],
    };
  },
  created() {
    this.get_user();
  },
  methods: {
    async get_user() {
      await getAllUser().then((res) => {
        this.desserts = res["data"]["user_list"];
        this.items = res["data"]["node_list"];
      });
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
      console.log(this.add_code, this.add_msg);
      this.add_user = false;
      this.get_user();
    },
    add_node_to_user(username) {
      this.add_node_user = username;
      console.log(this.add_node_user);
    },
    async send_add_node_to_user() {
      var send_data = {
        username: this.add_node_user,
        node_list: this.select,
      };
      await addNodeToUser(send_data).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
      });
      this.add_node = false;
      this.get_user()
    },
    remove_node(username, node) {
      console.log(username, node);
    },
  },
};
</script>