<template>
  <v-row :dense="true">
    <v-col v-for="(item, i) of $store.state.searchResults" :key="i" :cols="12" :md="6" :lg="4">
      <v-card :to="'/wiki/' + item.location">
        <template #title>
          <div style="direction: rtl; text-align: left; overflow: hidden; text-overflow: ellipsis;"
               v-html="item._formatted.location.replaceAll(/(\w)\/(\w)/gmi, '$1 / $2')">
          </div>
        </template>
        <template #text>
          <markdown-content class="markdown-content" :content="item._formatted.content"></markdown-content>
        </template>
      </v-card>
    </v-col>
    <v-col :cols="12" :md="6" :lg="4" v-if="$store.state.searchResultMessage !== null">
      {{ $store.state.searchResultMessage }}
    </v-col>
  </v-row>
</template>

<style lang="scss">
mark {
  background: #c92c2c55;
}

.markdown-content {
  transform: scale(0.75) translateX(-15%);
}
</style>

<script lang="ts">
import {defineComponent} from "vue";
import MarkdownContent from "@/components/MarkdownContent.vue";

export default defineComponent({
  name: "SearchView",

  components: {
    MarkdownContent,
  },
})
</script>
