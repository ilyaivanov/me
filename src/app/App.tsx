import React from "react";
import "./App.css";
import { cn } from "./utils";
import { connect } from "react-redux";
import { toggleSidebar } from "./state";

const App = (props: any) => (
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

export default connect(mapState, { toggleSidebar })(App);
