<template>
  <div id="app">
    <div id="nav">
      <NavBar />
    </div>
    <!-- We need to look at the fullPath becasue we use the same component to show a random country or a country the user selects from the list. -->
    <router-view :key="$route.fullPath" />
    <Preloader />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Preloader from "@/components/Preloader.vue";

export default {
  components: {
    NavBar,
    Preloader
  }
};
</script>
