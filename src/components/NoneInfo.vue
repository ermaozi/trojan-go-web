<template>
  <v-container>
    <v-dialog v-model="worknode_cmd" max-width="500px">
      <v-card width="1000px" flat class="pa-10">
        <v-card-title> 请在子节点执行以下命令 </v-card-title>
        <v-card-text>
          {{ add_msg }}
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="del_node_show" max-width="500px">
      <v-card>
        <v-card-title> 删除节点 </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-alert dense outlined type="error">
                    是否删除节点"{{ current_node }}"? 该操作不可逆
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    color="error"
                    :disabled="!valid"
                    class="mr-4"
                    @click="send_del_node"
                  >
                    确定删除
                  </v-btn>
                  <v-btn class="mr-4" @click="del_node_show = false">
                    取消
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="add_node_dialog" max-width="500px">
      <v-card width="500px" flat class="pa-10">
        <v-card-title> 添加节点 </v-card-title>
        <v-form ref="form" lazy-validation>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="nodename"
                  label="节点名称"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="node_remarks"
                  label="备注"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="domain"
                  label="域名"
                  hint="www.example.com"
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
                <v-text-field
                  v-model="region"
                  label="节点地域"
                  hint="中国台湾"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="12">
                <v-btn color="success" class="mr-4" @click="add_node">
                  添加
                </v-btn>

                <v-btn class="mr-4" @click="add_node_dialog = !add_node_dialog">
                  取消
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      bottom
      color="blue-grey accent-4"
    ></v-progress-linear>
    <v-row v-show="!loading">
      <v-col cols="20" md="4">
        <v-btn color="success" @click="add_node_dialog = !add_node_dialog">
          <v-icon>mdi-plus-circle-multiple-outline</v-icon>
        </v-btn>
        <v-btn
          color="blue-grey"
          :loading="refresh"
          class="ma-3"
          @click="
            refresh = true;
            get_info();
          "
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider v-show="!loading"></v-divider>

    <v-row>
      <v-col v-for="n in node_info" :key="n.id" cols="20" md="4">
        <v-card elevation="0" class="mx-auto">
          <v-card-title>
            <span class="text-h5">{{ n.node_name }}</span>

            <span class="mt-2 ps-3 blue-grey--text text-caption">
              ↑ {{ node_status[n.node_domain]["up_speed"] }}/s | ↓
              {{ node_status[n.node_domain]["down_speed"] }}/s
            </span>
            <v-row align="center" justify="end">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip v-bind="attrs" v-on="on" class="mt-1" x-small>
                    {{ n.node_usernumber }}
                  </v-chip>
                </template>
                <span>用户数量</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ma-3"
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    :color="node_status[n.node_domain].node_status.status"
                  >
                    {{ node_status[n.node_domain].node_status.info }}
                  </v-btn>
                </template>
                <span>{{ node_status[n.node_domain].node_status.msg }}</span>
              </v-tooltip>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text class="font-weight-bold">
            <div class="text-overline mb-1">
              cpu
              <v-progress-linear
                rounded
                height="15"
                :value="node_status[n.node_domain].cpu_percent"
                >{{
                  node_status[n.node_domain].cpu_percent
                }}%</v-progress-linear
              >
            </div>
            <div class="text-overline mb-1">
              内存 {{ node_status[n.node_domain].mem_used }} /
              {{ node_status[n.node_domain].mem_total }}
              <v-progress-linear
                rounded
                height="15"
                :value="node_status[n.node_domain].mem_percent"
                >{{
                  node_status[n.node_domain].mem_percent
                }}%</v-progress-linear
              >
            </div>

            <div class="text-overline mb-1">
              swap {{ node_status[n.node_domain].swap_used }} /
              {{ node_status[n.node_domain].swap_total }}
              <v-progress-linear
                rounded
                height="15"
                :value="node_status[n.node_domain].swap_percent"
                >{{
                  node_status[n.node_domain].swap_percent
                }}%</v-progress-linear
              >
            </div>

            <div class="text-overline mb-1">
              磁盘 {{ node_status[n.node_domain].disk_used }} /
              {{ node_status[n.node_domain].disk_total }}
              <v-progress-linear
                rounded
                height="15"
                :value="node_status[n.node_domain].disk_percent"
                >{{
                  node_status[n.node_domain].disk_percent
                }}%</v-progress-linear
              >
            </div>
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <a class="ma-n1">{{ n.node_domain }} | {{ n.node_region }}</a>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                plain
                @click="
                  del_node_show = true;
                  del_node(n.node_name);
                ">
                删除
              </v-btn>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getNodeStatus, getNodeInfo, addNode, delNode } from "@/utils/api";
export default {
  data: () => ({
    loading: true,
    del_node_show: false,
    add_node_dialog: false,
    refresh: false,
    showpwd: false,
    worknode_cmd: false,
    valid: false,
    add_msg: "",
    password: "",
    domain: "",
    nodename: "",
    node_remarks: "",
    current_node: "",
    region: "",
    node_info: [],
    domain_list: [],
    node_status: {},
  }),
  created() {
    this.get_info();
    window.setInterval(() => {
      setTimeout(() => {
        this.get_status();
      }, 0);
    }, 5000);
  },
  methods: {
    async get_info() {
      await getNodeInfo().then((res) => {
        this.node_info = res["data"]["node_list"];
        this.domain_list = res["data"]["domain_list"];
      });
      this.get_status();
      this.refresh = false;
    },
    async get_status() {
      await getNodeStatus(this.node_info).then((res) => {
        this.node_status = res["data"];
        this.loading = false;
      });
    },
    async add_node() {
      var nodedata = {
        node_name: this.nodename,
        node_domain: this.domain,
        node_region: this.region,
        node_remarks: this.node_remarks,
      };
      await addNode(nodedata).then((res) => {
        this.add_code = res["code"];
        this.add_msg = res["data"];
        if (this.add_code == 200) {
          this.worknode_cmd = true;
        }
      });
      this.get_info();
      this.add_node_dialog = false;
    },
    del_node(node_name) {
      console.log(node_name);
      this.current_node = node_name;
    },
    async send_del_node() {
      console.log(this.current_node);
      var nodedata = {
        node_name: this.current_node,
      };
      await delNode(nodedata).then((res) => {
        console.log(res);
      });
      this.del_node_show = false;
      this.get_info()
    },
  },
};
</script>