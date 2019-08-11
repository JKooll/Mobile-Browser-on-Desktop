const state = {
  items: {}
}

const mutations = {
  insert: (state, item) => {
    state.items[item.key] = item
  },
  remove: (state, key) => {
    delete state.items[key]
  }
}

const actions = {
  insert (context, item) {
    console.log('insert')
    context.commit('insert', item)
  },
  remove (context, key) {
    context.commit('remove', key)
  }
}

const getters = {
  items: (state) => {
    return state.items
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
