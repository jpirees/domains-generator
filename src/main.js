import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import axios from "axios/dist/axios";

import App from "./App.vue";

import DomainList from "./components/DomainList";
import DomainView from "./components/DomainView";

Vue.use(VueRouter);
Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    items: {
      prefix: [],
      suffix: []
    },
    domains: []
  },
  mutations: {
    addItem(state, payload) {
      const { item, newItem } = payload;
      state.items[item.type].push(newItem);
    },
    deleteItem(state, payload) {
      const { item } = payload;
      state.items[item.type].splice(state.items[item.type].indexOf(item), 1);
    },
    getItems(state, payload) {
      const { type, items } = payload;
      state.items[type] = items;
    },
    getDomains(state, payload) {
      const { domains } = payload;
      state.domains = domains;
    }
  },
  actions: {
    async addItem(context, payload) {
      const item = payload;
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($item: ItemInput){
              newItem: saveItem(item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item
          }
        }
      }).then(response => {
        const query = response.data;
        const newItem = query.data.newItem;
        context.commit("addItem", { item, newItem });
        context.dispatch("generateDomains");
      });
    },
    async deleteItem(context, payload) {
      const item = payload;
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
              mutation ($id: Int){
                deleted: deleteItem(id: $id)
              }
            `,
          variables: {
            id: item.id
          }
        }
      }).then(() => {
        context.commit("deleteItem", { item });
        context.dispatch("generateDomains");
      });
    },
    async getItems(context, payload) {
      const type = payload;
      return axios({
        url: "http://localhost:4000/",
        method: "post",
        data: {
          query: `
            query ($type: String) {
              items: items (type: $type) {
                id
                type
                description
              }
            }
          `,
          variables: {
            type
          }
        }
      }).then(response => {
        const query = response.data;
        context.commit("getItems", { type, items: query.data.items });
      });
    },
    async generateDomains(context) {
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation {
              domains: generateDomains {
                name
                checkout
                available
              }
            }
          `
        }
      }).then(response => {
        const query = response.data;
        context.commit("getDomains", { domains: query.data.domains });
      });
    }

  }
});

Promise.all([
  store.dispatch("getItems", "prefix"),
  store.dispatch("getItems", "suffix"),
]).then(() => {
  store.dispatch("generateDomains");
});

const router = new VueRouter({
  routes: [
    {
      path: "/domains",
      component: DomainList
    },
    {
      path: "/domains/:domain",
      component: DomainView,
      props: true,
    },
    {
      path: "/",
      redirect: "/domains"
    }
  ]
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
