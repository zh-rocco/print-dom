export declare type El = string | HTMLElement;
export interface Options {
    noPrint?: string[];
    documentTitle?: string;
    style?: string;
    wrapClass?: string;
    onPrintDialogClose?: () => void;
}
export default class Print {
    private el;
    private options;
    private iframeWindow;
    constructor(el: El, options?: Options);
    private init;
    private getPrintElement;
    private getHead;
    private getStyle;
    private getNoPrintStyle;
    private getTitle;
    private getBody;
    private writeIframe;
    private print;
    private destroy;
}
