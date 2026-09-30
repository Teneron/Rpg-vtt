import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDi_hPWl-ca9TKzbCJDV2MOIdPeO0cy_2o",
    authDomain: "rpg-vtt-a9684.firebaseapp.com",
    databaseURL: "https://rpg-vtt-a9684-default-rtdb.firebaseio.com",
    projectId: "rpg-vtt-a9684",
    storageBucket: "rpg-vtt-a9684.firebasestorage.app",
    messagingSenderId: "42745942108",
    appId: "1:42745942108:web:fa47fd18bae15c0cc0d699",
    measurementId: "G-3GZYY6DE4G"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
import { getStorage } from "firebase/storage";
export const storage = getStorage(app);
