<template>
  <div>
    <div v-if="!getPreloaderStatus" class="container">
      <div class="go-back" @click="$router.go(-1)">
        <img src="../assets/left-arrow.png" />
        <p>Go back</p>
      </div>

      <h1 class="country-name">{{ countryDetails.name }}</h1>
      <img :src="countryDetails.flag" class="flag-img" />

      <div class="featured">
        <div class="capital featured-info" v-if="countryDetails.capital">
          <img src="../assets/capital.png" alt="" class="icon" />
          <p class="data"><span>Capital</span> {{ countryDetails.capital }}</p>
        </div>

        <!-- The API gives back null or "none" as a currency for two countries. In case the user selects one of them, the currency section won't exists. -->
        <div
          class="currency featured-info"
          v-if="
            countryDetails.currencies[0].code !== null &&
              countryDetails.currencies[0].code !== '(none)'
          "
        >
          <img src="../assets/currency.png" alt="" class="icon" />
          <p class="data">
            <span>Currency</span> {{ countryDetails.currencies[0].name }}
          </p>
        </div>
        <div class="population featured-info">
          <img src="../assets/population.png" alt="" class="icon" />
          <p class="data">
            <span>Population</span> {{ countryDetails.population }}
          </p>
        </div>
      </div>

      <hr />

      <div class="details">
        <div class="names">
          <p class="data">
            <span>Native name</span> {{ countryDetails.nativeName }}
          </p>
          <span>Languages </span>
          <ul class="list">
            <li>{{ countryDetails.languages[0].nativeName }}</li>
            <li>({{ countryDetails.languages[0].name }})</li>
          </ul>

          <span>Translations </span>
          <div
            class="translations-div"
            v-for="(translation, index) in countryDetails.translations"
            :key="`translations-${index}`"
          >
            {{ index }}: {{ translation }}
          </div>
        </div>

        <div class="location-details">
          <p class="data"><span> Region </span> {{ countryDetails.region }}</p>
          <p class="data">
            <span> Subregion </span> {{ countryDetails.subregion }}
          </p>
          <p class="data"><span> Area </span> {{ countryDetails.area }} km2</p>

          <div v-if="countryDetails.borders.length > 0">
            <span> Borders </span>
            <ul class="list borders">
              <li
                v-for="(border, index) in countryDetails.borders"
                :key="`borders-${index}`"
                class="list-item"
              >
                {{ border }},
              </li>
            </ul>
          </div>

          <span> Timezone(s) </span>
          <ul class="list">
            <li
              v-for="(time, index) in countryDetails.timezones"
              :key="`timezones-${index}`"
            >
              {{ time }}
            </li>
          </ul>

          <span> Latitude and Longitude </span>
          <ul class="list">
            <li
              v-for="(latlng, index) in countryDetails.latlng"
              :key="`latlng-${index}`"
              class="list-latlng"
            >
              {{ latlng.toFixed(2) }},
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <CurrencyConverter />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CurrencyConverter from "@/components/CurrencyConverter.vue";
import { mapGetters } from "vuex";

export default {
  name: "CountryDetails",
  components: {
    CurrencyConverter
  },
  data() {
    return {
      selectedCountry: this.$route.params.name,
      countryDetails: []
    };
  },
  methods: {
    getRandomCountry() {
      this.selectedCountry = this.$store.state.allCountries[
        Math.floor(Math.random() * 250)
      ].name;
      this.getCountryDetails();
    },
    getCountryDetails() {
      this.$store.dispatch("managePreloader", true);
      axios
        .get(`https://restcountries.eu/rest/v2/name/${this.selectedCountry}`)
        .then(res => {
          this.countryDetails = {
            name: res.data[0].name,
            capital: res.data[0].capital,
            flag: res.data[0].flag,
            languages: res.data[0].languages,
            latlng: res.data[0].latlng,
            nativeName: res.data[0].nativeName,
            population: res.data[0].population,
            region: res.data[0].region,
            area: res.data[0].area,
            subregion: res.data[0].subregion,
            timezones: res.data[0].timezones,
            translations: res.data[0].translations,
            currencies: res.data[0].currencies,
            borders: res.data[0].borders
          };
          let currency = {
            currencyName: res.data[0].currencies[0].name,
            currencyCode: res.data[0].currencies[0].code
          };
          this.$store.dispatch("setCurrency", currency);
          this.$store.dispatch("managePreloader", false);
        });
    },
    isRandom() {
      // This is where we decide if we should get the details of a random country or a country selected from the list.
      this.selectedCountry === "random"
        ? this.getRandomCountry()
        : this.getCountryDetails();
    }
  },
  computed: {
    // It's not enough to dispatch the getAllCountries, we also have to react for its result.
    ...mapGetters(["canLoad", "getPreloaderStatus"])
  },
  watch: {
    canLoad(newValue) {
      if (newValue === true) {
        this.isRandom();
      }
    }
  },
  created() {
    // Checking if there are countries in the store already. If not, we dispatch getAllCountires to get them.
    // Thanks to this we can show a country even if the user refreshes the page and the values get lost.
    this.$store.state.allCountries.length > 0
      ? this.isRandom()
      : this.$store.dispatch("getAllCountries");
    window.scrollTo(0, 0);
  }
};
</script>

<style>
.container {
  max-width: 1200px;
  margin: 3rem auto;
  background: rgb(30, 20, 90);
  padding: 3rem;
  border-radius: 20px;
  position: relative;
}
.go-back {
  position: absolute;
  left: 30px;
  top: 15px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  opacity: 0.5;
  cursor: pointer;
}
.go-back:hover {
  opacity: 1;
}
.go-back img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.featured {
  display: flex;
  width: 70%;
  justify-content: space-around;
  margin: 2rem auto;
}
.details {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  text-align: center;
  font-size: 16px;
}
.data {
  display: flex;
  flex-direction: column;
}
.icon {
  width: 50px;
}
.translations-div {
  text-align: center;
}
.list {
  margin-top: 0;
  list-style: none;
}
.list-item {
  display: inline-block;
  margin-right: 5px;
  padding: 0;
}
.borders {
  max-width: 300px;
  margin: 0 auto 1rem;
}
.list-latlng {
  display: inline;
}
hr {
  width: 70%;
  margin: 3rem auto;
}

.flag-img {
  max-width: 300px;
  margin: 0 auto;
}
span {
  font-weight: bold;
  font-size: 18px;
}

@media (max-width: 1240px) {
  .container {
    max-width: 900px;
  }
}

@media (max-width: 950px) {
  .container {
    max-width: 650px;
  }
}

@media (max-width: 680px) {
  .container {
    max-width: 350px;
    margin: 3rem auto;
    padding: 2rem;
  }
  .country-name {
    margin-top: 3rem;
  }
  .flag-img {
    max-width: 250px;
  }
  .featured {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 2rem;
    justify-content: center;
  }
}

@media (max-width: 376px) {
  .container {
    max-width: 320px;
  }
  .flag-img {
    max-width: 200px;
  }
}

@media (max-width: 320px) {
  .container {
    max-width: 300px;
  }
}

@media (max-width: 280px) {
  .container {
    max-width: 250px;
  }
}
</style>
