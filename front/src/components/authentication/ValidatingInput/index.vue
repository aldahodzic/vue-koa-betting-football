<template lang="pug">
label
    span.icon(
    v-if="show.icon",
    :class="icon.className",
    :title="$t(icon.title)",
    ) {{icon.context}}
    span {{$t('Enter')}} {{$t(title)}}
    input(
    :value="value",
    @input="onInput($event.target.value)",
    )
</template>

<script>
export default {
  name: "AppValidatingInput",
  props: {
    title: { type: String, required: true },
    value: { type: String, required: true },
    pattern: { type: RegExp, required: true },
    failMessage: { type: String, required: true },
    mode: { type: String, required: true },
  },
  data () {
    return {
      activated: false,
      icons: {
        valid: {
          className: "valid",
          context: "✔",
          title: "OK",
        },
        failed: {
          className: "failed",
          context: "✖",
          title: this.failMessage,
        },
      },
    };
  },
  computed: {
    show () {
      return {
        icon: this.activated === true,
      };
    },
    valid () {
      return this.pattern.test(this.value);
    },
    icon () {
      return this.valid ? this.icons.valid : this.icons.failed;
    },
  },
  methods: {
    onInput (value) {
      this.activated = true;
      this.$emit("new-value", value);
    },
  },
  watch: {
    mode () {
      this.$emit("new-value", "");
      this.activated = false;
    },
  },
};
</script>

<style lang="less" scoped>
label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    margin: 20px 0;

    & > * {
        flex: 0 0 150px
    }

    .icon {
        text-align: right;
        margin-right: 10px;
        flex-basis: 20px;

        &.valid {color: green;}
        &.failed {color: red;}
    }
}
</style>
