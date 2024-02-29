import { boot } from "quasar/wrappers";
import FirebaseUploader from "../firebase/FirebaseUploader"; // Adjust the path as needed
import store from "../store"; // Import the Vuex store

export default boot(({ app }) => {
  // Register FirebaseUploader component globally
  app.component("FirebaseUploader", FirebaseUploader);

  // Make the Vuex store accessible globally in your app
  app.use(store);
});
