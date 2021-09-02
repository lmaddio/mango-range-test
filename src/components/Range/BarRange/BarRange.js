import React from "react";
import PropTypes from "prop-types";
import { BarLabel } from "./BarLabel";
import "./BarRange.css";

const Bar = React.forwardRef((_, ref) => (
  <div className="bar-range" ref={ref}/>
));

const Step = ({ className = "", position }) => (
  <div className={`step ${className}`} style={{ left: position }}/>
);

Step.defaultProps = {
  className: ""
};

Step.propTypes = {
  className: PropTypes.string,
  position: PropTypes.number.isRequired
};

export const BarRange = React.forwardRef(({
  minValue,
  onChangeMin,
  maxValue,
  onChangeMax,
  isEditable,
  pointsRange = [],
}, ref) => (
  <div className="bar-range-container">
    <BarLabel
      className="left-label"
      contentEditable={isEditable}
      onChange={onChangeMin}
      inputValue={minValue}
    />

    <Bar ref={ref}/>
    {
      pointsRange.map((value, index) => (
        <Step key={index.toString()} position={value} />
      ))
    }

    <BarLabel
      className="right-label"
      contentEditable={isEditable}
      onChange={onChangeMax}
      inputValue={maxValue}
    />
  </div>
));

BarRange.defaultProps = {
  pointsRange: []
};

BarRange.propTypes = {
  minValue: PropTypes.number.isRequired,
  onChangeMin: PropTypes.func.isRequired,
  maxValue: PropTypes.number.isRequired,
  onChangeMax: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  pointsRange: PropTypes.arrayOf(PropTypes.number)
};
