<template lang="pug">
header
    h1 Welcome to best fake bookmaker
    div
        p#logo: img(src="../images/logo.png")
        nav#auth(v-if="auth")
            p About
            p Language: English / Russian
            p Statistic
            p Logout
        nav#not-auth(v-else)
            p About
            p Language: English / Russian
            p Authorization
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

<style lang="less">
header {
    margin: 10px 0;
    
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
            
            img {
                width: 90%;
            }
        }
        
        nav {
            flex: 1 1 auto;
        }
    }
}
</style>
