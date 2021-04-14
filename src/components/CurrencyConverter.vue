<template>
  <div id="currency-converter">
    <h2 class="title">
      Compare {{ currencyOne.currencyName }} with other currencies
    </h2>

    <div class="currency">
      <select id="currency-one" v-model="currencyOne">
        <option :value="currencyOne">
          {{ currencyOne.currencyName }} ({{ currencyOne.currencyCode }})
        </option>
      </select>
      <input
        type="number"
        id="amount-one"
        v-model="currencyOneAmount"
        @change="compareRates"
        min="0"
        oninput="validity.valid||(value='')"
        step="0.01"
      />
    </div>

    <div class="swap-rate-container">
      <button class="btn" id="swap" @click="swapRates">Swap</button>
      <div class="error" id="error" v-if="error">
        Unfortunately the rate of {{ this.currencyNotFound }} is not available
        as of now.
      </div>
      <div class="rate" id="rate" v-else>
        1 {{ this.currencyOne.currencyCode }} = {{ rate }}
        {{ this.currencyTwo.currencyCode }}
      </div>
    </div>

    <div class="currency">
      <select id="currency-two" v-model="currencyTwo" @change="compareRates">
        <option
          v-for="(currencyCode, index) in finalCurrencyList"
          :key="index"
          :value="currencyCode"
        >
          {{ currencyCode.currencyName }} ({{ currencyCode.currencyCode }})
        </option>
      </select>
      <input
        type="number"
        id="amount-two"
        v-model="currencyTwoAmount"
        @change="compareRates"
        min="0"
        oninput="validity.valid||(value='')"
        step="0.01"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CountryDetails",
  data() {
    return {
      currencyOne: "",
      currencyOneAmount: 100,
      currencyTwo: "",
      currencyTwoAmount: 1,
      rate: "",
      error: false,
      currencyNotFound: ""
    };
  },
  methods: {
    compareRates() {
      axios
        .get(
          `https://api.exchangerate-api.com/v4/latest/${this.currencyOne.currencyCode}`
        )
        .then(res => {
          let currTwo = this.currencyTwo.currencyCode.toUpperCase();

          this.rate = res.data.rates[currTwo];

          if (this.rate) {
            this.currencyTwoAmount = (
              this.currencyOneAmount * this.rate
            ).toFixed(2);
            this.error = false;
          } else {
            this.currencyNotFound = this.currencyTwo.currencyName;
            this.error = true;
          }
        })
        .catch(error => this.setError(error));
    },
    setError(error) {
      if (error.response.status === 404) {
        this.currencyNotFound = this.currencyOne.currencyName;
        this.error = true;
      }
    },
    swapRates() {
      if (!this.error) {
        [
          this.currencyOne,
          this.currencyTwo,
          this.currencyOneAmount,
          this.currencyTwoAmount
        ] = [
          this.currencyTwo,
          this.currencyOne,
          this.currencyTwoAmount,
          this.currencyOneAmount
        ];
        this.compareRates();
      }
    },
    setCurrencyOne() {
      const isMatch = element =>
        element.currencyCode === this.$store.state.currency.currencyCode;
      let index = this.allCountries.findIndex(isMatch);
      this.currencyOne = this.allCountries[index];
    },
    setDefaultCurrency() {
      let indexOfEur = this.allCountries.findIndex(
        element => element.currencyCode === "EUR"
      );
      this.currencyTwo = this.allCountries[indexOfEur];
    }
  },
  computed: {
    allCountries() {
      return this.$store.state.allCountries;
    },
    // Some countries share the same currency, so in order to avoid duplicates, we have to filter them out.
    removeDuplicates() {
      return this.allCountries.filter((obj, pos, arr) => {
        return (
          arr.map(mapObj => mapObj.currencyCode).indexOf(obj.currencyCode) ==
          pos
        );
      });
    },
    // The API gives back null or "none" as a currency for two countries. So we have to find and remove them.
    finalCurrencyList() {
      return this.removeDuplicates.filter(
        currency =>
          currency.currencyCode !== null && currency.currencyCode !== "(none)"
      );
    }
  },
  created() {
    this.setCurrencyOne();
    this.setDefaultCurrency();
    this.compareRates();
  }
};
</script>

<style scoped>
#currency-converter {
  width: 650px;
  margin: 0 auto;
}
.btn {
  position: absolute;
  padding: 0.7em 1.4rem;
  background: #fff;
  color: #000;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.btn:hover {
  background: #ccc;
  color: #fff;
}
.currency {
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.currency select {
  padding: 10px 20px 10px 10px;
  max-width: 250px;
  border: 1px solid #dedede;
  font-size: 14px;
  background: transparent;
  color: #fff;
}
.currency option {
  color: #000;
}
.currency input {
  border: 1px solid #fff;
  background: transparent;
  font-size: 30px;
  text-align: right;
  color: #fff;
  max-width: 200px;
}
#currency-one {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";
}
.swap-rate-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.rate,
.error {
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
  position: absolute;
  right: 0;
}
.error {
  color: rgb(233, 14, 6);
}
select:focus,
input:focus,
button:focus {
  outline: 0;
}

@media (max-width: 1025px) {
  #currency-converter {
    width: 300px;
  }
  .currency {
    display: flex;
    flex-direction: column;
  }
  #currency-one,
  #currency-two {
    margin-bottom: 1rem;
  }
  #amount-one,
  #amount-two {
    width: 170px;
  }
  .swap-rate-container {
    display: flex;
    flex-direction: column;
    margin: 1rem auto;
    height: 50px;
  }
  .rate {
    position: relative;
  }
  #swap {
    position: absolute;
    top: 30px;
  }
}

@media (max-width: 769px) {
  .error {
    bottom: 2rem;
  }
}

@media (max-width: 376px) {
  #currency-converter {
    width: 250px;
  }
}

@media (max-width: 280px) {
  #currency-converter {
    width: 150px;
  }
  .currency select {
    font-size: 10px;
  }
  .swap-rate-container .btn {
    margin-top: 1rem;
  }
}
</style>
