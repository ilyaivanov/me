import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import "./colors.css";
import { cn } from ".";
import Sidebar from "./sidebar";
import Gallery from "./gallery";
import Player from "./player";
import Header from "./header";
import DndAvatar from "./dragAvatar";
import firebaseApi from "../api/firebase";
import * as ids from "./testId";
import { actions } from "../domain";
import { rootNodes } from "../domain/store";

type Props = ReturnType<typeof mapState>;

const App = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [ref, setRef] = React.useState<HTMLDivElement | undefined>(undefined);

  useEffect(() => {
    firebaseApi.load().then((board) => {
      if (board) {
        actions.setItems({
          ...rootNodes,
          ...board,
        });
      }

      setIsLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="overlay flex-center">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
        Loading app...
      </div>
    );
  return (
    <div
      className={cn({
        "page-container": true,
        "light-colors": props.scheme === "light",
        "dark-colors": props.scheme === "dark",
      })}
    >
      <aside
        data-testid={ids.sidebar.sidebarContainer}
        className={cn({
          "navigation-sidebar": true,
          closed: !props.isSidebarVisible,
        })}
      >
        <Sidebar />
      </aside>
      <div className="body-header">
        <Header />
      </div>
      <div
        className="page-body"
        onMouseEnter={() => actions.setCardDragAvatarType("big")}
        onScroll={(e) => actions.onSubtracksScroll(e, props.itemFocused)}
      >
        <div ref={(s) => s && setRef(s)}></div>

        <Gallery />
      </div>
      <Player galleryPlayer={ref} />
      <DndAvatar />
    </div>
  );
};

const mapState = (state: MyState) => ({
  isSidebarVisible: state.isSidebarVisible,
  items: state.items,
  scheme: state.colorScheme,
  itemFocused: state.items[state.nodeFocusedId],
});

export default connect(mapState)(App);
