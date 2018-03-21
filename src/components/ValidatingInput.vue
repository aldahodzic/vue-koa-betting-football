<template lang="pug">
div
    label {{title}} {{icon}}
        input(
        @input="onInput($event.target.value)"
        )

</template>

<script>
export default {
    name: "app-validating-input",
    props: {
        title: String,
        value: String,
        pattern: [Object, Function]
    },
    computed: {
        valid() {
            return typeof this.pattern === "function" ? this.pattern(this.value): this.pattern.test(this.value);
        },
        icon() {
            return this.valid ? "&#10004;" : "&#10006;";
        }
    }
}
</script>

<style lang="less">

</style>
