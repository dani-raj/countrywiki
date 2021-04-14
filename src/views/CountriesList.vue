<template>
  <div class="search">
    <div id="search-box">
      <input
        type="text"
        class="search-bar"
        placeholder="Search for a country"
        @keyup="searchCountry"
        @click="clearSearchBar"
        :value="getSearchTerm"
      />
      <p v-if="error" class="error-message">No countries found.</p>
    </div>

    <div class="result-list">
      <div
        v-if="showGoBack"
        class="go-back reset-arrow"
        @click="resetCountriesList"
      >
        <img src="../assets/left-arrow.png" />
        <p>Go Back</p>
      </div>

      <div
        class="country-card"
        v-for="country in getCountriesToShow"
        :key="country.name"
        @click="goToAbout(country.name)"
      >
        <div
          class="flag-box"
          :style="{ 'background-image': 'url(' + country.flag + ')' }"
        ></div>
        <div class="country-name-box">
          <h2>{{ country.name }}</h2>
        </div>
      </div>
    </div>
    <div class="load-more" v-if="getCanShowLoadMoreBtn">
      <!-- The button only exists if we haven't reached yet the maximum number of countries. -->
      <button
        v-if="
          !(getCountriesToShow.length === this.$store.state.allCountries.length)
        "
        class="button"
        @click="getMoreCountries()"
      >
        Show More
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SearchBar",
  data() {
    return {
      countries: [],
      error: false
    };
  },
  methods: {
    goToAbout(countryName) {
      this.$router.push({
        name: "CountryDetails",
        params: { name: countryName }
      });
    },
    searchCountry(e) {
      this.$store.dispatch("managePreloader", true);

      this.countries = this.$store.state.allCountries;

      let searchTerm =
        e.target.value.charAt(0).toUpperCase() + e.target.value.substring(1);

      this.$store.dispatch("setSearchTerm", searchTerm);

      let searchResults = [];

      if (searchTerm.length > 0) {
        this.$store.commit("showGoBack", true);
        for (let i = 0; i < this.countries.length; i++) {
          if (
            this.countries[i].name.includes(searchTerm) ||
            this.countries[i].nativeName.includes(searchTerm)
          ) {
            searchResults.push(this.countries[i]);
          }
        }

        if (searchResults.length > 0) {
          this.error = false;
        } else {
          this.error = true;
        }
        this.$store.dispatch("setSearchResults", searchResults);
        this.$store.dispatch("canShowLoadMoreBtn", false);
        this.$store.dispatch("setIsSearchResult", true);
      } else {
        this.resetCountriesList();
      }
      this.$store.dispatch("managePreloader", false);
    },
    getMoreCountries() {
      if (this.$store.state.isSearchResult === false) {
        for (
          let i = this.getNumOfCountries.from;
          i < this.getNumOfCountries.to;
          i++
        ) {
          this.$store.dispatch(
            "setCountriesToShow",
            this.$store.state.allCountries[i]
          );
        }
        // Increasing the values of "from" and "to" in the store for the next 50 countries (if the user clicks the "Show more" button).
        this.$store.dispatch("setNumOfCountriesToGet");
      }
    },
    resetCountriesList() {
      this.$store.dispatch("setIsSearchResult", false);
      this.error = false;
      this.$store.commit("showGoBack", false);
      this.$store.commit("resetCountries");
      this.$store.dispatch("getAllCountries");
      this.getMoreCountries();
      this.$store.dispatch("canShowLoadMoreBtn", true);
    },
    clearSearchBar() {
      this.$store.dispatch("setSearchTerm", "");
    }
  },
  computed: {
    ...mapGetters([
      "canLoad",
      "getCountriesToShow",
      "getNumOfCountries",
      "getCanShowLoadMoreBtn",
      "showGoBack",
      "getSearchTerm"
    ])
  },
  watch: {
    canLoad(newValue) {
      if (newValue === true) {
        this.getMoreCountries();
      }
    }
  },
  created() {
    this.$store.state.allCountries.length > 0 &&
    this.getCountriesToShow.length < 50
      ? this.getMoreCountries()
      : this.$store.dispatch("getAllCountries");
  }
};
</script>

<style>
.search {
  margin: 5rem auto;
  padding: 0rem 0rem 5rem;
  height: 100%;
}

#search-box {
  max-width: 100%;
  max-width: 600px;
  margin: 0rem auto;
  position: relative;
}

.search-bar {
  border: 2px solid #fff;
  padding: 0.7rem 1rem;
  box-sizing: border-box;
  background: none;
  outline: none;
  width: 100%;
  color: #fff;
  position: relative;
  text-align: left;
  transition: all 0.2s;
}

.search-bar::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
}

.search-bar:focus::placeholder {
  color: transparent;
}

.search-bar:focus {
  background-color: rgba(45, 45, 45, 0.3);
}

.result-list {
  display: grid;
  grid-gap: 2.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  max-width: 1200px;
  justify-items: center;
  align-items: center;
  margin: 100px auto 20px;
  position: relative;
}

.reset-arrow {
  position: absolute;
  top: -100px !important;
}

.country-card {
  border-radius: 15px;
  color: #000;
  width: 220px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}
.country-card:hover {
  transform: scale(1.1);
}

.country-name-box {
  padding: 1rem 1.2rem;
}

.flag-box {
  width: 220px;
  height: 150px;
  background: transparent;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.3s;
  z-index: 1000;
}

.button {
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 2rem auto;
  padding: 0.6rem 1rem;
  background: transparent;
  outline: none;
  border: 1px solid #fff;
  color: #fff;
}

.button:hover {
  background: #fff;
  color: #000;
}

@media (max-width: 650px) {
  #search-box {
    max-width: 300px;
  }
  .country-card {
    width: 200px;
  }
  .flag-box {
    width: 200px;
    height: 150px;
  }
  .result-list {
    grid-gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 2fr));
    max-width: 1200px;
  }
}

@media (max-width: 320px) {
  #search-box {
    max-width: 250px;
  }
}
</style>
