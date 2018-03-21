<template lang="pug">
div#auth
    h2 Authorization
    app-validating-input(
    v-for="field in fields",
    :key="field.title",
    :type="'row'",
    :title="field.title",
    :pattern="field.pattern",
    :value="field.value",
    :failMessage="field.failMessage",
    @new-value="field.value=$event"
    )
    input#login(
    type="button",
    value="Login",
    @click="login",
    :disabled="!dataValid || !dataFilled",
    :title="buttonTitle"
    )
</template>

<script>
import AppValidatingInput from "./ValidatingInput.vue";
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
                    failMessage: "Only latin characters, space or underscore"
                },
                {
                    title: "password",
                    value: "",
                    pattern: /^[a-zA-Z0-9]+$/,
                    failMessage: "Only latin characters and numbers"
                }
            ]
        }
    },
    computed: {
        dataValid() {
            return this.fields.every(field => field.pattern.test(field.value));
        },
        dataFilled() {
            return this.fields.every(field => field.value !== "");
        },
        buttonTitle() {
            if(!this.dataFilled) return "Fill in the data";
            if(!this.dataValid) return "Move mouse over the sign ✖";
            return false;
        }
    },
    methods: {
        login() {
            console.log("send");
        }
    }
}
</script>

<style lang="less">
#auth {
    background: white;
    padding: 5px 0;
    
    h2 {
        margin: 0;
        text-align: center;
    }
    
    #login {
        display: block;
        margin: 5px auto;
        padding: 3px 30px;
        font-size: 15px;
    }
}
</style>
