import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    baseURL: "https://restcountries.eu/rest/v2/",
    allCountries: [],
    showLoading: false,
    currency: "",
    countriesToShow: [],
    canLoad: false,
    // numOfCountries sets the number of countries we wan't to get by click the "Show more" button at the bottom of the countries list.
    numOfCountries: { from: 0, to: 50 },
    showLoadMoreBtn: true,
    showGoBack: false,
    isSearchResult: false,
    searchTerm: ""
  },
  mutations: {
    setAllCountries(state, countryFound) {
      state.allCountries.push(countryFound);
    },
    setCurrency(state, currency) {
      state.currency = currency;
    },
    managePreloader(state, boolean) {
      state.showLoading = boolean;
    },
    setCountriesToShow(state, countriesList) {
      state.countriesToShow.push(countriesList);
    },
    canLoad(state, boolean) {
      state.canLoad = boolean;
    },
    setNumOfCountriesToGet(state) {
      state.numOfCountries.from += 50;
      state.numOfCountries.to += 50;
    },
    setSearchResults(state, searchResults) {
      state.countriesToShow = [];
      state.countriesToShow = searchResults;
    },
    resetCountries(state) {
      state.countriesToShow = [];
      state.numOfCountries.from = 0;
      state.numOfCountries.to = 50;
    },
    canShowLoadMoreBtn(state, boolean) {
      state.showLoadMoreBtn = boolean;
    },
    showGoBack(state, boolean) {
      state.showGoBack = boolean;
    },
    setIsSearchResult(state, boolean) {
      state.isSearchResult = boolean;
    },
    setSearchTerm(state, searchTerm) {
      state.searchTerm = searchTerm;
    }
  },
  actions: {
    getAllCountries({ commit, state }) {
      if (state.allCountries.length === 0) {
        this.dispatch("managePreloader", true);
        axios.get(`https://restcountries.eu/rest/v2/all`).then(res => {
          let searchResults = res.data;
          for (let i = 0; i < searchResults.length; i++) {
            let result = {
              name: searchResults[i].name,
              flag: searchResults[i].flag,
              currencyName: searchResults[i].currencies[0].name,
              currencyCode: searchResults[i].currencies[0].code,
              translations: searchResults[i].translations,
              altSpellings: searchResults[i].altSpellings,
              nativeName: searchResults[i].nativeName
            };
            commit("setAllCountries", result);
          }
          this.dispatch("managePreloader", false);
          this.commit("canLoad", true);
        });
      }
    },
    managePreloader({ commit }, boolean) {
      commit("managePreloader", boolean);
    },
    setCountriesToShow({ commit }, countriesList) {
      commit("setCountriesToShow", countriesList);
    },
    setCurrency({ commit }, currency) {
      commit("setCurrency", currency);
    },
    setNumOfCountriesToGet({ commit }) {
      commit("setNumOfCountriesToGet");
    },
    setSearchResults({ commit }, searchResults) {
      commit("setSearchResults", searchResults);
    },
    canShowLoadMoreBtn({ commit }, boolean) {
      commit("canShowLoadMoreBtn", boolean);
    },
    setIsSearchResult({ commit }, boolean) {
      commit("setIsSearchResult", boolean);
    },
    setSearchTerm({ commit }, searchTerm) {
      commit("setSearchTerm", searchTerm);
    }
  },
  getters: {
    getAllCountries(state) {
      return state.allCountries;
    },
    canLoad(state) {
      return state.canLoad;
    },
    getCountriesToShow(state) {
      return state.countriesToShow;
    },
    getNumOfCountries(state) {
      return state.numOfCountries;
    },
    getCanShowLoadMoreBtn(state) {
      return state.showLoadMoreBtn;
    },
    showGoBack(state) {
      return state.showGoBack;
    },
    getSearchTerm(state) {
      return state.searchTerm;
    },
    getPreloaderStatus(state) {
      return state.showLoading;
    }
  }
});
