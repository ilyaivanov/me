import React from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions, RootState } from "./state";
import Sidebar from "./sidebar";
import Gallery from "./gallery";
import Player from "./player";
import Header from './header';

interface Props extends AllActions {
  isSidebarVisible: boolean;
}
const App = (props: Props) => {
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
<Header/>
      </div>
      <div className="page-body">
        <Gallery isSidebarVisible={props.isSidebarVisible} />
      </div>
      <Player />
    </div>
  );
};

const mapState = (state: RootState) => ({
  isSidebarVisible: state.isSidebarVisible,
});

export default connect(mapState, allActions)(App);
