import { shadowMerge } from "./helper";
import { Options } from "../types/index";

const IFRAME_STYLE = "position: absolute; top: 0; left: 0; width: 0; height: 0; border: none;";

function isFunction(f: any) {
  return Object.prototype.toString.call(f) === "[object Function]";
}

function isArray(a: any) {
  return Object.prototype.toString.call(a) === "[object Array]";
}

export default class Print {
  private el!: HTMLElement;
  private options!: Options;
  private iframe!: HTMLIFrameElement;
  private iframeWindow!: Window;

  constructor(el: HTMLElement, options: Options = {}) {
    if (el instanceof HTMLElement) {
      this.el = el;
      this.options = shadowMerge({ noPrint: [".no-print"] }, options) as Options;
      this.init();
    } else {
      throw new TypeError(`expect "el" to be HTMLElement.`);
    }
  }

  private init() {
    this.writeIframe();
  }

  private getHead() {
    return `<head>${this.getStyle() + this.getTitle()}</head>`;
  }

  private getStyle() {
    const styles = document.querySelectorAll(`link[rel="stylesheet"], style[type="text/css"]`);
    const styleList = Array.prototype.slice.call(styles).map((s: Element) => s.outerHTML);
    const { style } = this.options;
    if (typeof style === "string") {
      styleList.push(style);
    }
    styleList.push(this.getNoPrintStyle());
    return styleList.join("");
  }

  private getNoPrintStyle() {
    const { noPrint } = this.options;
    if (isArray(noPrint) && (noPrint as string[]).length) {
      return `<style type="text/css">${noPrint!.join(", ")} { display: none; }</style>`;
    } else {
      return "";
    }
  }

  private getTitle() {
    const { documentTitle } = this.options;
    return documentTitle ? `<title>${documentTitle}</title>` : "";
  }

  private getBody() {
    const { wrapClass, processor } = this.options;
    let element: HTMLElement = this.el;

    if (isFunction(processor)) {
      element = processor!(element.cloneNode(true) as HTMLElement);
    }
    const classStr = wrapClass ? ` class="${wrapClass}"` : "";
    return `<body${classStr}>${element.outerHTML}</body>`;
  }

  private writeIframe() {
    const existedIframe = document.querySelector("iframe#print-js-iframe") as HTMLIFrameElement;
    let iframe: HTMLIFrameElement;

    if (existedIframe) {
      iframe = existedIframe;
    } else {
      iframe = document.createElement("iframe");
      iframe.setAttribute("id", "print-js-iframe");
      iframe.setAttribute("style", IFRAME_STYLE);
      document.getElementsByTagName("body")[0].appendChild(iframe);
    }

    // warning:
    // 1. call print when iframe loaded;
    // 2. add onload event before calling doc.write().
    iframe.onload = () => this.print();
    this.iframe = iframe;
    this.iframeWindow = (iframe.contentWindow || iframe.contentDocument) as Window;
    const content = this.getHead() + this.getBody();
    const doc = iframe.contentDocument || (iframe.contentWindow as Window).document;
    doc.open();
    doc.write(content);
    doc.close();
  }

  private print() {
    this.iframeWindow.focus();
    this.iframeWindow.print();

    const { onPrintDialogClose } = this.options;
    if (isFunction(onPrintDialogClose)) {
      (onPrintDialogClose as () => void)();
    }

    setTimeout(() => {
      this.destroy();
    }, 0);
  }

  private destroy() {
    this.el = null!;
    this.iframe.onload = null;
    this.iframe = null!;
    this.iframeWindow = null!;
  }
}
