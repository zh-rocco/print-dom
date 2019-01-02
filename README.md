# print-dom

> Lightweight and fast print tool for browser.

[![downloads](https://img.shields.io/npm/dt/print-dom.svg)](http://npm-stats.com/~packages/print-dom)
[![GitHub stars](https://img.shields.io/github/stars/zh-rocco/print-dom.svg)](https://github.com/zh-rocco/print-dom/stargazers)
[![devDependencies](https://img.shields.io/david/dev/zh-rocco/print-dom.svg)](https://david-dm.org/zh-rocco/print-dom?type=dev)
[![npm-version](https://img.shields.io/npm/v/print-dom.svg?maxAge=3600)](https://www.npmjs.com/package/print-dom)
[![Github tag](https://img.shields.io/github/tag/zh-rocco/print-dom.svg?maxAge=3600)](https://github.com/zh-rocco/print-dom/)
[![Build Status](https://travis-ci.org/zh-rocco/print-dom.svg?branch=master)](https://travis-ci.org/zh-rocco/print-dom)
[![GitHub license](https://img.shields.io/github/license/zh-rocco/print-dom.svg)](https://github.com/zh-rocco/print-dom/blob/master/LICENSE)

## Demo

[Try it out](https://zh-rocco.github.io/print-dom/)

## Advantages

- Simple API.
- Small bundle size: 3.8KB (1.54KB gzipped).
- No dependencies.
- Faster than [printJS](https://github.com/crabbly/Print.js/)

## Installation

```bash
npm i print-dom -S

# OR

yarn add print-dom -S
```

## Usage

```js
import printDOM from "print-dom";

printDOM(document.querySelector("#print"));
```

with options

```js
import printDOM from "print-dom";

printDOM(document.querySelector("#print"), {
  noPrint: [".header"],
  documentTitle: "Nice!!!",
  wrapClass: ".print-wrapper",
  style: ".print-wrapper { font-size: 16px; }",
});
```

## Options

| Property           | Description                                  | Type                               | Default              |
| :----------------- | :------------------------------------------- | :--------------------------------- | :------------------- |
| noPrint            | Ignore list when printing.                   | `String[]`                         | `[".no-print"]`      |
| documentTitle      | Print page's title.                          | `String`                           | Parent page's title. |
| style              | Custom style.                                | `String`                           | `void`               |
| wrapClass          | Print element's className.                   | `String`                           | `void`               |
| processor          | Process the DOM before print.                | `(el: HTMLElement) => HTMLElement` | `void`               |
| onPrintDialogClose | Run when the browser print dialog is closed. | `() => void`                       | `void`               |

## Build

```bash
yarn build
```

## Todo

- Add test files.

## License

MIT © [zh-rocco](https://github.com/zh-rocco)
