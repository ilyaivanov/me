import React, { useEffect } from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions, RootState } from "./state";
import Sidebar from "./sidebar";
import Gallery from "./gallery";
import Player from "./player";
import Header from "./header";
import DndAvatar from "./DndAvatar";
import firebaseApi from "./api/firebase";

type Props = ReturnType<typeof mapState> & AllActions;

const App = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    firebaseApi.load().then((board) => {
      if (board) {
        props.setItems(board);
      }

      setIsLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="overlay flex-center">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
        Loading app...
      </div>
    );
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

const mapState = (state: RootState) => ({
  isSidebarVisible: state.isSidebarVisible,
  items: state.items,
});

export default connect(mapState, allActions)(App);
