import React, { useEffect } from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions, NodesContainer, RootState } from "./state";
import Sidebar from "./sidebar";
import Gallery from "./gallery";
import Player from "./player";
import Header from "./header";
import DndAvatar from "./DndAvatar";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

type Props = ReturnType<typeof mapState> & AllActions;

const App = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    load().then((board) => {
      if (!board) {
        console.log("got no board, saving default to the backend");
        // @ts-ignore
        save(props.items);
      } else {
        //should set items here
        console.log("Done loading", board);
        props.setItems(board);
      }

      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading</div>;
  return (
    <div className="page-container">
      <aside
        data-testid="sidebar"
        className={cn({
          "navigation-sidebar": true,
          closed: !props.isSidebarVisible,
        })}
      >
        <Sidebar />
      </aside>
      <div className="body-header">
        <Header />
      </div>
      <div className="page-body">
        <Gallery isSidebarVisible={props.isSidebarVisible} />
      </div>
      <Player />
      <DndAvatar />
    </div>
  );
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const load = () => {
  return firebase
    .firestore()
    .collection("boards")
    .doc("ilyaivanov")
    .get()
    .then((res) => res.data())
    .catch((e) => {
      console.log(e);
    });
};

const save = (items: NodesContainer) => {
  firebase.firestore().collection("boards").doc("ilyaivanov").set(items);
};

const mapState = (state: RootState) => ({
  isSidebarVisible: state.isSidebarVisible,
  items: state.items,
});

export default connect(mapState, allActions)(App);
