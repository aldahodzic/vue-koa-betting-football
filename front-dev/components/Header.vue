<template lang="pug">
header
    h1 {{$t('site.welcome')}}
    div
        router-link#logo(to="/"): img(src="../images/logo.png", :title="$t('site.goToMain')")
        nav#auth(v-if="user.auth")
            p: router-link(to="/about"): a {{$t('About')}}
            p Language:
                span.cl(@click="setLanguage('en')") {{$t('English')}}
                span /
                span.cl(@click="setLanguage('ru')") {{$t('Russian')}}
            p: router-link(to="/bets"): a {{$t('Bets')}}
            p {{$t('Logout')}}
        nav#not-auth(v-else)
            p: router-link(to="/about"): a {{$t('About')}}
            p {{$t('Language')}}:
                span.cl(@click="setLanguage('en')") {{$t('English')}}
                span /
                span.cl(@click="setLanguage('ru')") {{$t('Russian')}}
            p: router-link(to="/auth"): a {{$t('Authentication')}}
</template>

<script>
import {mapGetters} from "vuex";
export default {
    name: "app-header",
    data() {
        return {
            auth: false
        }
    },
    computed: {
        ...mapGetters(["user"]),
    },
    methods: {
        setLanguage(language) {
            document.documentElement.lang = language;
            this.$set(this.$i18n, "locale", language);
        }
    }
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
header {
    margin: 8px 0;
    background: white;
    
    h1 {
        font-size: 22px;
        text-align: center;
        padding: 5px 0 0 0;
        margin: 0;
    }
    
    & > div {
        display: flex;
        
        #logo {
            flex: 1 1 auto;
            align-self: center;
            text-align: center;
            margin: 5px 0;
            
            img {
                width: 90%;
            }
        }
        
        nav {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            .justify;
            
            p {
                margin: 0;
                
                .cl {
                    cursor: pointer;
                    margin: 0 5px;
                    
                    &:hover {text-decoration: underline;}
                }
            }
        }
    }
}
</style>
