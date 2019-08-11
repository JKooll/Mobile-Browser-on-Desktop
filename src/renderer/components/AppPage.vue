<template>
  <div class="page-container">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>
            <span class="md-title">MBoD</span>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">导航</md-toolbar>

        <md-list>
          <md-list-item @click="goto('BrowserPage')">
            <md-icon>bookmark</md-icon>
            <span class="md-list-item-text">浏览器</span>
          </md-list-item>
          <md-list-item @click="goto('CollectionsPage')">
            <md-icon>favorite</md-icon>
            <span class="md-list-item-text">收藏</span>
          </md-list-item>
          <md-list-item @click="goto('SettingsPage')" >
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">设置</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <transition name="fade" mode="out-in" appear>
          <component :is="component" v-if="component" @goto="goto" :attrs="attrs"></component>
        </transition>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    border: 1px solid rgba(#000, .12);
  }

  .md-content {
    padding: 0;
  }
</style>

<script>
export default {
  name: 'app-page',
  data () {
    return {
      menuVisible: false,
      component: null,
      attrs: []
    }
  },
  methods: {
    goto (type, attrs) {
      this.component = require(`@/components/templates/${type}.vue`).default
      if (attrs) {
        this.attrs = attrs
      }
    },
    refresh () {
      this.component.reload()
    }
  },
  mounted () {
    this.goto('BrowserPage')
  }
}
</script>