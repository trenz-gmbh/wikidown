<template>
  <v-app>
    <v-navigation-drawer app v-model="drawerOpen" :permanent="drawerFixed">
      <template #prepend>
        <div class="px-2 border-b d-flex align-center" style="height: 65px">
          <v-text-field
            ref="search"
            v-model="searchQuery"
            label="Search Wiki"
            @focusin="handleSearchFieldFocusin"
            @focusout="handleSearchFieldFocusout"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            hide-details
            single-line
            density="compact"
          >
            <template #append-inner v-if="!searchFieldFocussed">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
                <path fill="none" stroke="#979A9C" opacity=".6"
                      d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"></path>
                <path fill="#979A9C" d="M11.8 6L8 15.1h-.9L10.8 6h1z"></path>
              </svg>
            </template>
          </v-text-field>
        </div>
      </template>

      <v-list>
        <v-list-item
          title="Home"
          :to="{name: 'home'}"
        />
        <nav-tree-node v-for="(n, i) of $store.state.navTree" :node="n" :key="i"/>
      </v-list>

      <template #append>
        <v-row>
          <v-col style="flex: 0 1">
            <div class="pa-2">
              <v-btn :icon="true" :flat="true" :color="drawerFixed ? 'primary' : null"
                     @click.stop="drawerFixed = drawerOpen = !drawerFixed">
                <v-icon>mdi-pin</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="env !== 'production'" class="d-flex flex-row align-center justify-end">
            <small class="pa-2">
              <code>{{ env }}</code>
            </small>
          </v-col>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-app-bar app :elevation="0" class="border-b acrylic">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-breadcrumbs v-if="breadcrumbItems.length > 1" :items="breadcrumbItems" class="ms-0"/>
      <v-container fluid>
        <router-view :key="$route.fullPath" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
.acrylic {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.5) !important;
}
</style>

<script lang="ts">
import {defineComponent} from 'vue'
import NavTreeNode from "@/components/NavTreeNode.vue";
import {VTextField} from "vuetify/components";

export default defineComponent({
  name: 'App',

  components: {
    NavTreeNode,
  },

  async beforeMount() {
    window.addEventListener('keydown', this.handleKeyDown)

    await this.$store.dispatch('loadNavTree');

    this.drawerFixed = window.localStorage.getItem('drawerFixed') !== 'false';
    this.drawerOpen = this.drawerFixed;
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  data() {
    return {
      searchQuery: '',
      drawerOpen: false,
      drawerFixed: true,
      searchFieldFocussed: false,
    }
  },

  watch: {
    async searchQuery(q) {
      await this.$store.dispatch('search', q);
      await this.maybeNavigateToSearch();
    },

    drawerFixed(v) {
      window.localStorage.setItem('drawerFixed', v);
    },
  },

  methods: {
    async handleSearchFieldFocusin() {
      this.searchFieldFocussed = true;

      await this.maybeNavigateToSearch();
    },

    async handleSearchFieldFocusout() {
      this.searchFieldFocussed = false;
    },

    async maybeNavigateToSearch() {
      if (this.$route.name !== 'search' && this.$store.state.searchQuery.length > 0) {
        await this.$router.push({'name': 'search'})
      }
    },

    handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (this.drawerOpen && !this.drawerFixed) {
          this.drawerOpen = false;
        }

        if (this.searchFieldFocussed) {
          this.searchQuery = '';
        }
      } else if (e.key === '/') {
        if (!this.drawerFixed && !this.drawerOpen) {
          this.drawerOpen = true;
        }

        const searchField = this.$refs.search as VTextField;

        if (!this.searchFieldFocussed) {
          this.searchQuery = '';
          searchField.focus();
          e.preventDefault();
        }
      }
    }
  },

  computed: {
    breadcrumbItems() {
      if (!this.$route.params.location) {
        return [
          {
            text: this.$route.meta.title,
            to: this.$route.fullPath,
            disabled: false,
          }
        ];
      }

      let parts = (this.$route.params.location as string).split('/');
      let path = [] as string[];

      return parts.map(part => {
        path.push(part);

        return {
          text: part,
          to: '/wiki/' + path.join('/'),
          disabled: false,
        }
      })
    },

    title() {
      if (!this.$route.params.location) {
        return this.$route.meta.title;
      }

      let parts = (this.$route.params.location as string).split('/');
      return parts[parts.length - 1];
    },

    env() {
      return process.env.NODE_ENV;
    }
  },
})
</script>
