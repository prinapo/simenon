<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card inline class="card-container">
      <q-card-section vertical>
        <!-- Conditionally render q-img based on signedUrl -->
        <q-card-section class="col-5 flex flex-center">
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
            src="placeholderUrl"
            width="600px"
            style="cursor: pointer"
          />
        </q-card-section>

        <q-expansion-item v-if="isLoggedIn" label="Upload Files">
          <FirebaseUploader
            :blocking="true"
            :bookId="book.uniqueId"
            @uploaded="handleFileUploaded"
            :fileInputRef="fileInputRef"
            :directory="'images'"
            label="Upload files"
            color="purple"
            square
            flat
            bordered
            style="max-width: 300px"
          />
        </q-expansion-item>

        <q-card-section>
          <h3>{{ book.titolo }}</h3>
          <p>front: {{ book.signedUrl }}</p>
          <p>back: {{ book.signedUrlBck }}</p>
          <p>Editor: {{ book.editore }}</p>
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
      </q-card-section>
    </q-card>
  </div>
  <!-- List of books -->
  <div class="cards">
    <q-item
      v-for="edizione in book.edizioni"
      :key="edizione.id"
      class="card"
      clickable
      v-ripple
    >
      <!-- Card content -->
      <q-img
        :src="edizione.signedUrl ? edizione.signedUrl : placeholderUrl"
        width="120px"
        fit="scale-down"
      />
      <q-item-section>
        <q-item-label>Year: {{ edizione.anno }}</q-item-label>
        <q-item-label>Edition: {{ edizione.edizione }}</q-item-label>
        <q-item-label>Possessed: {{ edizione.posseduto }}</q-item-label>
        <!-- You can add other fields here -->
      </q-item-section>
    </q-item>
  </div>

  <!-- Use the FirebaseUploader component instead of input element -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db, storage, auth } from "../firebase/firebaseInit";
import { addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useRoute } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";

import FirebaseUploader from "../firebase/FirebaseUploader.js"; // Adjust the path as needed

const { upload } = FirebaseUploader;
const route = useRoute();
const book = ref({});
const fileInputRef = ref(null);
const placeholderUrl =
  "https://firebasestorage.googleapis.com/v0/b/simenon-db758.appspot.com/o/400x600.png?alt=media";
const isLoggedIn = ref(false); // Initialize isLoggedIn as a reactive reference

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

// Define the function to handle uploaded files
const handleFileUploaded = async (filesInfo) => {
  console.log("Files info:", filesInfo);
  const filesInfoArray = filesInfo._rawValue;

  // Check if filesInfo is an array and not empty
  if (Array.isArray(filesInfoArray) && filesInfoArray.length > 0) {
    console.log("Files uploaded:", filesInfoArray);

    // Iterate through the uploaded files information
    filesInfoArray.forEach(async (fileInfoArray) => {
      const fileToUpload = fileInfoArray.originalFile;
      const fileName = `${book.value.uniqueId}.${getFileExtension(
        fileToUpload.name
      )}`;

      // Compose the URL for the uploaded file
      const encodedFileName = encodeURIComponent(fileName);
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/simenon-db758.appspot.com/o/images%2F${encodedFileName}?alt=media`;
      const documentPath = `Bibliografia/${book.value.uniqueId}`;
      const fieldToUpdate = "signedUrl";
      const documentRef = doc(db, documentPath);

      // Update the file signeUrlURL
      updateDoc(documentRef, {
        [fieldToUpdate]: uploadUrl, // Using `uploadUrl` variable directly here
      })
        .then(() => {
          console.log("Document field updated successfully");
          book.value[fieldToUpdate] = uploadUrl;
        })
        .catch((error) => {
          console.error("Error updating document field:", error);
        });
    });
  } else {
    console.log("No files uploaded.");
  }
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

const handleAuthStateChanged = (user) => {
  isLoggedIn.value = !!user; // Update isLoggedIn based on whether user is logged in
};

onMounted(() => {
  const id = route.params.id; // Accessing params from route object
  console.log("Fetching book details for ID:", id); // Log ID being fetched
  fetchBookDetails(id);
  onAuthStateChanged(auth, handleAuthStateChanged);
});
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
