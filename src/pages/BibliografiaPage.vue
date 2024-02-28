<template>
  <div>
    <q-expansion-item label="Filters">
      <!-- Filter by Title -->
      <q-input
        v-model="searchQuery"
        outlined
        label="Filter by Title"
        dense
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
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase/firebaseInit";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useRouter } from "vue-router";

const handleEditoreChange = (value) => {
  selectedEditore.value = value;
};

const bibliografia = ref([]);
const searchQuery = ref("");
const selectedEditore = ref("");
const showFranceseBooks = ref(false); // Checkbox state
const router = useRouter();
const editoriOptions = ref([]);
const placeholderUrl =
  "https://firebasestorage.googleapis.com/v0/b/simenon-db758.appspot.com/o/400x600.png?alt=media";

const fetchBibliografia = async () => {
  try {
    const q = query(collection(db, "Bibliografia"), limit(20));
    const querySnapshot = await getDocs(q);
    bibliografia.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      titolo: doc.data().titolo,
      editore: doc.data().editore,
      signedUrl: doc.data().signedUrl,
      posseduto: doc.data().posseduto,
      lingua: doc.data().lingua,
    }));
    console.log("Fetched Bibliografia:", bibliografia.value); // Log fetched data
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
    console.log("Fetched Editori Options:", editoriOptions.value); // Log fetched options
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
  console.log("Selected Editore:", selectedEditore.value.value); // Log selected editore
  if (searchQuery.value) {
    filtered = filtered.filter((book) =>
      book.titolo.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (selectedEditore.value) {
    console.log("Filtering by Editore:", selectedEditore.value.value); // Log filter by editore
    filtered = filtered.filter(
      (book) => book.editore === selectedEditore.value.value
    );
  }
  if (!showFranceseBooks.value) {
    filtered = filtered.filter((book) => book.lingua !== "Francese");
  }
  console.log("Filtered Bibliografia:", filtered); // Log filtered data
  return filtered;
});

const openDettaglioLibro = () => {
  try {
    console.log("Opening DettaglioLibro with id = 123");
    router.push({ name: "DettaglioLibro", params: { id: "123" } });
  } catch (error) {
    console.error("Error navigating to DettaglioLibro:", error);
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedEditore.value = "";
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
</style>
