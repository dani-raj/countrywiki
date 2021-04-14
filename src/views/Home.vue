<template>
  <div class="home">
    <CountriesList />
  </div>
</template>

<script>
import CountriesList from "@/views/CountriesList.vue";

export default {
  name: "Home",
  components: {
    CountriesList
  }
};
</script>
