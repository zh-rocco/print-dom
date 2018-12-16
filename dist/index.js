import Print from "./print";
export default function printDOM(el, options) {
    if (options === void 0) { options = {}; }
    // tslint:disable-next-line
    new Print(el, options);
}
