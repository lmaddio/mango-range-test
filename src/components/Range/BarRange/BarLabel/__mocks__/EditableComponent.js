import React from 'react';
import PropTypes from "prop-types";

const _ = () => {};

// Mocking this component takes a significant amount of time because of the different functionality it has in compared with a contenteditable div

export const EditableComponent = ({
  onKeyPress, contentEditable, htmlContent, innerRef, ...restProps
}) => (
  <input
    {...restProps}
    onKeyDown={(event) => {
      const { key, which, target } = event;

      onKeyPress({ key, which, target: { innerText: target.value }, preventDefault: () =>{} })
    }}
    value={htmlContent}
    ref={innerRef}
  />
)

EditableComponent.defaultProps = {
  className: "",
  onKeyPress: _,
  onBlur: _
};

EditableComponent.propTypes = {
  contentEditable: PropTypes.bool.isRequired,
  htmlContent: PropTypes.string.isRequired,
  className: PropTypes.string,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  innerRef: PropTypes.any.isRequired
};

