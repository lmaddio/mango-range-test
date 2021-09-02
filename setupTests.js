import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";

const CURRENCY = "€";
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class FakeMouseEvent extends MouseEvent {
  constructor(type, values) {
    const { clientX, ...mouseValues } = values;
    super(type, (mouseValues));

    Object.defineProperty(this, 'clientX', {
      value: clientX || 30
    });
  }
}

function getMouseEvent(
  type,
  values = {}
) {
  values = {
    bubbles: true,
    cancelable: true,
    ...values,
  };
  return new FakeMouseEvent(type, values);
}

let barRectMock = {
  width: 0,
  left: 0,
  right: 0,
}

function mockGetBoundingClientRect(values) {
  barRectMock = values;
}

Element.prototype.getBoundingClientRect = function () {
  return barRectMock;
};

window.ResizeObserver = ResizeObserver;

const getLabel = (value) => `${value} ${CURRENCY}`;

const BAR_PROPERTIES = {
  LEFT: 0,
  RIGHT: 200,
  WIDTH: 200
};
const MIN_MOCK_VALUE = 0;
const MAX_MOCK_VALUE = 300;

function getMousePositionForDotValue(dotValue) {
  const minBar = BAR_PROPERTIES.LEFT;
  const maxBar = BAR_PROPERTIES.WIDTH;

  return ((dotValue - MIN_MOCK_VALUE) / (MAX_MOCK_VALUE - MIN_MOCK_VALUE)) * (maxBar - minBar) + minBar;
}

global.mockGetBoundingClientRect = mockGetBoundingClientRect;
global.getMouseEvent = getMouseEvent;
global.getLabel = getLabel;
global.getMousePositionForDotValue = getMousePositionForDotValue;
