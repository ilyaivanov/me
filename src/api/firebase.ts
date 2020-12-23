import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

if (process.env.NODE_ENV === "test")
  throw new Error("Tried to initialize Firebase from tests");

var firebaseConfig = {
  apiKey: "AIzaSyBdqdXjle6-p2Mjp1TarQ8D8wKeJhXCfMs",
  authDomain: "slapstuk.firebaseapp.com",
  databaseURL: "https://slapstuk.firebaseio.com",
  projectId: "slapstuk",
  storageBucket: "slapstuk.appspot.com",
  messagingSenderId: "38999431091",
  appId: "1:38999431091:web:b8fd2629dfeabc96b39dc6",
  measurementId: "G-C3RB7NB0ZD",
};
firebase.initializeApp(firebaseConfig);

export const save = (items: NodesContainer, userId: string) =>
  firebase
    .firestore()
    .collection("boards")
    .doc(userId)
    .set(items)
    .catch((e) => {
      console.error("Error while saving board", e, items);
    });

export const saveUserSettings = (
  userSettings: UserSettings,
  userId: string
) => {
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({
      id: userId,
      ...userSettings,
    })
    .catch((e) => {
      console.error("Error while saving user settings");
    });
};

export type UserSettings = {
  nodeFocused: string;
};

export const load = (userId: string): Promise<NodesContainer> =>
  firebase
    .firestore()
    .collection("boards")
    .doc(userId)
    .get()
    .then((res) => res.data() as NodesContainer);

export const loadUserSettings = (userId: string): Promise<UserSettings> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((res) => res.data() as UserSettings);

export const auth = () => {};

const api = {
  save,
  saveUserSettings,
  load,
  loadUserSettings,
  auth,
};
export default api;
