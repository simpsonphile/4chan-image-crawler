<template>
    <div class="c-board-list">
        <div class="c-board-list__filter-names">
            <input
                type="text"
                @change="filterNameQuery = $event.target.value" />
        </div>
        <ul class="c-board-list__list" v-if="filteredBoards.length">
            <li
                class="c-board-list__el"
                v-for="board in filteredBoards"
                :key="board.id"
                @click="fetchImagesFromBoard(board.id)">
                {{ board.id }}
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'the-boards-list',
    computed: {
        ...mapGetters({
            boards: 'getBoards'
        }),
        filteredBoards: function () {
            return this.boards.filter(item => item.id.includes(this.filterNameQuery))
        }
    },
    data: function () {
        return {
            filterNameQuery: ''
        }
    },
    methods: {
        ...mapActions({
            fetchBoards: 'fetchBoards',
            fetchImagesFromBoard: 'fetchImagesFromBoard'
        })
    },
    mounted () {
        this.fetchBoards()
    }
}
</script>

<style lang="scss" scoped>
    .c-board-list {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;

        width: 100px;
    }

    .c-board-list__list {
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        display: flex;

        width: 100%;
        padding: 0;

        list-style-type: none;
    }

    .c-board-list__el {
        // width: 50%;
        min-width: 40px;
        text-align: center;
        margin: 1px;

        background: pink;
        border: 1px solid blueviolet;
        color: blueviolet;
        cursor: pointer;
    }
</style>
