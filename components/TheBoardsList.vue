<template>
    <div :class="classes">
        <button
            @click="isActive = !isActive"
            class="c-boards-menu__toggle">
        </button>


        <div class="c-boards-menu__search">
            <control
                v-if="isActive"
                type="text"
                has-btn
                @input="filterNameQuery = $event" />
        </div>

        <nav class="c-boards-menu__list-container">
            <ul
                class="c-boards-menu__list"
                v-if="filteredBoards.length && isActive">
                <li
                    class="c-boards-menu__el"
                    v-for="board in filteredBoards"
                    :key="board.id"
                    @click="handleElClick(board.id)">
                    {{ board.menuName }} - {{board.images.length }}
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import Control from '~/components/Control'
import { mapGetters } from 'vuex'

import { mapFields } from 'vuex-map-fields'

export default {
    name: 'the-boards-list',
    components: {
        Control
    },
    data: function () {
        return {
            filterNameQuery: '',
            isActive: false
        }
    },
    computed: {
        ...mapFields({
            currentBoard: 'currentBoard'
        }),
        ...mapGetters({
            boards: 'getBoards'
        }),
        classes: function () {
            return [
                'c-boards-menu',
                this.isActive ? 'is-active' : ''
            ]
        },
        boardsComputed: function () {
            return this.boards.map(board => {
                return {
                    ...board,
                    menuName: `${board.name} (${board.id})`
                }
            })
        },
        filteredBoards: function () {
            return this.boardsComputed.filter(
                item => item.menuName
                        .toUpperCase()
                        .includes(this.filterNameQuery.toUpperCase())
            )
        }
    },
    methods: {
        handleElClick(id) {
            this.currentBoard = id
            this.filterNameQuery = id
            this.isActive = false
        }
    },
    mounted () {
        this.$store.dispatch('fetchBoards')
    }
}
</script>

<style lang="scss" scoped>
    .c-boards-menu {
        position: fixed;
        top: 2rem;
        left: 2rem;
        z-index: 99;

        width: 24rem;
    }

    .c-boards-menu__toggle {
        position: relative;
        z-index: 2;

        width: 4rem;
        height: 4rem;

        outline: 0;
        border: 0;
        border-radius: 50%;
        background-color: $color_blue_shade_2;
        cursor: pointer;
    }

    .c-boards-menu__search {
        position: absolute;
        top: 0;

        width: 100%;
    }

    .c-boards-menu__list-container {
        overflow-y: scroll;

        height: 30rem;

        border-radius: 1rem;
    }

    .c-boards-menu__list {
        width: 100%;
        margin: 0;
        padding: 0;

        list-style-type: none;
    }

    .c-boards-menu__el {
        padding: .5rem 1rem;

        cursor: pointer;

        &:nth-child(even) {
            background-color: $color_blue_shade_2;
        }

        &:nth-child(odd) {
            background-color: $color_blue_shade_1;
        }
    }
</style>
