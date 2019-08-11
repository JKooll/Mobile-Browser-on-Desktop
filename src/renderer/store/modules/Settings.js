const namespaced = true

const state = {
  apperance: {
    theme: 'default-dark'
  },
  advance: {
    device: '',
    browser: ''
  }
}

const mutations = {
  updateTheme (state, theme) {
    state.apperance.theme = theme
  },
  updateDevice (state, device) {
    state.advance.device = device
  },
  updateBrowser (state, browser) {
    state.advance.browser = browser
  }
}

const getters = {
  theme: state => {
    return state.apperance.theme
  },
  device: state => {
    return state.advance.device
  },
  browser: state => {
    return state.advance.browser
  }
}

export default {
  namespaced,
  state,
  mutations,
  getters
}
