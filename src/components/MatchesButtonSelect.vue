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
            console.log("comp2");
            return _.maxBy(this.coefficients, "coefficient");
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

<style lang="less" scoped>
span {font-weight: bold}
.h {background: #00ff00;}
.hd {background: #ccff33;}
.d {background: #ffff00;}
.dg {background: #66ccff;}
.g {background: #3399ff;}
</style>
