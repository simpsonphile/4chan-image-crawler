<template>
    <div class="c-board-list">
        <img
            v-for="img in getImages('mlp')"
            :key="img.url"
            :src="img.url"
            :alt="img.fileName" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'the-board-images',
    computed: {
        ...mapGetters({
            getImages: 'getBoardImages'
        })
    }
}
</script>

<style lang="scss" scoped>
    .c-board-list {
        flex-wrap: wrap;

        display: flex;

        & > * {
            margin: 5px;
            width: 200px;
        }
    }
</style>
