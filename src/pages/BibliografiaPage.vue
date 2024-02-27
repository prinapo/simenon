<template>
  <div>
    <q-btn
      @click="openDettaglioLibro"
      label="Open DettaglioLibro"
      color="primary"
    />
    <div class="cards">
      <router-link
        v-for="book in bibliografia"
        :key="book.id"
        :to="{ name: 'DettaglioLibro', params: { id: book.id } }"
        class="card"
      >
        <q-item clickable v-ripple>
          <q-item-section>
            <q-img :src="book.signedUrl" width="120px" fit="scale-down" />
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
import { ref, onMounted } from "vue";
import { db } from "../firebase/firebaseInit";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useRouter } from "vue-router";

const bibliografia = ref([]);
const router = useRouter();

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
    }));
  } catch (error) {
    console.error("Error fetching Bibliografia:", error);
  }
};

const openDettaglioLibro = () => {
  try {
    // Navigate to DettaglioLibro page with id parameter
    console.log("Opening DettaglioLibro with id = 123");
    router.push({ name: "DettaglioLibro", params: { id: "123" } });
  } catch (error) {
    console.error("Error navigating to DettaglioLibro:", error);
  }
};

onMounted(fetchBibliografia);
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
