<template lang="pug">
header
    h1 {{$t('site.welcome')}}
    div
        router-link#logo(to="/"): img(src="../images/logo.png", :title="$t('site.goToMain')")
        nav#auth(v-if="user.auth")
            p: router-link(to="/about"): a {{$t('About')}}
            p {{$t('Language')}}:
                span.change-language(@click="setLanguage('en')") {{$t('English')}}
                span /
                span.change-language(@click="setLanguage('ru')") {{$t('Russian')}}
            p: router-link(to="/bets"): a {{$t('Bets')}}
            p: span#logout(@click="userLogout") {{$t('Logout')}}
        nav#not-auth(v-else)
            p: router-link(to="/about"): a {{$t('About')}}
            p {{$t('Language')}}:
                span.change-language(@click="setLanguage('en')") {{$t('English')}}
                span /
                span.change-language(@click="setLanguage('ru')") {{$t('Russian')}}
            p: router-link(to="/auth"): a {{$t('Authentication')}}
</template>

<script>
import {mapGetters, mapActions} from "vuex";
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
        ...mapActions({
            _userLogout: "userLogout"
        }),
        userLogout() {
            this._userLogout(() => this.$router.replace("matches"));
        },
        setLanguage(language) {
            document.documentElement.lang = language;
            localStorage.setItem("language", language);
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
                
                #logout:hover {
                    color: red;
                    cursor: pointer;
                }
                
                a {
                    text-decoration: none;
                }
                
                .change-language {
                    cursor: pointer;
                    margin: 0 5px;
                    
                    &:hover {text-decoration: underline;}
                }
            }
        }
    }
}
</style>
