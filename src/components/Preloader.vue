<template>
  <div id="preloader" v-if="this.getPreloaderStatus">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Preloader",
  computed: {
    ...mapGetters(["getPreloaderStatus"])
  }
};
</script>

<style scoped>
#preloader {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  width: 100%;
  margin-top: 80px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 20px;
  background-color: #fff;
  margin-right: 15px;
}
.dot:nth-of-type(1) {
  animation: loading 1.5s infinite;
}
.dot:nth-of-type(2) {
  animation: loading 1.5s infinite 0.3s;
}
.dot:nth-of-type(3) {
  animation: loading 1.5s infinite 0.4s;
}

@keyframes loading {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.dot:last-of-type {
  margin-right: 0;
}
</style>
