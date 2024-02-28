import { boot } from "quasar/wrappers";
import FirebaseUploader from "../firebase/FirebaseUploader"; // Adjust the path as needed

export default boot(({ app }) => {
  // Register FirebaseUploader component globally
  app.component("FirebaseUploader", FirebaseUploader);
});
