import React from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions, RootState } from "./state";
import Sidebar from "./Sidebar";

interface Props extends AllActions {
  isSidebarVisible: boolean;
}
const App = (props: Props) => (
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
      HEADER
      <button data-testid="toggle-sidebar" onClick={props.toggleSidebar}>
        toggle
      </button>
    </div>
    <div className="page-body">BODY</div>
  </div>
);

const mapState = (state: RootState) => ({
  isSidebarVisible: state.isSidebarVisible,
});

export default connect(mapState, allActions)(App);
