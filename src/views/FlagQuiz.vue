<template>
  <div id="flagquiz" v-if="this.showQuiz === true">
    <div id="stats">
      <div class="countdown">
        <p>Time left:</p>
        <div id="countdown-bar">
          <div
            class="percentage"
            :style="{
              width: percentage + '%',
              background: percentageBackground
            }"
          ></div>
        </div>
      </div>
      <p class="points">Points: {{ points }} sec</p>
    </div>

    <div id="country">
      <div
        class="flag"
        :class="{ flagShadow: showAnswer || gameOver }"
        :style="{
          backgroundImage: `url(${this.randomCountries[num].country.flag})`
        }"
      ></div>
      <div id="answer">
        <h2 v-if="showAnswer">{{ this.randomCountries[num].country.name }}</h2>
      </div>
      <div class="result-box" v-if="gameOver">
        <h2>You've guessed {{ points }} out of 10 countries</h2>
        <button class="new-game btn" @click="getRandomFlags">
          Start new game
        </button>
      </div>
    </div>

    <input
      type="text"
      v-if="!gameOver"
      ref="inputField"
      v-model="guess"
      class="input-field search-bar"
      :class="{ error: showError }"
      @keyup.enter="checkMatch"
      placeholder="Type your guess and hit enter"
    />
    <p class="error-message" v-if="showError">Try again!</p>
    <div class="buttons" v-if="!gameOver">
      <button class="show-btn btn" @click="revealAnswer" v-if="showAnswerBtn">
        Show answer
      </button>
      <button class="country-btn btn" @click="goToAbout">
        Country details
      </button>
    </div>
    <Preloader />
  </div>
</template>

<script>
import Preloader from "@/components/Preloader.vue";
import { mapGetters } from "vuex";

export default {
  name: "FlagQuiz",
  components: {
    Preloader
  },
  data() {
    return {
      showQuiz: false,
      countries: [],
      randomCountries: [],
      guess: "",
      points: 0,
      countdown: 30,
      showAnswer: false,
      showAnswerBtn: true,
      showError: false,
      showResult: true,
      gameOver: false,
      num: 0,
      percentage: 100,
      t: null,
      percentageBackground: "rgb(6, 233, 40)"
    };
  },
  methods: {
    getRandomFlags() {
      this.countries = this.$store.state.allCountries;
      this.percentage = 100;
      this.gameOver = false;
      this.num = 0;
      this.randomCountries = [];
      this.guess = "";
      this.points = 0;
      this.showAnswer = false;
      this.showAnswerBtn = true;

      this.launchCountdown();

      this.$store.dispatch("managePreloader", true);

      // Making sure that we get 10 different countries.
      for (let i = 0; i < 10; i++) {
        let randomCountry = {
          id: i,
          country: this.countries[Math.floor(Math.random() * 250)]
        };
        if (
          !this.randomCountries.some(
            country => country.country.name === randomCountry.country.name
          )
        ) {
          this.randomCountries.push(randomCountry);
        } else {
          i--;
        }
      }

      // We help the user by setting autofocus on the input field.
      if (this.$refs.inputField) {
        this.$nextTick(() => this.$refs.inputField.focus());
      }
      this.$store.dispatch("managePreloader", false);
      this.showQuiz = true;
    },
    goToAbout() {
      let routeData = this.$router.resolve({
        name: "CountryDetails",
        params: { name: this.randomCountries[this.num].country.name }
      });
      window.open(routeData.href, "_blank");
      this.revealAnswer();
    },
    revealAnswer() {
      this.showAnswer = true;
      this.showAnswerBtn = false;
      clearInterval(this.t);
      if (this.num <= 10) {
        setTimeout(() => {
          this.getNextFlag();
          this.showAnswer = false;
        }, 2000);
      }
    },
    getNextFlag() {
      this.percentageBackground = "rgb(6, 233, 40)";
      if (this.num < 9) {
        clearInterval(this.t);
        this.guess = "";
        ++this.num;
        this.showAnswerBtn = true;
        if (this.$refs.inputField) {
          this.$nextTick(() => this.$refs.inputField.focus());
        }
        this.percentage = 100;
        this.launchCountdown();
      } else {
        this.setGameOver();
      }
    },
    checkMatch() {
      if (this.guess) {
        let guessValue = this.guess.split(" ");
        guessValue = guessValue
          .map(function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1);
          })
          .join(" ");

        // We want to know how other languages may call the country, so that we can match the guess with them.
        let translationsArr = Object.values(
          this.randomCountries[this.num].country.translations
        );

        // We split the name of the country that the user have to guess.
        let nameToBeSimplified = this.randomCountries[
          this.num
        ].country.name.split(" ");

        // There are some countries with brackets in their name, like: "Falkland Islands (Malvinas)".
        // We have to accept if the user types only Falkland Islands.
        // In order to match the guess with these names, we have to find and get rid of these brackets.
        let bracketStartIndex = 0;
        let bracketEndIndex = 0;
        let simplifiedAnswer = "";
        // Check if the name that the user has to guess have more than one word.
        if (nameToBeSimplified.length > 1) {
          // If so, we have to check the words individually.
          for (let i = 0; i < nameToBeSimplified.length; i++) {
            // If the word starts with an "(" character, it means that there is is a bracket section starting there.
            if (nameToBeSimplified[i].charAt(0) === "(") {
              let bracketStart = nameToBeSimplified[i];
              bracketStartIndex = nameToBeSimplified.indexOf(bracketStart);
              // And if the word has a bracket in the end, it follows that there is the end of the bracket section.
            } else if (
              nameToBeSimplified[i].charAt(nameToBeSimplified[i].length - 1) ===
              ")"
            ) {
              let bracketEnd = nameToBeSimplified[i];
              bracketEndIndex = nameToBeSimplified.indexOf(bracketEnd);
            }
          }
          // We also have to check if the starting and the ending of the brackets are two separated words or just one.
          // If it's just one, it means that the part with the brackets is only one word, like in the previously mentioned example: "Falkland Islands (Malvinas)"
          // If that's the case, then bracketEndIndex would be 0, but we have to set it to 1, so we can remove it with the splice function.
          if (bracketStartIndex > 0 && bracketEndIndex === 0) {
            bracketEndIndex = 1;
          }
          nameToBeSimplified.splice(bracketStartIndex, bracketEndIndex);
        }

        simplifiedAnswer = nameToBeSimplified
          .map(function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1);
          })
          .join(" ");

        // We check if the guess value matches with the country name, its native name, any of its translated names, or the simplifed name (without the brackets)
        if (
          guessValue === this.randomCountries[this.num].country.name ||
          guessValue === this.randomCountries[this.num].country.nativeName ||
          this.randomCountries[this.num].country.altSpellings.includes(
            guessValue
          ) ||
          translationsArr.includes(guessValue) ||
          guessValue === simplifiedAnswer
        ) {
          this.guess = "";
          ++this.points;
          this.getNextFlag();
        } else {
          this.mismatch();
        }
      }
    },
    mismatch() {
      this.showError = true;
      this.guess = "";
      setTimeout(() => {
        this.showError = false;
      }, 1500);
    },
    launchCountdown() {
      this.t = setInterval(() => {
        this.percentage -= 5;

        if (this.percentage === 50) {
          this.percentageBackground = "rgb(233, 173, 6)";
        } else if (this.percentage === 25) {
          this.percentageBackground = "rgb(233, 14, 6)";
        } else if (this.percentage === 0) {
          clearInterval(this.t);

          this.revealAnswer();
        }
      }, 1000);
    },
    setGameOver() {
      this.gameOver = true;
      this.showResult = true;
      clearInterval(this.t);
    }
  },
  // We have to watch for the result of the getAllCountries and launch the game.
  computed: {
    ...mapGetters(["canLoad"])
  },
  watch: {
    canLoad(newValue) {
      if (newValue === true) {
        this.countries = this.$store.state.allCountries;
        this.showQuiz = true;
        this.getRandomFlags();
      }
    }
  },
  created() {
    // Checking if there are countries in the store already. If not, we dispatch getAllCountries to get them.
    // Thanks to this we can show a country even if the user refreshes the page and the values get lost.
    this.$store.state.allCountries.length > 0
      ? this.getRandomFlags()
      : this.$store.dispatch("getAllCountries");
  }
};
</script>

<style>
#flagquiz {
  display: flex;
  flex-direction: column;
}
#stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 800px;
  margin: 0 auto;
}
#countdown-bar {
  width: 300px;
  height: 25px;
  border: 1px solid #fff;
  position: relative;
}
.percentage {
  position: absolute;
  display: block;
  height: 100%;
  background-size: 25px, 25px;
}
.countdown {
  font-size: 20px;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 20px;
}
.countdown p {
  margin-bottom: 0px;
  text-align: left;
}
.points {
  font-size: 20px;
}
#country {
  margin: 0 auto;
  position: relative;
}
.flag {
  width: 800px;
  height: 400px;
  background-position: center;
  background-size: cover;
  outline: none;
  border: none;
  transition: filter 0.3s;
}
.flagShadow {
  filter: brightness(10%);
}
#answer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
}

.result-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
}
.input-field {
  width: 400px;
  padding: 0.6rem 1.2rem;
  border: 1px solid #fff;
  outline: none;
  margin: 30px auto;
}
.input-field.error {
  border: 2px solid rgb(165, 2, 2);
  margin-bottom: 0px;
}
.error-message {
  margin-bottom: 30px;
}
.buttons {
  display: flex;
  width: 300px;
  margin: 1rem auto;
  justify-content: space-around;
}
.btn {
  padding: 0.6rem 1rem;
  background: transparent;
  outline: none;
  border: 1px solid #fff;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}
.btn:hover {
  background: #fff;
  color: #000;
}

@media (max-width: 900px) {
  #stats {
    margin: 1rem auto;
    width: 350px;
  }
  #countdown-bar {
    width: 200px;
  }
  .countdown,
  .points,
  #answer,
  .result-box {
    font-size: 18px;
  }
  .flag {
    width: 400px;
    height: 250px;
  }
  .input-field {
    width: 350px;
  }
}

@media (max-width: 480px) {
  #stats {
    width: 300px;
  }
  #countdown-bar {
    width: 180px;
  }
  .flag {
    width: 300px;
    height: 150px;
  }
  .result-box {
    font-size: 12px;
  }
  .new-game {
    margin-bottom: 15px;
  }
  .input-field {
    width: 250px;
  }
  #answer {
    font-size: 15px;
  }
}

@media (max-width: 280px) {
  .flag {
    width: 250px;
    height: 150px;
  }
  #stats {
    width: 250px;
  }
  #countdown-bar {
    width: 120px;
  }
  .result-box {
    font-size: 8px;
  }
  .buttons {
    width: 250px;
  }
}
</style>
