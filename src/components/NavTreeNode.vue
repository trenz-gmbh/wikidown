<template>
  <v-list-item
    v-if="node.children === null"
    :title="node.name"
    :to="'/wiki/' + node.location"
    :active="$route.params.location === node.location"
  />
  <v-list-group v-else>
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :title="node.name"
      />
    </template>

    <v-list-item
      title="Overview"
      :to="'/wiki/' + node.location"
      :active="$route.params.location === node.location"
    />

    <nav-tree-node v-for="(n, i) of node.children" :node="n" :key="i"/>
  </v-list-group>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "NavTreeNode",

  props: {
    node: {
      type: Object,
      required: true,
      validator: (node) => {
        return Object.hasOwnProperty.call(node, 'name') && Object.hasOwnProperty.call(node, 'location');
      },
    },
  },
})
</script>
