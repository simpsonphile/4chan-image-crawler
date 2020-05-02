<template>
  <div class="container">
    <the-boards-list></the-boards-list>

    <the-board-images></the-board-images>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import TheBoardsList from '~/components/TheBoardsList'
import TheBoardImages from '~/components/TheBoardImages'

export default {
  computed: {
    ...mapGetters({
      boards: 'getBoards',
      getBoardIndex: 'getBoardIndex'
    })
  },
  components: {
    TheBoardsList,
    TheBoardImages
  },
  methods: {
    ...mapActions({
      fetchImagesFromBoard: 'fetchImagesFromBoard'
    })
  }
}
</script>

<style>

</style>
