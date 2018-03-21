<template lang="pug">
label
    span.icon(
    v-if="activated",
    v-html="icon.context",
    :class="icon.className",
    :title="icon.title"
    )
    span Enter {{title}}
    input(
    :value="value",
    @input="onInput($event.target.value)"
    )
</template>

<script>
export default {
    name: "app-validating-input",
    props: {
        title: String,
        value: String,
        pattern: RegExp,
        failMessage: String
    },
    data() {
        return {
            activated: false,
            icons: {
                valid: {
                    className: "valid",
                    context: "&#10004;",
                    title: "OK"
                },
                failed: {
                    className: "failed",
                    context: "&#10006;",
                    title: this.failMessage
                }
            }
        }
    },
    computed: {
        valid() {
            return this.pattern.test(this.value);
        },
        icon() {
            return this.valid ? this.icons["valid"] : this.icons["failed"];
        }
    },
    methods: {
        onInput(value) {
            this.activated = true;
            this.$emit("new-value", value);
        }
    }
}
</script>

<style lang="less" scoped>
label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    margin: 10px 0;
    
    & > * {
        flex: 0 0 150px
    }
    
    .icon {
        text-align: right;
        margin-right: 10px;
        flex-basis: 20px;
        
        &.valid {color: green;}
        &.failed {color: red;}
    }
}
</style>
