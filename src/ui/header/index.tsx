import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { actions } from "../../domain";
import { header as ids } from "../testId";
import { Bars, Cog, Search } from "../icons";
import "./styles.css";
import "./switch.css";
import logo from "./logo.png";
import { logout } from "../../api/firebase.login";
import { cn } from "..";

type Props = ReturnType<typeof mapState>;
class Header extends React.Component<Props> {
  state = {
    searchValue: "",
    isSettingsShown: false,
    isDarkMode: false,
  };
  isMouseInMenu = false;
  componentDidMount() {
    window.addEventListener("mousedown", this.handleScreenMousePress);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleScreenMousePress);
  }

  handleScreenMousePress = () => {
    if (!this.isMouseInMenu && this.state.isSettingsShown)
      this.setState({ isSettingsShown: false });
  };

  mouseEnterInMenu = () => (this.isMouseInMenu = true);
  mouseLeaveFromMenu = () => (this.isMouseInMenu = false);

  onSearchRequest = () => actions.searchForItems(this.state.searchValue);

  onToggle = (e: ChangeEvent<HTMLInputElement>) => {
    actions.setColorScheme(e.currentTarget.checked ? "dark" : "light");
  };
  render() {
    const { userState, scheme } = this.props;
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
        <div style={{ position: "relative" }}>
          <Cog
            className="icon fill-icon"
            onClick={() => {
              this.setState({
                isSettingsShown: !this.state.isSettingsShown,
              });
            }}
            onMouseEnter={this.mouseEnterInMenu}
            onMouseLeave={this.mouseLeaveFromMenu}
          />
          <div
            className={cn({
              "setting-panel": true,
              hidden: !this.state.isSettingsShown,
            })}
            onMouseEnter={this.mouseEnterInMenu}
            onMouseLeave={this.mouseLeaveFromMenu}
          >
            <div className="setting-panel-triangle" />
            <div className="setting-row">
              <div>Dark mode</div>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={scheme === "dark"}
                    onChange={this.onToggle}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className="setting-row">
              <button className="login-button danger-button" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
        <div className="user-image">
          <img src={image} alt="" />
        </div>
      </div>
    );
  }
}

const mapState = (state: MyState) => ({
  scheme: state.colorScheme,
  userState: state.loginState,
});

export default connect(mapState)(Header);
