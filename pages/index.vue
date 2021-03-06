<template>
  <v-app>
    <div class="container">
      <div>
        <div class="header">
          <Logo />
          <h1>Secret Server</h1>
        </div>
        <div class="secretpost">
          <v-form v-model="valid">
            <v-container>
              <v-card class="mx-auto my-12 output" max-width="374" elevation="4">
                <v-card-text class="overline mb-4"
                  >result of HTTP request:</v-card-text
                >
                <v-card-text class="output" v-model="httpResult">{{ httpResult }}</v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="secret"
                    label="Type here your secret"
                    placeholder="Type here your secret"
                    solo
                    type="text"
                    :rules="noEmptySecretRule"
                    required
                    >{{ secret }}</v-text-field
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" md="6">
                  <v-text-field
                    v-model="expireAfter"
                    label="How long should it be available (in minutes)?"
                    placeholder="How long should it be available (in minutes)?"
                    solo
                    type="text"
                    :rules="timeLimitRule"
                    required
                    >{{ expireAfter }}</v-text-field
                  >
                </v-col>
                <v-col cols="6" md="6">
                  <v-text-field
                    v-model="expireAfterViews"
                    label="How many views are accepted?"
                    placeholder="How many views are accepted?"
                    :rules="viewLimitRule"
                    required
                    solo
                    type="text"
                    >{{ expireAfterViews }}</v-text-field
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" class="text-right">
                  <v-btn
                    elevation="2"
                    color="primary"
                    :disabled="!valid"
                    @click="submitSecret"
                    >Send in secret</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" class="text-right">
                  <v-btn @click="clear" elevation="2">clear</v-btn>
                  <v-btn @click="copyHash" elevation="2"
                    >copy result to get field</v-btn
                  ></v-col
                >
              </v-row>
            </v-container>
          </v-form>
        </div>

        <div class="secretget">
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="textFieldHash"
                    label="Type here your hash"
                    placeholder="Type here your hash"
                    solo
                    :rules="noEmptyHashRule"
                    required
                    >{{ textFieldHash }}</v-text-field
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12" class="text-right">
                  <v-btn
                    elevation="2"
                    color="primary"
                    :disabled="!valid"
                    @click="getSecret"
                    >Get this secret</v-btn
                  ></v-col
                >
              </v-row>
            </v-container>
          </v-form>
          <div id="secretResponse"></div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    async getSecret() {
      try {
        const hash = this.textFieldHash;
        const res = await axios.get(`/api/secret/${hash}`, {
          headers: {
            Accept: "application/json",
          },
        });
        this.httpResult = res.data;
      } catch (e) {
        alert("No such secret");
      }
    },
    async submitSecret() {
      const res = await axios.post("/api/secret", {
        secret: this.secret,
        expireAfter: this.expireAfter,
        expireAfterViews: this.expireAfterViews,
      });
      this.httpResult = res.data;
    },
    copyHash() {
      this.textFieldHash = this.httpResult.hash;
    },
    clear() {
      this.httpResult = '';
    }
  },
  data: () => ({
    httpResult: "",
    textFieldHash: "",
    secret: "",
    expireAfterViews: "",
    expireAfter: "",
    valid: false,
    noEmptyHashRule: [(v) => !!v || "Tell me the hash to get back your secret"],
    noEmptySecretRule: [
      (v) => !!v || "Tell me your secret in at least one character",
    ],
    viewLimitRule: [
      (v) => !isNaN(v) || "It should be a number",
      (v) => v < 21 || "It should not be higher than 20",
      (v) => v >= 0 || "It should at least 0",
    ],
    timeLimitRule: [
      (v) => !isNaN(v) || "It should be a number",
      (v) => v < 5001 || "It should not be higher than 5000",
      (v) => v >= 0 || "It should be at least zero",
    ],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
  }),
};
</script>

<style>
.secretpost,
.secretget {
  margin: 0 auto;
  width: 80%;
}

.header {
  text-align: center;
}

.links {
  padding-top: 15px;
}

.v-messages__message {
  color: red;
}
</style>
