<template lang="pug">
header
    h1 Welcome to best fake bookmaker
    div
        router-link#logo(to="/"): img(src="../images/logo.png")
        nav#auth(v-if="auth")
            p About
            p Language: English / Russian
            p Statistic
            p Logout
        nav#not-auth(v-else)
            p About
            p Language: English / Russian
            p: router-link(to="/auth"): a Authorization
            p Registration
</template>

<script>
export default {
    name: "app-header",
    data() {
        return {
            auth: false
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
                margin: 0
            }
        }
    }
}
</style>
