const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const keyPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.warn(
    "\n[cognifyai] serviceAccountKey.json not found in backend/src/config/.\n" +
    "Download it from Firebase Console -> Project settings -> Service accounts,\n" +
    "and place it there. Firestore-backed routes will fail until then.\n"
  );
} else {
  admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
}

module.exports = admin;
