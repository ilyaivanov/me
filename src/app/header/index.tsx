import React from "react";
import { allActions, AllActions } from "../state";
import { connect } from "react-redux";
import { ids } from "./pageObject";
import { searchVideos } from "../api/searchVideos";
import { Bars, Search } from "../icons";
import "./styles.css";

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
      this.props.setItemChildren("SEARCH", items);
    });
  };

  render() {
    return (
      <div className="header">
        <div
          className="bars-icon"
          data-testid={ids.toggleSidebarButton}
          onClick={this.props.toggleSidebar}
        >
          <Bars />
        </div>
        <div className="search-container">
          <input
            value={this.state.searchValue}
            onChange={(e) =>
              this.setState({ searchValue: e.currentTarget.value })
            }
            onKeyUp={e => e.key === 'Enter' && this.onSearchRequest()}
            placeholder="Search"
            type="text"
            data-testid={ids.searchInput}
          />
          <div
            className="search-button flex-center"
            onClick={this.onSearchRequest}
            data-testid={ids.searchButton}
          >
            <Search />
          </div>
        </div>
        <div className="user-image">
          <img
            src={
              "https://lh3.googleusercontent.com/a-/AOh14GhCqz7P0RtxsLFOA5y-ExVLSivm4wTSXhJWPI9-Zg=s88-c-k-c0x00ffffff-no-rj-mo"
            }
            alt=""
          />
        </div>
      </div>
    );
  }
}

export default connect(undefined, allActions)(Header);
