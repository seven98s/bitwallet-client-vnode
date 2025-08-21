const BitWeb = require('bitweb-ts');

interface Window {
    bitweb?: any;
}

// declare var window: Window & typeof globalThis;

declare global {
  var window: Window & typeof globalThis;
}