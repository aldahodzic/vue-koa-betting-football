<template lang="pug">
div#bet-menu
    span(
    v-for="item in menu",
    @click="changeMenu(item)",
    :class="item.classes",
    ) {{$t(item.title)}}
    span.get-last-bets(
    @click="getLastBets",
    :class="buttonLoadResultsClass",
    :title="$t('check.bets.latest')",
    ) ⌕

</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AppBetMenu",
  data () {
    return {
      menu: [
        {
          type: "waiting",
          classes: "selected",
          title: "waiting.confirm",
        },
        {
          type: "results",
          classes: "",
          title: "Results",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      load: "bet/load",
    }),
    buttonLoadResultsClass () {
      return this.load.status == "loading" ? "disabled" : "";
    },
  },
  methods: {
    ...mapActions({
      _getResults: "bet/getResults",
      _changeSelector: "bet/changeSelector",
    }),
    changeMenu (selectedItem) {
      this.menu.forEach(item => item.classes = item.type == selectedItem.type ? "selected" : "");
      this._changeSelector({
        field: "type",
        value: selectedItem.type,
      });
    },
    getLastBets () {
      this._getResults({ force: true, created: "last" });
    },
  },
};
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#bet-menu {
    background: white;
    display: flex;
    margin: 10px 0;
    .justify;

    span {
        margin: 4px 2px;
        padding: 5px 10px;
        background: #33ff33;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        cursor: pointer;

        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}
        &.selected {background: #009933; color: white;}
        &.get-last-bets {
            margin-left: -2px;
            background: blue;
            flex-basis: 40px;
            padding: 0;
            flex-grow: 0;
            font-size: 25px;
            color: white;
            font-weight: bold;
            transform: rotateY(180deg);

            &.disabled {
                background: #3d3d3d;
                cursor: not-allowed;
            }
        }
    }
}
</style>
