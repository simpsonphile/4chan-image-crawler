<template>
    <div class="f-control">
        <input
            :type="typeComputed"
            :class="inputClasses"
            :id="id"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :value="value"
            @input="handleInput"
            @blur="$emit('blur', $event)"
            @focus="$emit('focus', $event)"
            @change="$emit('change', $event)" />
        <span v-if="hasRightIco"
            class="f-control__ico">
            <slot name="rightIco"></slot>
        </span>
    </div>
</template>

<script>
export default {
    name: 'control',
    props: {
        id: {
            type: String
        },
        placeholder: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: String
        },
        name: {
            type: String
        },
        disabled: {
            type: Boolean
        }
    },
    computed: {
        typeComputed: function () {
            const correctTypes = ['text', 'email', 'password', 'number', 'tel']
            if (correctTypes.includes(this.type)) {
                return this.type
            } else {
                return 'text'
            }
        },
        inputClasses: function () {
            return [
                'f-control__input',
                this.hasRightIco ? 'f-control__input--has-right-ico' : '',
            ]
        },
        hasRightIco: function () {
            return !!this.$slots.rightIco
        }
    },
    methods: {
        handleInput: function (e) {
            this.$emit('input', e.target.value)
        }
    }
}
</script>

<style lang="scss" scoped>
    .f-control {
        position: relative;

        min-width: 10rem;
    }

    .f-control__input {
        width: 100%;
        height: 3rem;
        padding: 0 1.5rem;

        border: 0;
        border-radius: 1.5rem;
        outline: none;
        background-color: $color_blue_2;
        color: $color_light_4;

        font-size: 1.4rem;
        line-height: 2rem;
        font-family: $font-normal;

        transition: all $transition_speed;

        &:disabled,
        &.is-disabled {
            background-color: $color_light_3;
        }
    }

    .f-control__input--has-right-ico {
        padding-right: 4.5rem;
    }

    .f-control__ico {
        position: absolute;
        top: 50%;
        right: 1.5rem;
        transform: translateY(-50%);

        pointer-events: none;
    }
</style>
