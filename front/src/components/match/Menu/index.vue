<template lang="pug">
menu
    li(
    v-for="league in leagues",
    @click="selectLeague(league)",
    :class="league.className",
    ) {{$t(league.name)}}
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AppMatchMenu",
  computed: {
    ...mapGetters({
      leagueList: "league/leagueList",
      selectedLeagues: "league/selectedLeagues",
    }),
    leagues () {
      return this.leagueList.map(name => ({
        name,
        className: this.selectedLeagues.includes(name) ? "selected" : "",
      }));
    },
  },
  methods: {
    ...mapActions({
      _selectLeague: "league/selectLeague",
    }),
    selectLeague (league) {
      this._selectLeague(league.name);
    },
  },
};
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}

menu {
    margin: 8px 0;
    padding: 0;
    background: white;
    display: flex;
    list-style: none;
    .justify;

    li {
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
    }
}
</style>
