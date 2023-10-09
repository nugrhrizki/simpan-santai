import { html } from "../lib/dom";
import { TextInput } from "./text-input";

export function Hasil({ label, value }) {
  return html`
    ${TextInput({
      label,
      id: "hasil",
      placeholder: "Hasil",
      pre: "Rp",
      value,
    })}
  `;
}
