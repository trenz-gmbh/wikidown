<template>
  <v-row v-if="loading">
    <v-col cols="12" style="text-align: center">
      <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
    </v-col>
  </v-row>
  <not-found-view v-else-if="error !== null"></not-found-view>
  <markdown-content v-else :content="content"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import MarkdownContent from "@/components/MarkdownContent.vue";
import NotFoundView from "@/views/NotFoundView.vue";

export default defineComponent({
  name: "ContentView",

  components: {
    NotFoundView,
    MarkdownContent,
  },

  props: {
    location: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: true,
      content: "",
      error: null as null | string,
    };
  },

  async beforeMount() {
    try {
      this.loading = true;
      this.content = await this.$store.dispatch('findDocumentByLocation', this.location);
    } catch (e: unknown) {
      if (typeof e === 'string') {
        this.error = e;
      } else {
        console.error(e);

        this.error = "Unfortunately, an error occurred while loading the content. Please try again later.";
      }
    } finally {
      this.loading = false;
    }
  },
})
</script>
