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
    state.results.push(...threadIDs)
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
  }
}