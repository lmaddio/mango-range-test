import React, { useRef } from "react";
import PropTypes from "prop-types";
import { EditableComponent } from "./EditableComponent";
import "./BarLabel.css";

const VALID_KEYS = ["Enter"];
export const CURRENCY = "€";

export const BarLabel = ({
  contentEditable,
  onChange,
  className,
  inputValue
}) => {
  const inputRef = useRef(null);

  const onBlur = (event) => {
    const evt = Object.assign({}, event, {
      key: VALID_KEYS[0],
      preventDefault: () => {}
    });

    onKeyPress(evt);
  };

  const onKeyPress = (event) => {
    const { target, key } = event;
    const value = target.innerText;

    if (!VALID_KEYS.includes(key)) {
      if (Number.isNaN(Number(String.fromCharCode(event.which)))) {
        event.preventDefault();
      }

      return ;
    }
    event.preventDefault();
    const numericValue = Number(value.replace(CURRENCY, "").replace(/ /g, ""));

    if (Number.isNaN(numericValue) || inputValue === numericValue) {
      return ;
    }

    const newValue = onChange(numericValue);
    // This will force the HTML to update when the value in React hasn"t change
    if (newValue) {
      if (inputRef && inputRef.current) {
        inputRef.current.innerHTML = `${newValue[0]} ${CURRENCY}`;
      }
    }
  }

  const editableProps = contentEditable ? { onKeyPress, onBlur } : {};

  return (
    <EditableComponent
      innerRef={inputRef}
      htmlContent={`${inputValue} ${CURRENCY}`}
      className={`range-label ${className} ${!contentEditable ? "disabled" : ""}`}
      contentEditable={contentEditable}
      {...editableProps}
    />
  );
}

BarLabel.defaultProps = {
  className: ""
};

BarLabel.propTypes = {
  contentEditable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  inputValue: PropTypes.number.isRequired
};
