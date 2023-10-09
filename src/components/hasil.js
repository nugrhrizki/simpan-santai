import { html } from "../lib/dom";
import { TextInput } from "./text-input";

export function Hasil(props) {
  return html`
    ${TextInput({
      id: "hasil",
      placeholder: "Hasil",
      pre: "Rp",
      ...props,
    })}
  `;
}
