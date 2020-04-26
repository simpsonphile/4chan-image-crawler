<template>
    <div class="c-board-list">
        <div class="c-board-list__filter-names">
            <input
                type="text"
                @keypress="filterNameQuery = $event.target.value" />
        </div>
        <ul class="c-board-list__list" v-if="filteredBoards.length">
            <li
                class="c-board-list__el"
                v-for="board in filteredBoards"
                :key="board.id"
                @click="updateBoardImages(board)">
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
            updateBoardImages: 'updateBoardImages'
        })
    },
    mounted () {
        this.fetchBoards()
    }
}
</script>

<style lang="scss" scoped>
    .c-board-list {
        width: 200px;
    }

    .c-board-list__list {
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        display: flex;

        width: 100%;
        margin: -0.2rem;
        padding: 0;

        list-style-type: none;
    }

    .c-board-list__el {
        width: calc(50% - .4rem);
        padding: .5rem 1rem;
        margin: .2rem;

        background: pink;
        border: 2px solid blueviolet;
        border-radius: .5rem;
        color: blueviolet;
        cursor: pointer;
    }
</style>
