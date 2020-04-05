export const state = () => ({
  prefix: 'https://cors-anywhere.herokuapp.com/',
  apiUrl: 'https://a.4cdn.org/',
  boards: []
})

export const getters = {
  getBoardsApiUrl: state => {
    return state.prefix + state.apiUrl + '/boards.json'
  },

  getThreadsByBoardApiUrl: state => boardName => {
    return `${state.prefix}${state.apiUrl}${boardName}/threads.json`
  },

  getPostsByThreadApiUrl: state => (boardName, threadID) => {
    return `${state.prefix}${state.apiUrl}${boardName}/thread/${threadID}.json`
  },

  getBoards: state => {
    return state.boards
  },

  getBoardImages: state => boardID => {
    return state.boards[boardID].imagesToShow
  },

  getUsedThreads: state => boardID => {
    let index
    state.boards.forEach((board, i) => {
      if (board.id === boardID) {
        index = i
      }
    })
    return state.boards[index].usedThreads
  }
}

export const mutations = {
  SET_BOARDS_LIST (state, boards) {
    state.boards = boards
  },

  SET_BOARDS_TIMESTAMP(state, options) {
    state.boards.forEach(board => {
      if (board.id === options.id) {
        board.timestamp_before = board.timestamp
        board.timestamp = options.timestamp
      }
    })
  },

  ADD_USED_THREADS(state, options) {
    state.boards.forEach(board => {
      if (board.id === options.id) {
        board.usedThreads.push(...options.threadIDs)
      }
    })
  },

  ADD_IMAGES_BOARD(state, options) {
    state.boards.forEach(board => {
      if (board.id === options.id) {
        board.images = [...options.images,...board.images]
        board.imagesToShow.unshift(...board.images.slice(0, 30))
        board.images = board.images.slice(30)
      }
    })
  }
}

export const actions = {
  async fetchBoards({ commit, getters }) {
      const url = getters.getBoardsApiUrl
      const boards = await this.$axios.$get(url)
      const newBoards = boards.boards.map(board => {
        return {
          id: board.board,
          name: board.title,
          timestamp_before: 0,
          timestamp: 0,
          images: [],
          imagesToShow: [],
          usedThreads: []
        }
      })

      commit('SET_BOARDS_LIST', newBoards)
  },

  async updateBoardImages({ dispatch, commit }, board) {
    let threadIDs = await dispatch('fetchThreadsFromBoard', {
      boardID: board.id,
      timestamp: board.timestamp
    })

    const threadIDsLength = threadIDs.length
    const images = []

    console.log(board.timestamp)

    for (let i = 0; i < threadIDsLength; i++) {
      console.log(i)
      await new Promise(r => setTimeout(r, 1000))

      const imagesFromThread = await dispatch('fetchImagesFromThread', {
        boardID: board.id,
        threadID: threadIDs[i],
        timestamp: board.timestamp_before
      })
      images.push(...imagesFromThread)
    }

    console.log('xd',images)

    commit('ADD_IMAGES_BOARD', {
      id: board.id,
      images: images
    })
  },

  async fetchThreadsFromBoard({ getters, commit }, options) {
    const url = getters.getThreadsByBoardApiUrl(options.boardID)
    const threadsObj = await this.$axios.$get(url)
    let threads = []

    // get all threads that are newer then timestamp
    threadsObj.forEach(page => {
      page.threads.forEach(thread => {
        if (thread.last_modified > options.timestamp) {
          threads.push({
            id: thread.no,
            last_mod: thread.last_modified
          })
        }
      })
    })

    console.log(threads)

    //filter out searched threads
    console.log(options.boardID)
    const usedThreads = getters.getUsedThreads(options.boardID)
    console.log(usedThreads,'xdddd')
    threads = threads.filter(thread => {
      console.log(!usedThreads.includes(thread.id))
      return !usedThreads.includes(thread.id)
    })

    console.log(threads)

    //cut threads to last 2
    threads = threads.slice(-2)
    
    //add current threads to used
    commit('ADD_USED_THREADS', {
      id: options.boardID,
      threadIDs: threads.map(thread => thread.id)
    })

    // set timestamp
    const newTimestamp = threads[0].last_mod
    commit('SET_BOARDS_TIMESTAMP', {
      id: options.boardID,
      timestamp: newTimestamp
    })

    //get only ids and make it from the oldest
    const threadIDs = threads.map(thread => thread.id).reverse()

    return threadIDs
  },

  async fetchImagesFromThread({ getters }, options) {
    const url = getters.getPostsByThreadApiUrl(options.boardID, options.threadID)
    const postsObject = await this.$axios.$get(url)
    const images = []

    postsObject.posts.forEach(post => {
      post.tim
      ? images.push(`https://i.4cdn.org/${options.boardID}/${post.tim}${post.ext}`)
      : false
    })
    
    return images.reverse()
  }
}