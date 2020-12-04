import React from "react";
import { connect } from "react-redux";
import { actions } from "../../app/state";
import { header as ids } from "../testId";
import { searchVideos } from "../../app/api/searchVideos";
import { Bars, Fill, Search } from "../icons";
import "./styles.css";
import logo from "./logo.png";

type Props = ReturnType<typeof mapState>;
class Header extends React.Component<Props> {
  state = {
    searchValue: "",
  };
  onSearchRequest = () => {
    actions.setSearchState({
      stateType: "loading",
      term: this.state.searchValue,
    });
    actions.focusNode("SEARCH");
    searchVideos(this.state.searchValue).then((response) => {
      actions.setSearchState({
        stateType: "done",
        term: this.state.searchValue,
      });
      actions.replaceChildren("SEARCH", response.items);
      actions.changeItem("SEARCH", {
        youtubePlaylistNextPageId: response.nextPageToken,
      });
    });
  };

  toggleColorScheme = () => {
    actions.setColorScheme(this.props.scheme === "dark" ? "light" : "dark");
  };
  render() {
    return (
      <div className="header">
        <Bars
          className="icon bars-icon"
          data-testid={ids.toggleSidebarButton}
          onClick={() => actions.toggleSidebar()}
        />
        <img className="logo" src={logo} alt="" />
        <div className="search-container">
          <input
            value={this.state.searchValue}
            onChange={(e) =>
              this.setState({ searchValue: e.currentTarget.value })
            }
            onKeyUp={(e) => e.key === "Enter" && this.onSearchRequest()}
            placeholder="Search"
            type="text"
            data-testid={ids.searchInput}
          />
          <div
            className="search-button icon-hover-container"
            onClick={this.onSearchRequest}
            data-testid={ids.searchButton}
          >
            <Search className="icon search-icon" />
          </div>
        </div>
        <Fill className="icon fill-icon" onClick={this.toggleColorScheme} />
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

const mapState = (state: MyState) => ({
  scheme: state.colorScheme,
});

export default connect(mapState)(Header);
