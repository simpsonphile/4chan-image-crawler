<template>
    <span :class="classes">
        <svg-icon :name="name" />
        <slot></slot>
    </span>
</template>

<script>
export default {
    name: 'icon',
    props: {
        name: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: 'm',
        },
        color: {
            type: String
        }
    },
    computed: {
        classes: function () {
            return [
                'o-ico',
                this.name ? `o-ico--${this.name}` : '',
                this.size ? `o-ico--${this.size}` : '',
                this.color ? `u-paint-${this.color}` : ''
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
    .o-ico {
        align-items: center;
        justify-content: center;

        display: flex;
    }

    .o-ico img,
    .o-ico svg {
        width: 100%;
        height: 100%;

        fill: currentColor;
    }
</style>