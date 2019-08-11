<template>
  <div id="browser-content">
    <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="showProgressBar"></md-progress-bar>

    <webview id="view" :src="target" :style="webviewStyle" :useragent="useragent"></webview>

    <div :style="indicatorStyle">
      页面正在加载，请稍后 ...
    </div>

    <md-dialog-prompt
      :md-active.sync="activeTargetInputBox"
      v-model="target"
      md-input-maxlength="100"
      md-input-placeholder="http://"
      md-confirm-text="确定"
      md-cancel-text="取消" />
    
    <md-snackbar md-position="center" :md-duration="snackbarDuration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarText}}</span>
    </md-snackbar>
    
    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target>
        <md-icon>add</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button class="md-icon-button" @click="reload">
          <md-icon>refresh</md-icon>
          <md-tooltip md-direction="left">刷新页面</md-tooltip>
        </md-button>
        <md-button class="md-icon-button" @click="favorite" v-if="canFavorite">
          <md-icon v-if="!favorited">favorite_border</md-icon>
          <md-icon style="color: red;" v-if="favorited">favorite</md-icon>
          <md-tooltip md-direction="left">收藏</md-tooltip>
        </md-button>
        <md-button class="md-icon-button" @click="copyLink">
          <md-icon>link</md-icon>
          <md-tooltip md-direction="left">复制链接</md-tooltip>
        </md-button>
        <md-button class="md-icon-button" @click="showTargetInputBox">
          <md-icon>input</md-icon>
          <md-tooltip md-direction="left">输入链接</md-tooltip>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
  </div>
</template>

<script>
  const { clipboard } = require('electron')
  const storage = require('electron-json-storage')
  const md5 = require('blueimp-md5')

  export default {
    name: 'browser-page',
    props: ['attrs'],
    data () {
      return {
        target: 'https://translate.google.com',
        useragent: 'Mozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
        view: null,
        loadingTimeOut: 5000,
        activeTargetInputBox: false,
        snackbarText: '',
        showSnackbar: false,
        snackbarDuration: 2000,
        collections: {},
        showProgressBar: false,
        webviewStyle: '',
        indicatorStyle: 'display: none;',
        favorited: false, // 已收藏
        meta: null,
        canFavorite: false,
        viewLoadTimeOutClock: null
      }
    },
    methods: {
      initMeta () {
        this.meta = {
          favicon: 'static/images/bookmark.png',
          title: ''
        }
      },
      reload () {
        if (!this.view) {
          return null
        }
        this.view.reload()
      },
      showTargetInputBox () {
        this.activeTargetInputBox = !this.activeTargetInputBox
      },
      activeSnackbar (text) {
        this.snackbarText = text
        this.showSnackbar = true
      },
      // 复制链接
      copyLink () {
        clipboard.writeText(this.target)
        this.activeSnackbar('链接复制成功！')
      },
      // 收藏链接
      favorite () {
        // {hash(target):target)
        let key = md5(this.target)

        if (key in this.collections) {
          delete this.collections[key]
        } else {
          this.collections[key] = this.meta
        }
        this.updateFavorite()
        storage.set('collections', this.collections, function (error) {
          if (error) throw error
        })
      },

      // 监听webview loadstart事件
      viewLoadStart () {
        this.showProgressBar = true
        this.webviewStyle = 'display: none;'
        this.indicatorStyle = ''
        this.canFavorite = false

        let that = this
        this.viewLoadTimeOutClock = setTimeout(function () {
          that.viewLoadStop()
        }, this.loadingTimeOut)
      },

      // 监听webview loadend事件
      viewLoadStop () {
        this.loading = false
        this.showProgressBar = false
        this.webviewStyle = ''
        this.indicatorStyle = 'display: none;'
        this.canFavorite = true

        if (this.viewLoadTimeOutClock) {
          clearTimeout(this.viewLoadTimeOutClock)
        }
      },

      viewFavicon (e) {
        if (e.favicons.length > 0) {
          this.meta.favicon = e.favicons[0]
        }
      },

      viewTitle (e) {
        this.meta.title = e.title
      },

      updateFavorite () {
        let key = md5(this.target)
        this.favorited = key in this.collections
      }
    },
    watch: {
      target (newValue, oldValue) {
        this.updateFavorite()
        this.initMeta()
      }
    },
    mounted () {
      this.view = document.getElementById('view')
      this.indicator = document.querySelector('.indicator')

      // regist webview listener
      this.view.addEventListener('did-start-loading', this.viewLoadStart)
      this.view.addEventListener('did-stop-loading', this.viewLoadStop)
      this.view.addEventListener('page-favicon-updated', this.viewFavicon)
      this.view.addEventListener('page-title-updated', this.viewTitle)

      // check is favorited and get collections
      let that = this
      storage.has('collections', function (error, hasKey) {
        if (error) throw error

        if (hasKey) {
          storage.get('collections', function (error, data) {
            if (error) throw error

            that.collections = data

            that.updateFavorite()
          })
        } else {
          storage.set('collections', {}, function (error) {
            if (error) throw error
          })

          that.collections = {}
        }
      })

      // init target
      if (this.attrs && this.attrs.target) {
        this.target = this.attrs.target
      }

      // init meta
      this.initMeta()
    }
  }
</script>

<style lang="scss" scope>
  .md-speed-dial {
    position: fixed;
  }

  body, #app, .page-container, .md-app, #browser-content, #view {
    height: 100%;
  }

  .md-progress-spinner {
    z-index: 99999;
    position: absolute;
    margin-top: 50%;
  }
</style>