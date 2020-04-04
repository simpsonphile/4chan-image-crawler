export const state = () => ({
  prefix: 'https://cors-anywhere.herokuapp.com/',
  apiUrl: 'https://a.4cdn.org/',
  boardDirs: [],
  threadIDs: [],
  posts: []
})

export const getters = {
  getBoardsApiUrl: state => {
    return state.prefix + state.apiUrl + '/boards.json'
  },

  getThreadsByBoardApiUrl: state => boardName => {
    return `${state.prefix}${state.apiUrl}${boardName}/threads.json`
  },

  getBoardDirs: state => {
    return state.boardDirs
  },

  getThreadIDs: state => {
    return state.threadIDs
  },

  getPosts: state => {
    return state.posts
  }
}

export const mutations = {
  SET_BOARDS_LIST (state, boardDirs) {
    state.boardDirs = boardDirs
  },

  ADD_THREAD_IDS (state, threadIDs) {
    state.threadIDs.push(...threadIDs)
  },

  ADD_POSTS (state, posts) {
    state.firstThread.push(...posts)
  }
}

export const actions = {
  async fetchBoards({ commit, getters }) {
      const url = getters.getBoardsApiUrl
      const boards = await this.$axios.$get(url)
      const boardDirs = boards.boards.map(board => board.board)
      commit('SET_BOARDS_LIST', boardDirs)
  },

  async fetchThreads({ commit, getters, dispatch }, boardID) {
    if (!getters.getBoardDirs.length) {
      await dispatch('fetchBoards')
    }

    const boardName = getters.getBoardDirs[boardID]
    const url = getters.getThreadsByBoardApiUrl(boardName)
    const threadsObj = await this.$axios.$get(url)
    const threadIDs = []
    threadsObj.forEach(page => {
      page.threads.forEach(thread => {
        threadIDs.push(thread.no)
      })
    })

    commit('ADD_THREAD_IDS', threadIDs)
  }
}