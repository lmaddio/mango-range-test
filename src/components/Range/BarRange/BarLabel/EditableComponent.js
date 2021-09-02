import React from 'react';
import PropTypes from "prop-types";

const _ = () => {};

export const EditableComponent = ({
  className, contentEditable, onKeyPress, onBlur, htmlContent, innerRef
}) => (
  <div
    className={className}
    ref={innerRef}
    contentEditable={contentEditable}
    onKeyPress={onKeyPress}
    onBlur={onBlur}
    suppressContentEditableWarning
    dangerouslySetInnerHTML={{ __html: htmlContent }}
  />
);

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

