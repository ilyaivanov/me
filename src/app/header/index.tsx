import React from "react";
import { allActions, AllActions } from "../state";
import { connect } from "react-redux";
import { ids } from "./pageObject";
import { searchVideos } from "../api/searchVideos";

class Header extends React.Component<AllActions> {
  state = {
    searchValue: "",
  };
  onSearchRequest = () => {
    this.props.setSearchState({
      stateType: "loading",
      term: this.state.searchValue,
    });
    this.props.focusNode("SEARCH");
    searchVideos(this.state.searchValue).then((items) => {
      this.props.setSearchState({
        stateType: "done",
        term: this.state.searchValue,
      });
      this.props.itemsLoadedFromSearch(items);
    });
  };

  render() {
    return (
      <div>
        HEADER
        <button
          data-testid={ids.toggleSidebarButton}
          onClick={this.props.toggleSidebar}
        >
          toggle
        </button>
        <input
          value={this.state.searchValue}
          onChange={(e) =>
            this.setState({ searchValue: e.currentTarget.value })
          }
          type="text"
          data-testid={ids.searchInput}
        />
        <button onClick={this.onSearchRequest} data-testid={ids.searchButton}>
          search
        </button>
      </div>
    );
  }
}

export default connect(undefined, allActions)(Header);
