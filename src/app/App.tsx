import React from "react";
import "./App.css";
import { cn } from "./utils";

class App extends React.Component {
  state = {
    isSidebarVisible: true,
  };
  toggle = () =>
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  render() {
    return (
      <div className="page-container">
        <aside
          data-testid="sidebar"
          className={cn({
            "navigation-sidebar": true,
            closed: !this.state.isSidebarVisible,
          })}
        >
          SIDEBAR
        </aside>
        <div className="body-header">
          HEADER
          <button data-testid="toggle-sidebar" onClick={this.toggle}>toggle</button>
        </div>
        <div className="page-body">BODY</div>
      </div>
    );
  }
}

export default App;
