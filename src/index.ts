import Print, { El, Options } from "./print";

export default function printDOM(el: El, options: Options = {}) {
  // tslint:disable-next-line
  new Print(el, options);
}
