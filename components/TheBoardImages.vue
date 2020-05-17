<template>
    <div class="c-board-images">
        <div
            v-for="img in getImages(currentBoard)"
            :key="img.url"
            class="c-board-images__img">
            <img
                :src="img.url"
                :alt="img.fileName"
                class="o-image o-image--fit" />
        </div>

        <button @click="$store.dispatch('fetchImagesFromBoard', currentBoard)">update {{currentBoard}}</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
    name: 'the-board-images',
    computed: {
        ...mapFields({
            currentBoard: 'currentBoard'
        }),
        ...mapGetters({
            getImages: 'getBoardImages'
        })
    }
}
</script>

<style lang="scss" scoped>
    .c-board-images {
        flex-wrap: wrap;

        display: flex;
    }

    .c-board-images__img {
        margin: 5px;
        width: 200px;
        height: 200px;
    }
</style>
