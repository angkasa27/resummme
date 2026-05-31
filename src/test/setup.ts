import "@testing-library/jest-dom/vitest";

// JSDOM does not implement matchMedia; provide a minimal stub so hooks that
// call window.matchMedia (e.g. useIsMobile) don't throw in unit tests.
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

const zeroDomRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  toJSON() {
    return this;
  },
};

if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => zeroDomRect as DOMRect;
}

if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () =>
    ({
      length: 0,
      item: () => null,
      [Symbol.iterator]: function* () {},
    }) as DOMRectList;
}
