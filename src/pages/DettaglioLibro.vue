<template>
  <div>
    <q-card class="card-container">
      <q-card-section>
        <!-- Conditionally render q-img based on signedUrl -->
        <q-img
          v-if="book.signedUrl"
          :src="book.signedUrl"
          width="600px"
          @click="openFileUploadDialog"
          style="cursor: pointer"
        />

        <!-- Use placeholder URL if signedUrl is empty -->
        <q-img
          v-else
          src="https://firebasestorage.googleapis.com/v0/b/simenon-db758.appspot.com/o/400x600.png?alt=media"
          width="600px"
          style="cursor: pointer"
        />
        <FirebaseUploader
          :blocking="true"
          directory="images"
          @uploaded="handleFileUploaded"
          :fileInputRef="fileInputRef"
          label="Upload files"
          color="purple"
          square
          flat
          bordered
          style="max-width: 300px"
        />
      </q-card-section>

      <q-card-section>
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
      </q-card-section>
    </q-card>
  </div>
  <!-- Use the FirebaseUploader component instead of input element -->
  <FirebaseUploader
    :blocking="true"
    directory="images"
    @uploaded="handleFileUploaded"
    :fileInputRef="fileInputRef"
    label="Upload files"
    color="purple"
    square
    flat
    bordered
    style="max-width: 300px"
  />
  <q-uploader
    url="http://localhost:4444/upload"
    label="Upload files"
    color="purple"
    square
    flat
    bordered
    style="max-width: 300px"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db, storage } from "../firebase/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import { useRoute } from "vue-router";

const route = useRoute();
const book = ref({});
const fileInputRef = ref(null);

const handleFileUploaded = (files) => {
  console.log("File uploaded:", files);
  // You can handle the uploaded file here, if needed
};

const fetchBookDetails = async () => {
  try {
    const docRef = doc(db, "Bibliografia", route.params.id);
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
  const id = route.params.id; // Accessing params from route object
  console.log("Fetching book details for ID:", id); // Log ID being fetched
  fetchBookDetails(id);
});

// const openFileUploadDialog = () => {
//   // Trigger file upload process through FirebaseUploader component
//   console.log("Opening file upload dialog...");
//   if (fileInputRef.value) {
//     console.log("File input ref exists:", fileInputRef.value);
//     fileInputRef.value.click();
//   } else {
//     console.log("File input ref does not exist:", fileInputRef.value);
//   }
// };
// const uploadFile = async (event) => {
//   console.log("Starting file upload...");
//   const file = event.target.files[0];
//   const fileId = route.params.id;
//   const fileExtension = file.name.split(".").pop();
//   const storageRef = storage.ref(`${fileId}.${fileExtension}`);

//   try {
//     await storageRef.put(file);
//     console.log("File uploaded successfully!");
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// };
</script>
