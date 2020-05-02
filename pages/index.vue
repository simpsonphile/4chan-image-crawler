<template>
  <div class="container">
    <the-boards-list>

    </the-boards-list>

    {{ boards }}

    <div v-if="boards[36]" style="display: flex; flex-wrap: wrap;">
      <img
        v-for="(image, index) in boardImages(36)"
        :key="'b2-' + index"
        :src="image"
        width="200"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TheBoardsList from '~/components/TheBoardsList'

export default {
  computed: {
    ...mapGetters({
      boards: 'getBoards',
      boardImages: 'getBoardImages'
    })
  },
  components: {
    TheBoardsList
  }
}
</script>

<style>

</style>
