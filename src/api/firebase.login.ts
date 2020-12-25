import { firebaseAuth, provider } from "./firebase";
import { actions } from "../domain/store";

export const subscribeToAuthChanges = () => {
  firebaseAuth.onAuthStateChanged(function (user) {
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

export const login = () => firebaseAuth.signInWithPopup(provider);

export const logout = () => {
  firebaseAuth.signOut();
};
