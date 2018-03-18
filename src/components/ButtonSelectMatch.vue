<template lang="pug">
    span(
    :class="className",
    :title="bestBookmark.name"
    ) {{bestBookmark.coefficient}}
</template>

<script>
import _ from "lodash";
export default {
    props: ["type", "coefficients"],
    computed: {
        bestBookmark() {
            return _.maxBy(this.coefficients, "coefficient")
        },
        className() {
            if(this.type === "1") return "h";
            if(this.type === "10") return "hd";
            if(this.type === "0") return "d";
            if(this.type === "02") return "dg";
            if(this.type === "2") return "g";
        },
    }
}
</script>

<style lang="less">

</style>
