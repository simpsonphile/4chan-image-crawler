export const state = () => ({
  boards: [],
  boardsIndexMap: undefined
})

export const getters = {
  getBoardsApiUrl: () => {
    return '/boards.json'
  },
  getThreadsByBoardApiUrl: () => boardID => {
    return `${boardID}/threads.json`
  },
  getPostsByThreadApiUrl: () => (boardID, threadID) => {
    return `${boardID}/thread/${threadID}.json`
  },
  getBoards: state => {
    return state.boards
  },
  getBoardImgBufLength: state => id => {
    const index = state.boardsIndexMap.get(id)
    return state.boards[index].img_buf.length
  },
  getThreadTimestamp: state => (boardID, threadID) => {
    const index = state.boardsIndexMap.get(boardID)
    return state.boards[index].crawled_threads.get(threadID) || 0
  }
}

export const mutations = {
  SET_BOARDS_LIST (state, boards) {
    state.boards = boards
  },
  SET_BOARDS_INDEX_MAP (state, boardsIndexMap) {
    state.boardsIndexMap = boardsIndexMap
  },
  UPDATE_IMAGES (state, options) {
    const index = state.boardsIndexMap.get(options.id)
    state.boards[index].img_buf.push(...options.images)
  },
  MOVE_IMAGES_FROM_BUFFOR (state, id) {
    const index = state.boardsIndexMap.get(id)

    state.boards[index].img.push(...state.boards[index].img_buf.slice(0, 30))
    state.boards[index].img_buf = state.boards[index].img_buf.slice(30)
    console.log(state.boards[index].img, state.boards[index].img_buf)
  },
  SET_THREAD_TIMESTAMP (state, options) {
    const index = state.boardsIndexMap.get(options.boardID)
    state.boards[index].crawled_threads.set(options.threadID, options.timestamp)
  }
}

export const actions = {
  async fetchBoards({ commit, getters }) {
      const url = getters.getBoardsApiUrl
      const result = await this.$axios.$get(url)
      const boards = result.boards.map(board => {
        return {
          id: board.board,
          name: board.title,
          img_buf: [],
          img: [],
          crawled_threads: new Map()
        }
      })

      const boardsIndexMap = new Map(boards.map((board, index) => [board.id, index]))

      commit('SET_BOARDS_LIST', boards)
      commit('SET_BOARDS_INDEX_MAP', boardsIndexMap)
  },

  async fetchImagesFromBoard({ commit, dispatch, getters }, boardID) {
    const bufforLength = getters.getBoardImgBufLength(boardID)
    if (bufforLength < 30) { // fetch new ones
      let images = []
      let threads = await dispatch('fetchThreads', boardID)
      threads = threads.sort((a, b) => a.last_modified - b.last_modified)
      const threadsLength = threads.length

      for (let i = 0; i < threadsLength; i++) {
        const thread = threads[i]
        const threadID = thread.no
        const prevTimestamp = getters.getThreadTimestamp(boardID, threadID)
        const currentTimestamp = thread.last_modified

        if (prevTimestamp >= currentTimestamp) continue

        // wait 1sec to not break 4chan rule about interval time before next request
        await new Promise(r => setTimeout(r, 1000))

        const imagesFromThread = await dispatch('fetchImagesFromThread', {
          boardID: boardID,
          threadID: threadID,
          timestamp: prevTimestamp
        })

        images.push(...imagesFromThread)
        console.log(images)

        commit('SET_THREAD_TIMESTAMP', {
          boardID: boardID,
          threadID: threadID,
          timestamp: currentTimestamp
        })

        if (images.length >= 30) break
      }

      commit('UPDATE_IMAGES', {
        id: boardID,
        images: images
      })
    }

    commit('MOVE_IMAGES_FROM_BUFFOR', boardID)
  },

  async fetchThreads({ getters }, boardID) {
    const url = getters.getThreadsByBoardApiUrl(boardID)
    const result = await this.$axios.$get(url)

    const threads = result.flatMap(page => page.threads)

    return threads
  },

  async fetchImagesFromThread ({ getters }, options) {
    const boardID = options.boardID
    const threadID = options.threadID
    const timestamp = options.timestamp
    const url = getters.getPostsByThreadApiUrl(boardID, threadID)
    const result = await this.$axios.$get(url)
    console.log(timestamp)
    //  get posts that have image and newer then timestamp and not video
    const postsFiltered = result.posts.filter(post => post.time > timestamp && post.tim && post.ext !== 'webm')
    console.log('tes', postsFiltered)
    const images = postsFiltered.map(post => {
      return {
        url: `https://i.4cdn.org/${boardID}/${post.tim}${post.ext}`,
        fileName: post.filename,
        time: post.time
      }
    })
    console.log(images)

    // return from the oldest to the newest
    return images.sort((a, b) => b.time - a.time)
  }
}