<template>
  <div>
    <h1>{{ book.titolo }}</h1>
    <p>Editor: {{ book.editore }}</p>
    <p>Raccolta: {{ book.raccolta }}</p>
    <p>Confermato: {{ book.confermato }}</p>
    <p>Second Edition Year: {{ book.ed_2Anno }}</p>
    <p>First Edition Possessed: {{ book.ed_1Posseduta }}</p>
    <p>Language: {{ book.lingua }}</p>
    <p>Possessed: {{ book.posseduto }}</p>
    <p>First Edition Year: {{ book.ed_1Anno }}</p>
    <p>Collection Number: {{ book.numeroCollana }}</p>
    <p>Publication Year: {{ book.annoPubblicazione }}</p>
    <p>Edition: {{ book.edizione }}</p>
    <p>Unique ID: {{ book.uniqueId }}</p>
    <p>Collection: {{ book.collana }}</p>
    <p>Original Title: {{ book.titoloOriginale }}</p>
    <p>Book ID: {{ book.bookId }}</p>
    <p>Timestamp: {{ book.timestamp }}</p>

    <!-- <div v-if="book.edizioni.length > 0">
      <h2>Editions</h2>
      <div v-for="(edizione, index) in book.edizioni" :key="index">
        <img :src="edizione.signedUrl" alt="Edition Cover" width="100" />
        <p>Year: {{ edizione.anno }}</p>
        <p>Edition: {{ edizione.edizione }}</p>
        <p>Possessed: {{ edizione.posseduto }}</p>
        <p>Cover Border URL: {{ edizione.signedUrlBorder }}</p>
        <p>Background URL: {{ edizione.signedUrlBck }}</p>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase/firebaseInit";
import { doc, getDoc } from "firebase/firestore";

const book = ref({});

const fetchBookDetails = async () => {
  try {
    const docRef = doc(db, "Bibliografia", $route.params.id);
    console.log("Document Reference:", docRef); // Log document reference
    const docSnap = await getDoc(docRef);
    console.log("Document Snapshot:", docSnap); // Log document snapshot
    if (docSnap.exists()) {
      book.value = {
        id: docSnap.id,
        ...docSnap.data(),
      };
      console.log("Book details:", book.value); // Log book details
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
};

onMounted(() => {
  const id = $route.params.id; // Assuming you have access to $route
  console.log("Fetching book details for ID:", id); // Log ID being fetched
  fetchBookDetails(id);
});
</script>
