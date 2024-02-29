<template>
  <div>
    <q-expansion-item
      label="Filters"
      v-model="isExpansionOpen"
      @update:model-value="toggleExpansion"
    >
      <!-- Filter by Title -->
      <q-input
        v-model="searchQuery"
        outlined
        label="Filter by Title"
        dense
        @update:model-value="updateSearchQuery"
      ></q-input>

      <!-- Filter by Editore -->
      <q-select
        v-model="selectedEditore"
        outlined
        label="Filter by Editore"
        dense
        :options="editoriOptions"
        @change="handleEditoreChange"
      ></q-select>

      <!-- Tick selection to show/hide books with language "Francese" -->
      <q-checkbox v-model="showFranceseBooks" label="Show Francese Books" />
    </q-expansion-item>
    <!-- Filter by Title -->
    {{ isExpansionOpen }}
    <q-btn
      @click="clearFilters"
      label="Clear Filters"
      color="primary"
      dense
      v-if="searchQuery || selectedEditore"
    />

    <!-- List of books -->
    <div class="cards">
      <router-link
        v-for="book in filteredBibliografia"
        :key="book.id"
        :to="{ name: 'DettaglioLibro', params: { id: book.id } }"
        class="card"
      >
        <!-- Card content -->
        <q-item clickable v-ripple>
          <!-- Open modal on click -->
          <q-item-section>
            <!-- Use QImg component -->
            <q-img
              :src="book.signedUrl ? book.signedUrl : placeholderUrl"
              width="120px"
              fit="scale-down"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{ book.titolo }}</q-item-label>
            <q-item-label caption>{{ book.editore }}</q-item-label>
            <q-item-label caption>{{ book.collana }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
      </router-link>
    </div>
    <div class="button-container">
      <q-btn
        class="load-more-btn"
        @click="loadMore"
        label="Load More"
        color="primary"
        dense
        v-if="!allItemsLoaded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { db } from "../firebase/firebaseInit";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "vue-router";

const bibliografia = ref([]);

const router = useRouter();
const placeholderUrl =
  "https://firebasestorage.googleapis.com/v0/b/simenon-db758.appspot.com/o/400x600.png?alt=media";
const batchSize = 100; // Number of items to fetch per batch

import { useFiltersStore } from "../store/filtersStore";
const filtersStore = useFiltersStore();

const { searchQuery, selectedEditore, showFranceseBooks, editoriOptions } =
  filtersStore;

const updateSearchQuery = (value) => {
  console.log("Search query updated:", value);

  filtersStore.updateSearchQuery(value);
};

const handleEditoreChange = (value) => {
  filtersStore.updateSelectedEditore(value);
};

const toggleExpansion = () => {
  console.log("Expansion toggled:");
  filtersStore.toggleExpansion();
};
const isExpansionOpen = computed(() => filtersStore.isExpansionOpen);

// fine sezione per scrivere i valori dei filtri nello store
const fetchBibliografia = async () => {
  try {
    const q = query(
      collection(db, "Bibliografia"),
      orderBy("titolo"),
      limit(batchSize)
    );
    const querySnapshot = await getDocs(q);
    bibliografia.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      titolo: doc.data().titolo,
      editore: doc.data().editore,
      signedUrl: doc.data().signedUrl,
      posseduto: doc.data().posseduto,
      lingua: doc.data().lingua,
      collana: doc.data().collana,
    }));
    // console.log("Fetched Bibliografia:", bibliografia.value); // Log fetched data
  } catch (error) {
    console.error("Error fetching Bibliografia:", error);
  }
};

const fetchEditoriOptions = async () => {
  try {
    const editoriRef = collection(db, "Editori");
    const editoriSnapshot = await getDocs(editoriRef);
    const editoreArray = editoriSnapshot.docs[0].data().editore;
    editoriOptions.value = editoreArray.map((editore) => ({
      label: editore.editore,
      value: editore.editore,
    }));
    //console.log("Fetched Editori Options:", editoriOptions.value); // Log fetched options
  } catch (error) {
    console.error("Error fetching Editori:", error);
  }
};

onMounted(() => {
  fetchBibliografia();
  fetchEditoriOptions();
});

const filteredBibliografia = computed(() => {
  let filtered = bibliografia.value;

  // Retrieve the filter values from the Pinia store
  const searchQueryValue = filtersStore.searchQuery;
  const selectedEditoreValue = filtersStore.selectedEditore;
  const showFranceseBooksValue = filtersStore.showFranceseBooks;

  console.log("Selected Editore:", selectedEditoreValue);

  if (searchQueryValue) {
    filtered = filtered.filter((book) =>
      book.titolo.toLowerCase().includes(searchQueryValue.toLowerCase())
    );
  }

  if (selectedEditoreValue) {
    filtered = filtered.filter((book) => book.editore === selectedEditoreValue);
  }

  if (!showFranceseBooksValue) {
    filtered = filtered.filter((book) => book.lingua !== "Francese");
  }

  return filtered;
});

// Raed from Sotre and set here

let lastDoc = null; // Keep track of the last document fetched
const allItemsLoaded = false; // Ensure allItemsLoaded is defaulted to false

const loadMore = async () => {
  try {
    const q = query(
      collection(db, "Bibliografia"),
      orderBy("titolo"),
      startAfter(lastDoc),
      limit(batchSize)
    );
    const querySnapshot = await getDocs(q);
    const newItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      titolo: doc.data().titolo,
      editore: doc.data().editore,
      signedUrl: doc.data().signedUrl,
      posseduto: doc.data().posseduto,
      lingua: doc.data().lingua,
      collana: doc.data().collana,
    }));
    bibliografia.value = [...bibliografia.value, ...newItems];
    lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // Update lastDoc
    // console.log("Loaded more items:", newItems); // Log newly loaded items
    if (querySnapshot.docs.length < batchSize) {
      allItemsLoaded.value = true;
    }
  } catch (error) {
    console.error("Error loading more items:", error);
  }
};

const clearFilters = () => {
  filtersStore.updateSearchQuery("");
  filtersStore.updateSelectedEditore("");
  filtersStore.updateShowFranceseBooks(false);
};
</script>

<style scoped>
/* Add custom styles here if needed */
html {
  font-size: 22px;
}
body {
  padding: 1rem;
}

.card {
  background-color: dodgerblue;
  color: white;
  padding: 1rem;
  height: 12rem;
}
.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.load-more-btn {
  margin-top: 20px; /* Adjust the margin value as needed */
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Adjust the margin value as needed */
}
</style>
