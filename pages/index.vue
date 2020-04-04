<template>
  <div class="container">
    <template v-if="boardDirs.length">
      {{ boardDirs }}
    </template>

    <button @click="fetchBoards">get Boards</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      boardDirs: 'getBoardDirs'
    })
  },
  methods: {
    ...mapActions({
      fetchBoards: 'fetchBoards'
    })
  }
}
</script>

<style>

</style>
