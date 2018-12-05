const IFRAME_STYLE = "position: absolute; top: 0; left: 0; width: 0; height: 0; border: none;";

function isFunction(f: any) {
  return Object.prototype.toString.call(f) === "[object Function]";
}

function isArray(a: any) {
  return Object.prototype.toString.call(a) === "[object Array]";
}

export interface Options {
  noPrint?: string[];
  documentTitle?: string;
  style?: string;
  wrapClass?: string;
  onPrintDialogClose?: () => void;
}

export default class Print {
  private el: any;
  private options: Options = {};
  private iframe: any;
  private printWindow: any;

  constructor(el: string | HTMLElement, options: Options = {}) {
    // not called with 'new'
    if (!(this instanceof Print)) {
      return new Print(el, options);
    }

    this.el = this.getElement(el);
    this.options = Object.assign({ noPrint: [".no-print"] }, options);
    this.init();
  }

  private init() {
    this.writeIframe();
    setTimeout(() => {
      this.print();
    }, 0);
  }

  private getElement(el: any) {
    const type = typeof el;
    if (type === "string") {
      return document.querySelector(el as string);
    } else if (type === "object" && el.nodeName) {
      return el;
    } else {
      throw new Error("PrintJS: invalid parameter el.");
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
    if (isArray(noPrint) && noPrint!.length) {
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
    return `<body class="${wrapClass || ""}">${this.el.outerHTML}</body>`;
  }

  private writeIframe() {
    const content = this.getHead() + this.getBody();
    const iframe = document.createElement("iframe");
    this.iframe = document.body.appendChild(iframe);
    iframe.setAttribute("style", IFRAME_STYLE);
    const win = iframe.contentWindow || iframe.contentDocument;
    this.printWindow = win;
    const doc = iframe.contentDocument || (iframe.contentWindow as any).document;
    doc.open();
    doc.write(content);
    doc.close();
  }

  private print() {
    this.printWindow.focus();
    this.printWindow.print();
    this.printWindow.close();

    const { onPrintDialogClose } = this.options;
    if (isFunction(onPrintDialogClose)) {
      onPrintDialogClose!();
    }

    setTimeout(() => {
      document.body.removeChild(this.iframe);
      this.destroy();
    }, 0);
  }

  private destroy() {
    this.el = null;
    this.iframe = null;
    this.printWindow = null;
  }
}
