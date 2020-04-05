<template>
  <div class="container">
    <button @click="updateBoardImages(boards[36])">show mlp images</button>

    {{ boards[36] }}

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
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      boards: 'getBoards',
      boardImages: 'getBoardImages'
    })
  },
  methods: {
    ...mapActions({
      fetchBoards: 'fetchBoards',
      updateBoardImages: 'updateBoardImages'
    })
  },
  mounted () {
    this.fetchBoards()
  }
}
</script>

<style>

</style>
