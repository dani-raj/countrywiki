<template>
  <div id="nav">
    <router-link to="/" class="link">CountryWiki</router-link>
    <div class="links">
      <router-link
        :to="{ name: 'RandomDetails', params: { name: 'random' } }"
        class="link"
        >Random Country</router-link
      >
      <router-link to="/quiz" class="link">FlagQuiz</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar"
};
</script>

<style scoped>
#nav {
  background: rgb(71, 70, 68);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 1.2rem;
  text-decoration: none;
}

#nav a {
  opacity: 0.7;
  transition: all 0.2s;
}

#nav a:hover {
  opacity: 1;
}

#nav a.router-link-exact-active {
  font-weight: bold;
  opacity: 1;
}

.link {
  margin: 0 40px;
  color: #fff;
  text-decoration: none;
}

@media (max-width: 650px) {
  #nav {
    justify-content: space-between;
  }
  .link {
    margin: 0 8px;
    font-size: 1rem;
  }
}

@media (max-width: 376px) {
  .link {
    font-size: 0.8rem;
  }
}

@media (max-width: 280px) {
  .link {
    font-size: 0.6rem;
  }
}
</style>
