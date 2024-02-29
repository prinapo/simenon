/*
export function someGetter (state) {
}
*/
// getters.js
export default {
  searchQuery: (state) => state.searchQuery,
  selectedEditore: (state) => state.selectedEditore,
  showFranceseBooks: (state) => state.showFranceseBooks,
  // Add other getters as needed
};
