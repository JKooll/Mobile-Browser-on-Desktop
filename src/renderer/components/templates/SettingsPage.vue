<template>
    <div style="text-align: center; padding-top: 20%;">
      <md-button class="md-raised md-primary" @click="update">检查更新</md-button>

      <div style="color: #a9a9a9;">
        <div>
          <h2>Mobile Browser on Desktop</h2> v{{appVersion}}
        </div>
        由 <a href="javascript:;" @click="author" style="color: #a9a9a9;">JKol</a> 设计和编码<span style="color: red;">&#10084;</span>
      </div>
    </div>
</template>

<script>
  const shell = require('electron').shell
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'settings-page',
    data: () => {
      return {
        appVersion: ''
      }
    },
    methods: {
      author () {
        shell.openExternal('https://jkooll.github.io')
      },
      update () {
        ipcRenderer.sendSync('REQUEST_UPDATE_APP')
      }
    },
    mounted () {
      this.appVersion = ipcRenderer.sendSync('REQUEST_APP_VERSION')
    }
  }
</script>