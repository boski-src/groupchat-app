<template>
  <transition name="fade">
    <router-view />
  </transition>
</template>

<script>
  export default {}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  #nprogress {
    background: rgba(0, 0, 0, 0.1);
    position: fixed;
    z-index: 1031;
    top: 0;
    height: 100%;
    width: 100%;
  }

  #nprogress .bar {
    height: 4px;
  }
</style>