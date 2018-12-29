export interface Options {
  noPrint?: string[];
  documentTitle?: string;
  style?: string;
  wrapClass?: string;
  processor?: (el: HTMLElement) => HTMLElement;
  onPrintDialogClose?: () => void;
}

export interface PrintDOM {
  (el: HTMLElement, options?: Options): void;
}

export default PrintDOM;
