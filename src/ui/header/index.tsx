import React from "react";
import { connect } from "react-redux";
import { actions } from "../../domain";
import { header as ids } from "../testId";
import { Bars, Fill, Search } from "../icons";
import "./styles.css";
import logo from "./logo.png";
import { logout } from "../../api/firebase.login";

type Props = ReturnType<typeof mapState>;
class Header extends React.Component<Props> {
  state = {
    searchValue: "",
  };
  onSearchRequest = () => actions.searchForItems(this.state.searchValue);

  toggleColorScheme = () => {
    actions.setColorScheme(this.props.scheme === "dark" ? "light" : "dark");
  };
  render() {
    const { userState } = this.props;
    let image =
      userState.state === "userLoggedIn" ? userState.picture : undefined;
    image = image || undefined;
    return (
      <div className="header">
        <Bars
          className="icon bars-icon"
          data-testid={ids.toggleSidebarButton}
          onClick={() => actions.toggleSidebar()}
        />
        <img className="header-logo logo" src={logo} alt="" />
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
          <img src={image} alt="" />
        </div>
        <button onClick={logout}>logout</button>
      </div>
    );
  }
}

const mapState = (state: MyState) => ({
  scheme: state.colorScheme,
  userState: state.loginState,
});

export default connect(mapState)(Header);
