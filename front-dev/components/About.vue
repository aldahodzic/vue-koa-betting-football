<template lang="pug">
div#about
    p {{$t('site.description')}}
    p: button(@click="getM") get matches
</template>

<script>
export default {
    methods: {
        async getM () {
            
            let matches = await this.$http.post("http://localhost:3000/matches");
            
            console.log(matches.data);
        }
    }
}
</script>

<style lang="less" scoped>
#about {
    background: white;
    padding: 5px 10px;
}
</style>
