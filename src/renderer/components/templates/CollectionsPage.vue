<template>
  <div>
    <md-list>
      <md-list-item v-for="(meta, key) in collections" v-bind:key="key">
        <md-avatar>
          <img :src="meta.favicon" :alt="meta.title">
        </md-avatar>

        <div class="md-list-item-text">{{meta.title}}</div>

        <md-button class="md-icon-button md-list-action" @click="open(val)">
          <md-icon class="md-primary">send</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
const storage = require('electron-json-storage')

export default {
  name: 'collectionsPage',
  data: () => {
    return {
      collections: {}
    }
  },
  methods: {
    open (target) {
      this.$emit('goto', 'BrowserPage', {target: target})
    }
  },
  mounted () {
    // check is favorited and get collections
    let that = this
    storage.has('collections', function (error, hasKey) {
      if (error) throw error

      if (hasKey) {
        storage.get('collections', function (error, data) {
          if (error) throw error

          that.collections = data

          console.log(that.collections)
        })
      } else {
        storage.set('collections', {}, function (error) {
          if (error) throw error
        })
      }
    })
  }
}
</script>