import 'jest-preset-angular/setup-env/zoneless';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize TestBed
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Mock window.matchMedia if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Element.scrollTo for JSDOM
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function(options?: ScrollToOptions | number, y?: number) {
    if (typeof options === 'object' && options !== null) {
      if (options.top !== undefined) {
        this.scrollTop = options.top;
      }
      if (options.left !== undefined) {
        this.scrollLeft = options.left;
      }
    } else if (typeof options === 'number') {
      this.scrollLeft = options;
      if (typeof y === 'number') {
        this.scrollTop = y;
      }
    }
  };
}
