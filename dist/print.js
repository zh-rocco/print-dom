var IFRAME_STYLE = "position: absolute; top: 0; left: 0; width: 0; height: 0; border: none;";
function isFunction(f) {
    return Object.prototype.toString.call(f) === "[object Function]";
}
function isArray(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
}
var Print = /** @class */ (function () {
    function Print(el, options) {
        if (options === void 0) { options = {}; }
        // not called with 'new'
        if (!(this instanceof Print)) {
            return new Print(el, options);
        }
        var printElement = this.getPrintElement(el);
        if (printElement instanceof HTMLElement) {
            this.el = printElement;
            this.options = Object.assign({ noPrint: [".no-print"] }, options);
            this.init();
        }
    }
    Print.prototype.init = function () {
        this.writeIframe();
    };
    Print.prototype.getPrintElement = function (el) {
        if (typeof el === "string") {
            return document.querySelector(el);
        }
        else if (el instanceof HTMLElement) {
            return el;
        }
    };
    Print.prototype.getHead = function () {
        return "<head>" + (this.getStyle() + this.getTitle()) + "</head>";
    };
    Print.prototype.getStyle = function () {
        var styles = document.querySelectorAll("link[rel=\"stylesheet\"], style[type=\"text/css\"]");
        var styleList = Array.prototype.slice.call(styles).map(function (s) { return s.outerHTML; });
        var style = this.options.style;
        if (typeof style === "string") {
            styleList.push(style);
        }
        styleList.push(this.getNoPrintStyle());
        return styleList.join("");
    };
    Print.prototype.getNoPrintStyle = function () {
        var noPrint = this.options.noPrint;
        if (isArray(noPrint) && noPrint.length) {
            return "<style type=\"text/css\">" + noPrint.join(", ") + " { display: none; }</style>";
        }
        else {
            return "";
        }
    };
    Print.prototype.getTitle = function () {
        var documentTitle = this.options.documentTitle;
        return documentTitle ? "<title>" + documentTitle + "</title>" : "";
    };
    Print.prototype.getBody = function () {
        var wrapClass = this.options.wrapClass;
        var classStr = wrapClass ? " class=\"" + wrapClass + "\"" : "";
        return "<body" + classStr + ">" + this.el.outerHTML + "</body>";
    };
    Print.prototype.writeIframe = function () {
        var _this = this;
        var existedIframe = document.querySelector("iframe#print-js-iframe");
        var iframe;
        if (existedIframe) {
            iframe = existedIframe;
        }
        else {
            iframe = document.createElement("iframe");
            iframe.setAttribute("id", "print-js-iframe");
            iframe.setAttribute("style", IFRAME_STYLE);
            document.getElementsByTagName("body")[0].appendChild(iframe);
        }
        // warning:
        // 1. call print when iframe loaded;
        // 2. add onload event before calling doc.write().
        iframe.onload = function () { return _this.print(); };
        this.iframeWindow = (iframe.contentWindow || iframe.contentDocument);
        var content = this.getHead() + this.getBody();
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    };
    Print.prototype.print = function () {
        var _this = this;
        this.iframeWindow.focus();
        this.iframeWindow.print();
        var onPrintDialogClose = this.options.onPrintDialogClose;
        if (isFunction(onPrintDialogClose)) {
            onPrintDialogClose();
        }
        setTimeout(function () {
            _this.destroy();
        }, 0);
    };
    Print.prototype.destroy = function () {
        this.el = null;
        this.options = null;
        this.iframeWindow = null;
    };
    return Print;
}());
export default Print;
