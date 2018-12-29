import Print from "./print";
import { PrintDOM } from "../types/index";

let printDOM: PrintDOM;
// tslint:disable-next-line
printDOM = (el, options) => new Print(el, options) && undefined;

export default printDOM;
