<template>
  <v-alert :prominent="true" type="error" variant="outlined">
    This page does not exist.
  </v-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'NotFoundView',

  params: {
    path: {
      type: String,
      required: false,
    }
  }
});
</script>
