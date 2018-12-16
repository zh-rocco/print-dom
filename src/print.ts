const IFRAME_STYLE = "position: absolute; top: 0; left: 0; width: 0; height: 0; border: none;";

function isFunction(f: any) {
  return Object.prototype.toString.call(f) === "[object Function]";
}

function isArray(a: any) {
  return Object.prototype.toString.call(a) === "[object Array]";
}

export type El = string | HTMLElement;

export interface Options {
  noPrint?: string[];
  documentTitle?: string;
  style?: string;
  wrapClass?: string;
  onPrintDialogClose?: () => void;
}

export default class Print {
  private el!: HTMLElement;
  private options!: Options;
  private iframeWindow!: Window;

  constructor(el: El, options: Options = {}) {
    // not called with 'new'
    if (!(this instanceof Print)) {
      return new Print(el, options);
    }

    const printElement = this.getPrintElement(el);

    if (printElement instanceof HTMLElement) {
      this.el = printElement;
      this.options = Object.assign({ noPrint: [".no-print"] }, options);
      this.init();
    }
  }

  private init() {
    this.writeIframe();
  }

  private getPrintElement(el: string | HTMLElement) {
    if (typeof el === "string") {
      return document.querySelector(el as string);
    } else if (el instanceof HTMLElement) {
      return el;
    }
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
    const { wrapClass } = this.options;
    const classStr = wrapClass ? ` class="${wrapClass}"` : "";
    return `<body${classStr}>${this.el.outerHTML}</body>`;
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
    this.options = null!;
    this.iframeWindow = null!;
  }
}
