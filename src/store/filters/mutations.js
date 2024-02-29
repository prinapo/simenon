// mutations.js
export default {
  setSearchQuery(state, value) {
    state.searchQuery = value;
  },
  setSelectedEditore(state, value) {
    state.selectedEditore = value;
  },
  setShowFranceseBooks(state, value) {
    state.showFranceseBooks = value;
  },
  toggleExpansion(state) {
    state.isExpansionOpen = !state.isExpansionOpen;
  },
};
