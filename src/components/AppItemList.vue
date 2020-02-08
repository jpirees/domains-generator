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
            v-model="description"
            v-on:keyup.enter="addItem(type, description)"
            type="text"
            class="form-control"
            placeholder="Digite o item..."
          />
          <div type="text" class="input-group-append">
            <button
              class="btn btn-info"
              v-on:click="addItem(type, description)"
            >
              <span class="fa fa-plus"></span>
            </button>
          </div>
        </div>

        <br />
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="item in items"
            v-bind:key="item.id"
          >
            <div class="row">
              <div class="col-md">{{ item.description }}</div>
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
  props: ["title", "type", "items"],
  data() {
    return {
      description: ""
    };
  },
  methods: {
    addItem(type, description) {
      this.$emit("addItem", {
        type,
        description
      });
      this.description = "";
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    }
  }
};
</script>

<style scoped></style>
