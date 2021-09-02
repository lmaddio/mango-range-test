import React from "react";
import PropTypes from "prop-types";

import "./DotRange.css";

const DOT_SIZE = 20;
export const LEFT_DOT_POS = DOT_SIZE / 2;
export const DOT_ID = "bar-dot";

// Functional component had some errors keeping the state up to date
export class DotRange extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      (state.isSelected && state.dotPosition === null && state.dotPosition !== props.value)
      || (!state.isSelected && state.dotPosition !== props.value)
    ) {
      return {
        dotPosition: props.value
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,
      dotPosition: props.value
    };
  }

  onComponentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onCleanEvent);
    window.removeEventListener("mouseleave", this.onCleanEvent);
    window.addEventListener("touchmove", this.onMouseMove);
    window.addEventListener("touchend", this.onCleanEvent);
  };

  addListeners = () => {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onCleanEvent);
    window.addEventListener("mouseleave", this.onCleanEvent);
    window.addEventListener("touchmove", this.onMouseMove);
    window.addEventListener("touchend", this.onCleanEvent);
  };

  setSelect = (newState, cb = () => {}) => {
    this.setState({
      isSelected: newState
    }, cb);
  };

  onMouseMove = (event) => {
    if (this.state.isSelected) {
      let clientX = event.clientX;

      if (clientX !== 0 && !clientX) {
        const evt = (typeof event.originalEvent === "undefined") ? event : event.originalEvent;
        const touch = evt.touches[0] || evt.changedTouches[0];
        clientX = touch.pageX;
      }

      const { maxRight, maxLeft, leftPos } = this.props;
      const cursorPos = clientX - leftPos;

      let dotPosition = cursorPos <= maxLeft ? maxLeft : cursorPos;

      if (cursorPos > maxRight) {
        dotPosition = maxRight;
      }

      this.setState({ dotPosition });
    }
  };

  onMouseDown = () => {
    this.setSelect(true, () => {
      document.body.style.cursor = "grabbing";
      this.addListeners();
      this.props.checkBarPosition();
    });
  };

  onCleanEvent = () => {
    this.removeListeners();
    this.props.setValue(this.state.dotPosition);
    this.setSelect(false, () => {
      document.body.style.cursor = "default";
    });
  };

  render() {
    const { color, value, maxLeft, maxRight } = this.props;
    const { isSelected, dotPosition } = this.state;

    let leftPosition = value - LEFT_DOT_POS;
    let className = isSelected ? "dot-range dragging" : "dot-range";

    if (isSelected && dotPosition >= maxLeft && dotPosition <= maxRight) {
      leftPosition = dotPosition - LEFT_DOT_POS;
    } else if (!isSelected && dotPosition !== null && Math.abs(dotPosition - leftPosition) > 2) {
      className = className.concat(" transitioning");
    }

    return (
      <div
        className={className}
        data-testid={DOT_ID}
        onTouchMove={this.onMouseMove}
        onTouchStart={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        style={{ backgroundColor: color, left: leftPosition }}
      />
    );
  }
};

DotRange.defaultProps = {
  color: "red"
};

DotRange.propTypes = {
  color: PropTypes.string,
  value: PropTypes.number.isRequired,
  maxLeft: PropTypes.number.isRequired,
  maxRight: PropTypes.number.isRequired,
  leftPos: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  checkBarPosition: PropTypes.func.isRequired
};