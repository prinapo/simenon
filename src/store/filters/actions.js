/*
export function someAction (context) {
}
*/
// actions.js
export default {
  saveFilters({ commit }, filters) {
    commit("setSearchQuery", filters.searchQuery);
    commit("setSelectedEditore", filters.selectedEditore);
    commit("setShowFranceseBooks", filters.showFranceseBooks);
    commit("setIsExpansionOpen", filters.isExpansionOpen);
    // Add the commit for isExpansionOpen

    // Add other filter properties as needed
  },
};
