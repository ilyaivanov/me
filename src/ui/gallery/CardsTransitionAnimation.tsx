import React from "react";
import { connect } from "react-redux";
import gsap from "gsap";
import { findParentId, isAChildOf } from "../../domain/selectors";

enum Direction {
  up,
  down,
  left,
  right,
}

interface Props extends ReturnType<typeof mapState> {
  nodeFocusedId: string;
  children: JSX.Element | null;
}
interface State {
  needToTriggerAnimation: boolean;
  currentNodeFocusedId: string | undefined;
  childrenToRender: JSX.Element | null;
  direction: Direction;
}

class CardsTransitionAnimation extends React.Component<Props, State> {
  ref = React.createRef<HTMLDivElement>();

  state = {
    needToTriggerAnimation: false,
    childrenToRender: null,
    currentNodeFocusedId: "",
    direction: Direction.down,
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> {
    const needToTriggerAnimation =
      !!prevState.currentNodeFocusedId &&
      prevState.currentNodeFocusedId !== nextProps.nodeFocusedId;
    return {
      needToTriggerAnimation,
      currentNodeFocusedId: nextProps.nodeFocusedId,
      childrenToRender: needToTriggerAnimation
        ? prevState.childrenToRender
        : nextProps.children,
      direction: prevState.currentNodeFocusedId
        ? CardsTransitionAnimation.getDirectionOfFocusChange(
            nextProps.items,
            prevState.currentNodeFocusedId,
            nextProps.nodeFocusedId
          )
        : Direction.left,
    };
  }

  static getDirectionOfFocusChange = (
    items: NodesContainer,
    prevItem: string,
    nextItem: string
  ) => {
    const prevParent = findParentId(items, prevItem);
    if (prevParent) {
      const context = items[prevParent].children;
      const nextItemIndex = context.indexOf(nextItem);
      if (nextItemIndex > 0) {
        const prevItemIndex = context.indexOf(prevItem);
        return prevItemIndex < nextItemIndex ? Direction.down : Direction.up;
      }
    }

    if (isAChildOf(items, prevItem, nextItem)) return Direction.right;

    return Direction.left;
  };

  componentDidUpdate() {
    if (this.ref.current && this.state.needToTriggerAnimation) {
      const shiftPoint = this.getAnimationShift(this.state.direction);
      gsap
        .to(this.ref.current, {
          x: -shiftPoint.x,
          y: -shiftPoint.y,
          opacity: 0,
          ease: "power1.in",

          duration: 0.125,
        })
        .then(() => {
          this.setState({
            needToTriggerAnimation: false,
            childrenToRender: this.props.children,
          });
          gsap.set(this.ref.current, { x: shiftPoint.x, y: shiftPoint.y });
          gsap.to(this.ref.current, {
            x: 0,
            y: 0,
            opacity: 1,
            ease: "power1.out",
            duration: 0.15,
          });
        });
    }
  }

  travelDistance = 30;
  getAnimationShift = (direction: Direction): { x: number; y: number } => ({
    x:
      direction === Direction.left
        ? -this.travelDistance
        : direction === Direction.right
        ? this.travelDistance
        : 0,
    y:
      direction === Direction.up
        ? -this.travelDistance
        : direction === Direction.down
        ? this.travelDistance
        : 0,
  });

  render() {
    return <div ref={this.ref}>{this.state.childrenToRender}</div>;
  }
}

const mapState = (state: MyState) => ({
  items: state.items,
});
export default connect(mapState)(CardsTransitionAnimation);
