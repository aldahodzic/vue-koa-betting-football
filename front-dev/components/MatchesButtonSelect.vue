<template lang="pug">
    span(
    :class="className",
    :title="bestBookie.name"
    ) {{bestBookie.coefficient}}
</template>

<script>
import _ from "lodash";
export default {
    props: ["type", "coefficients"],
    computed: {
        bestBookie() {
            let bestBookie= _.maxBy(this.coefficients, "coefficient");
            bestBookie.coefficient = parseFloat(bestBookie.coefficient).toFixed(2);
            return bestBookie;
        },
        className() {
            if(this.type === "1") return "h";
            if(this.type === "0") return "d";
            if(this.type === "2") return "g";
        },
    }
}
</script>

<style lang="less" scoped>
span {font-weight: bold}
.h {background: #00ff00;}
.d {background: #ffff00;}
.g {background: #3399ff;}
</style>
