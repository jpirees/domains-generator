<template>
  <div>
    <h5>
      {{ title }}
      <span class="badge badge-info">{{ items.length }}</span>
    </h5>
    <div class="card">
      <div class="card-body">
        <div class="input-group">
          <input
            v-model="item"
            v-on:keyup.enter="addItem(item)"
            type="text"
            class="form-control"
            placeholder="Digite o item..."
          />
          <div type="text" class="input-group-append">
            <button class="btn btn-info" v-on:click="addItem(item)">
              <span class="fa fa-plus"></span>
            </button>
          </div>
        </div>

        <br />
        <ul class="list-group">
          <li class="list-group-item" v-for="item in items" v-bind:key="item">
            <div class="row">
              <div class="col-md">{{ item }}</div>
              <div class="col-md text-right">
                <button class="btn btn-danger" v-on:click="deleteItem(item)">
                  <span class="fa fa-trash"></span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppItemList",
  props: ["title", "items"],
  data() {
    return {
      item: ""
    };
  },
  methods: {
    addItem(item) {
      this.$emit("addItem", item);
      this.item = "";
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    }
  }
};
</script>

<style scoped></style>
