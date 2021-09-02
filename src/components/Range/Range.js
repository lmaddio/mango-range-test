import React from "react";
import PropTypes from "prop-types";
import { BarRange } from "./BarRange";
import { DotRange } from "./DotRange";

import "./Range.css";

export class Range extends React.Component {
  static convertFromRanges(fromA, toA, fromB, toB) {
    const newDiff = toB - fromB;
    const oldDiff = toA - fromA;

    return oldValue => Number((((oldValue - fromA) / oldDiff) * newDiff + fromB).toFixed(2));
  }

  static getNodeSizeAndPosition(node) {
    const { left, right, width } = node.getBoundingClientRect();

    return {
      leftPos: left,
      rightPos: right,
      width
    };
  }

  constructor(props) {
    super(props);
    this.barRef = React.createRef();
    this.resizeObserver = new ResizeObserver(this.resizeCallback);

    const { pointsRange, min, max } = props;
    const minTotalValue = pointsRange.length > 0 ? pointsRange[0] : min;
    const maxTotalValue = pointsRange.length > 0 ? pointsRange[pointsRange.length - 1] : max;

    this.state = {
      minTotalValue,
      maxTotalValue,
      pointsRange: [],
      barData: {
        leftPos: 0,
        rightPos: 1,
        width: 1
      }
    };
  }

  onChangeMin = (newValue) => {
    let value = newValue;

    if (newValue >= this.state.maxTotalValue) {
      value = this.state.maxTotalValue - 1;
    } else if (newValue < this.props.min) {
      value = this.props.min;
    }
    if (this.state.minTotalValue === value) {
      return [value];
    }

    this.setState({
      minTotalValue: value
    });
  }

  onChangeMax = (newValue) => {
    let value = newValue;

    if (newValue <= this.state.minTotalValue) {
      value = this.state.minTotalValue + 1;
    } else if (newValue > this.props.max) {
      value = this.props.max;
    }
    if (this.state.maxTotalValue === value) {
      return [value];
    }

    this.setState({
      maxTotalValue: value
    });
  }

  findClosestValuePx = (valueInPixels) => {
    const { pointsRange = [] } = this.state;

    return pointsRange.findIndex((pointsInPx, currentIndex) => {
      const nextValueInPixels = pointsRange[currentIndex + 1];

      const currentValueDiff = Math.abs(pointsInPx - valueInPixels);
      const nextValueDiff = Math.abs(nextValueInPixels - valueInPixels);

      if (nextValueInPixels && currentValueDiff > nextValueDiff) {
        return false;
      }

      return true;
    });
  }

  setMinDotValuePx = (valueInPixels) => {
    const { isDraggable, pointsRange, min, max } = this.props;

    if (isDraggable) {
      const { maxTotalValue, barData } = this.state;
      const convertPixelToNumber = Range.convertFromRanges(0, barData.width, min, max);
      const valueInNumber = convertPixelToNumber(valueInPixels);

      const newValue = valueInNumber >= maxTotalValue ? maxTotalValue - 1 : valueInNumber;
      const minTotalValue = newValue <= min ? min : newValue;

      this.setState({ minTotalValue });
    } else if (pointsRange.length > 0) {
      const closestPointIndex = this.findClosestValuePx(valueInPixels);
      let minTotalValue = pointsRange[closestPointIndex];

      if (minTotalValue === this.state.maxTotalValue) {
        minTotalValue = pointsRange[closestPointIndex - 1];
      }

      this.setState({ minTotalValue });
    }
  }

  setMaxDotValuePx = (valueInPixels) => {
    const { isDraggable, pointsRange, min, max } = this.props;

    if (isDraggable) {
      const { minTotalValue, barData } = this.state;
      const convertPixelToNumber = Range.convertFromRanges(0, barData.width, min, max);
      const valueInNumber = convertPixelToNumber(valueInPixels);

      const newValue = valueInNumber <= minTotalValue ? minTotalValue + 1 : valueInNumber;
      const maxTotalValue = newValue > max ? max : newValue;

      this.setState({ maxTotalValue });
    } else if (pointsRange.length > 0) {
      const closestPointIndex = this.findClosestValuePx(valueInPixels);
      let maxTotalValue = pointsRange[closestPointIndex];

      if (maxTotalValue === this.state.minTotalValue) {
        maxTotalValue = pointsRange[closestPointIndex + 1];
      }

      this.setState({ maxTotalValue });
    }
  }

  resizeCallback = (entries) => {
    const entry = [...entries].find(entry => entry.target.isEqualNode(this.barRef.current));

    this.checkBarPosition(entry.target);
  }

  checkBarPosition = (node) => {
    const barElement = node || this.barRef.current;
    if (!barElement) {
      return ;
    }
    const { leftPos, width } = this.state.barData;
    const barData = Range.getNodeSizeAndPosition(barElement);

    if (barData.left !== leftPos || barData.width !== width) {
      const { min, max, pointsRange } = this.props;
      const convertValueToPixel = Range.convertFromRanges(min, max, 0, barData.width);

      this.setState({
        barData,
        pointsRange: pointsRange.map(convertValueToPixel)
      });
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  componentDidMount() {
    this.checkBarPosition();

    this.resizeObserver.observe(this.barRef.current);
  }

  render() {
    const {
      barData,
      minTotalValue,
      maxTotalValue
    } = this.state;
    const { min, max } = this.props;
    const convertValueToPixel = Range.convertFromRanges(min, max, 0, barData.width);

    const minDotValuePx = convertValueToPixel(minTotalValue);
    const maxDotValuePx = convertValueToPixel(maxTotalValue);

    return (
      <div className="range">
        <DotRange
          name="left"
          color="blue"
          value={minDotValuePx}
          setValue={this.setMinDotValuePx}
          leftPos={barData.leftPos}
          maxLeft={0}
          maxRight={maxDotValuePx}
          checkBarPosition={this.checkBarPosition}
        />
        <BarRange
          ref={this.barRef}
          isEditable={this.props.isEditable}
          pointsRange={this.state.pointsRange}
          minValue={minTotalValue}
          maxValue={maxTotalValue}
          onChangeMin={this.onChangeMin}
          onChangeMax={this.onChangeMax}
        />
        <DotRange
          name="right"
          color="red"
          value={maxDotValuePx}
          setValue={this.setMaxDotValuePx}
          leftPos={barData.leftPos}
          maxLeft={minDotValuePx}
          maxRight={barData.width}
          checkBarPosition={this.checkBarPosition}
        />
      </div>
    );
  }
}

Range.defaultProps = {
  pointsRange: [],
  isEditable: false,
  isDraggable: false
}

Range.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  isEditable: PropTypes.bool,
  isDraggable: PropTypes.bool,
  pointsRange: PropTypes.arrayOf(PropTypes.number)
};
