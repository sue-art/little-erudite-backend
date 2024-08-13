import express from "express";
import admin from "firebase-admin";
import functions from "firebase-functions";
import { getAuth } from "firebase-admin/auth";

import pkg from "firebase-admin";
const { firestore } = pkg;
import dotenv from "dotenv";
dotenv.config();
//import { firebaseConfig } from "./firebaseConfig.js";

//import firebaseAdminConfig from "../service-account-file.json" assert { type: "json" };

const router = express.Router();

const firebaseAdminConfig = {
  type: process.env.REACT_APP_FIREBASE_TYPE,
  project_id: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  private_key_id: process.env.REACT_APP_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_FIREBASE_CLIENT_ID,
  auth_uri: process.env.REACT_APP_FIREBASE_AUTH_URI,
  token_uri: process.env.REACT_APP_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.REACT_APP_FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.REACT_APP_FIREBASE_CERT_URL,
  universe_domain: process.env.REACT_APP_FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin only once
// Initialize the app if it hasn't been initialized yet

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    projectId: "little-erudite",
  });
}

console.log(admin.apps.length);
console.log(admin.app().name);

const uid = "Gp1TxIycgaYZ4eaLP4qG4soua992";
const receiveemail = "suepark0305@gmail.com";
//const userToken = process.env.REACT_APP_FIREBASE_vapidKey;
//const userToken = await getAuth().createCustomToken(uid);
//onsole.log(userToken);

// Function to add email to Firestore
const addEmailToFirestore = async (to, subject, htmlBody) => {
  try {
    console.log("Adding email to Firestore");
    const docRef = await admin
      .firestore()
      .collection("mail")
      .add({
        to: receiveemail,
        message: {
          subject: subject,
          html: htmlBody,
        },
      });

    const docId = docRef.id;

    await docRef.update({
      docId: docId,
    });

    console.log("Email added to Firestore with ID: ", docId);
    return docId;
  } catch (error) {
    console.error("Error adding email to Firestore: ", error);
    throw error;
  }
};

const sendMessage = async (title, body) => {
  getAuth()
    .createCustomToken(uid)
    .then((customToken) => {
      // Send token back to client
      console.log("Custom token created:", customToken);
      const message = {
        notification: {
          title: title,
          body: body,
        },
      };
      admin.messaging().send(message);
      console.log("Notification sent");
    })
    .catch((error) => {
      console.log("Error creating custom token:", error);
    });
};

router.put("/message", async (req, res) => {
  const { email, name, message } = req.body;
  const title = "Contact form notification from: " + name + " : " + email;
  const body =
    "This email from Contact Us form from Little Erudite - From: " +
    email +
    "<br/>" +
    message;

  try {
    const result = await addEmailToFirestore(email, title, body);
    res.json(result);
    //res.status(200).json("Email added to Firestore and notification sent");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

export default router;
