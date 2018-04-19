<template lang="pug">
div#about
    
    div
        b Fakebet
        span  &mdash; {{$t('site.description')}}
    div
        p: b {{$t('site.forWho.question')}}
        p {{$t('site.forWho.answer')}}
    div
        p: b {{$t('Data')}}
        p {{$t('site.dataFrom.coefficients')}}:
            ul
                li: a(href="https://www.parimatch.com") Parimatch
                li: a(href="http://www.williamhill.com") Williamhill
                li: a(href="https://www.leonbets.net") Leonbets
            p {{$t('site.dataFrom.leagues')}}:
                ul: li(v-for="league in leagues") {{$t(league)}}
    div
        p: b {{$t('site.notDo')}}.
    div
        p: b {{$t('Functional')}}
        p {{$t('site.functional')}}
    div
        p: b {{$t('site.howMakeBet.question')}}
        ol: li(v-for="index of 7") {{$t('site.howMakeBet.answer['+(index-1)+']')}}



</template>

<script>
export default {
    computed: {
        leagues() {
            return this.$store.state.leaguesList
        }
    }
}
</script>

<style lang="less" scoped>
#about {
    background: white;
    padding: 5px 10px;
    
    div {
        margin: 15px 0;
        
        &:first-of-type {margin-top: 5px}
        &:last-of-type {margin-bottom: 5px}
        
        p {
            margin: 0
        }
        
        ol, ul {
            margin: 0;
            padding: 0 20px;
        }
    }
}
</style>
