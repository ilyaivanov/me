import firebase from "firebase";
import { actions } from "../domain/store";

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export const subscribeToAuthChanges = () => {
  auth.onAuthStateChanged(function (user) {
    console.log(user);
    if (user)
      actions.setUserState({
        state: "userLoggedIn",
        userId: user.uid,
        userName: user.displayName,
        picture: user.photoURL,
        email: user.email || "",
      });
    else {
      actions.setUserState({
        state: "anonymous",
      });
    }
  });
};

export const login = () => auth.signInWithPopup(provider);

export const logout = () => {
  auth.signOut();
};
