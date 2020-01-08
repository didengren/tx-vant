<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "home",
  beforeRouteEnter(to, from, next) {
    next((vm) => {});
  },

  props: {},
  watch: {},
  computed: {}
};
</script>
