<template lang="pug">
div#auth
    div#head
        h2(
        v-for="auth in authTypes",
        :class="auth.className",
        @click="changeMode(auth.mode)"
        ) {{$t(auth.title)}}
    
    app-validating-input(
    v-for="field in fields",
    :key="field.title",
    :mode="currentMode",
    :title="field.title",
    :pattern="field.pattern",
    :value="field.value",
    :failMessage="field.failMessage",
    @new-value="field.value=$event"
    )
    input#login(
    type="button",
    :value="$t(buttonValue)",
    @click="send",
    :disabled="!dataValid || !dataFilled",
    :title="$t(buttonTitle)"
    )
</template>

<script>
import AppValidatingInput from "./ValidatingInput.vue";
import {mapGetters, mapActions} from "vuex";
export default {
    name: "app-authorization",
    components: {
        AppValidatingInput
    },
    data() {
        return {
            fields: [
                {
                    title: "login",
                    value: "",
                    pattern: /^[a-zA-Z _]+$/,
                    failMessage: "phrases.only.characters_numbers"
                },
                {
                    title: "password",
                    value: "",
                    pattern: /^[a-zA-Z0-9]+$/,
                    failMessage: "phrases.only.characters_symbols"
                }
            ],
            authTypes: [
                {
                    title: "Authorization",
                    mode: "authorization",
                    className: "active"
                },
                {
                    title: "Registration",
                    mode: "registration",
                    className: ""
                }
            ]
        }
    },
    computed: {
        ...mapGetters(["user"]),
        dataValid() {
            return this.fields.every(field => field.pattern.test(field.value));
        },
        dataFilled() {
            return this.fields.every(field => field.value !== "");
        },
        buttonTitle() {
            if(!this.dataFilled) return "fill.data";
            if(!this.dataValid) return "move.mouse.sign";
            return false;
        },
        currentMode() {
            return _.find(this.authTypes, {className: "active"}).mode;
        },
        buttonValue() {
            return this.currentMode === "authorization" ? "SignIn" : "SignUp";
        }
    },
    methods: {
        ...mapActions(["userAuthAction"]),
        send() {
            let login = this.fields.find(field => field.title === "login").value;
            let password = this.fields.find(field => field.title === "password").value;
            
            this.userAuthAction({
                url: this.currentMode,
                userData: {login, password},
                callback: ({data, status}) => status ? this.authActionSuccessful() : this.authActionFailed(data),
            });
        },
        changeMode(mode) {
            _.each(this.authTypes, type => type.className = type.mode === mode ? "active" : "");
        },
        authActionSuccessful() {
            this.$router.replace("matches");
        },
        authActionFailed(message) {
            alert(message);
        },
    },
    created() {
        if(this.user.auth) this.$router.replace("matches");
    },
}
</script>

<style lang="less">
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#auth {
    background: white;
    padding: 5px 0;
    
    #head {
        display: flex;
        flex-flow: row nowrap;
        .justify;
    
        h2 {
            margin: 5px 10px;
            padding: 3px 0;
            text-align: center;
            flex: 0 1 30%;
            cursor: pointer;
            
            &.active {border-bottom: 1px solid #333;}
        }
    }
    
    #login {
        display: block;
        margin: 5px auto;
        padding: 3px 30px;
        font-size: 15px;
    }
}
</style>
