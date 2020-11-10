import React from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { allActions, AllActions } from "./state";

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
      SIDEBAR
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

function mapState(state: any) {
  return {
    isSidebarVisible: state.isSidebarVisible,
  };
}

export default connect(mapState, allActions)(App);
