import { defineStore } from "pinia";

export const useFiltersStore = defineStore({
  id: "filters",
  state: () => ({
    searchQuery: "",
    selectedEditore: "",
    showFranceseBooks: false,
    editoriOptions: [],
    isExpansionOpen: false, // New variable to track expansion status
    // Define other state properties as needed
  }),
  getters: {
    // Define getters here if needed
  },
  actions: {
    updateSearchQuery(newSearchQuery) {
      this.searchQuery = newSearchQuery;
    },
    updateSelectedEditore(newSelectedEditore) {
      this.selectedEditore = newSelectedEditore;
    },
    updateShowFranceseBooks(newShowFranceseBooks) {
      this.showFranceseBooks = newShowFranceseBooks;
    },
    toggleExpansion() {
      console.log("filer Expansion toggled:", this.isExpansionOpen);
      this.isExpansionOpen = !this.isExpansionOpen;
      console.log("filter Expansion toggled:", this.isExpansionOpen);
    },
    // Define other actions as needed
  },
});
